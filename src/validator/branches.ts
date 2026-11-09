import type { AssignmentNode, ComputationDocument } from "./computation.js";
import type { ActionNode } from "./actions.js";
import type { Diagnostic } from "./diagnostics.js";
import { normalizeSemanticDiagnostics } from "./diagnostics.js";
import { analyzeExpression } from "./expressions.js";
import type { Expression, ExpressionAnalysis } from "./expressions.js";
import { validateVariables } from "./variables.js";
import type { Variable } from "./variables.js";

export interface BranchNode {
  id: string;
  kind: "branch";
  condition: Expression;
}

export interface BranchAction {
  id: string;
  entryNodeId: string;
  inputs: Variable[];
  outputs: Variable[];
  locals: Variable[];
  nodes: (ActionNode | AssignmentNode | BranchNode)[];
  connections: {
    fromNodeId: string;
    toNodeId: string;
    label?: "true" | "false";
  }[];
}

export interface BranchDocument extends Omit<
  ComputationDocument,
  "irVersion" | "actions"
> {
  irVersion: "0.1.0-draft.5";
  actions: BranchAction[];
}

function graph(action: BranchAction, path: string) {
  const diagnostics: Diagnostic[] = [];
  const incoming: number[][] = action.nodes.map(() => []);
  const outgoing: number[][] = action.nodes.map(() => []);
  const order: number[] = [];

  const report = (code: string, suffix: string, message: string) => {
    diagnostics.push({ code, severity: "error", path: path + suffix, message });
  };

  const index = new Map<string, number>();
  let duplicate = false;

  action.nodes.forEach((node, i) => {
    if (index.has(node.id)) {
      duplicate = true;
      report(
        "AFIR-NODE-001",
        `/nodes/${i}/id`,
        "Node ID is duplicated within this action.",
      );
    }

    index.set(node.id, i);
  });

  for (const [kind, code] of [
    ["start", "AFIR-FLOW-001"],
    ["end", "AFIR-FLOW-002"],
  ] as const) {
    if (action.nodes.filter((node) => node.kind === kind).length !== 1) {
      report(code, "/nodes", `Action must contain exactly one ${kind} node.`);
    }
  }

  if (duplicate) {
    return { diagnostics, incoming, outgoing, order };
  }

  const entry = index.get(action.entryNodeId);

  if (entry === undefined) {
    report(
      "AFIR-REF-001",
      "/entryNodeId",
      "Entry node does not resolve within this action.",
    );
  } else if (action.nodes[entry]!.kind !== "start") {
    report(
      "AFIR-FLOW-003",
      "/entryNodeId",
      "Entry must identify the start node.",
    );
  }

  const triples = new Set<string>();
  const outcomes = new Map<number, Set<string>>();

  action.connections.forEach((connection, i) => {
    const suffix = `/connections/${i}`;
    const from = index.get(connection.fromNodeId);
    const to = index.get(connection.toNodeId);

    for (const field of ["fromNodeId", "toNodeId"] as const) {
      if (!index.has(connection[field])) {
        report(
          "AFIR-REF-001",
          `${suffix}/${field}`,
          "Connection endpoint does not resolve within this action.",
        );
      }
    }

    const triple = JSON.stringify([
      connection.fromNodeId,
      connection.toNodeId,
      connection.label ?? null,
    ]);

    if (triples.has(triple)) {
      report(
        "AFIR-FLOW-004",
        suffix,
        "Connection endpoint/outcome triple is duplicated.",
      );
    }

    triples.add(triple);

    if (connection.fromNodeId === connection.toNodeId) {
      report(
        "AFIR-FLOW-005",
        suffix,
        "A connection must not reference the same node at both ends.",
      );
    }

    if (from !== undefined) {
      if (action.nodes[from]!.kind === "branch") {
        if (connection.label === undefined) {
          report(
            "AFIR-BRANCH-004",
            suffix + "/label",
            "Branch connections require an outcome label.",
          );
        } else {
          const seen = outcomes.get(from) ?? new Set<string>();

          if (seen.has(connection.label)) {
            report(
              "AFIR-BRANCH-003",
              suffix + "/label",
              "Branch outcome is duplicated.",
            );
          }

          seen.add(connection.label);
          outcomes.set(from, seen);
        }
      } else if (connection.label !== undefined) {
        report(
          "AFIR-BRANCH-005",
          suffix + "/label",
          "Only branch connections may have outcome labels.",
        );
      }
    }

    if (from !== undefined && to !== undefined) {
      outgoing[from]!.push(to);
      incoming[to]!.push(from);
    }
  });

  action.nodes.forEach((node, i) => {
    if (
      node.kind === "branch" &&
      (!outcomes.get(i)?.has("true") || !outcomes.get(i)?.has("false"))
    ) {
      report(
        "AFIR-BRANCH-002",
        `/nodes/${i}`,
        "Branch requires one true and one false outcome.",
      );
    }
  });

  if (diagnostics.length > 0) {
    return { diagnostics, incoming, outgoing, order };
  }

  const reachable = new Set<number>();
  const pending = [entry!];

  while (pending.length > 0) {
    const n = pending.pop()!;

    if (reachable.has(n)) {
      continue;
    }

    reachable.add(n);

    for (const target of outgoing[n]!) {
      pending.push(target);
    }
  }

  action.nodes.forEach((node, i) => {
    const inCount = incoming[i]!.length;
    const outCount = outgoing[i]!.length;
    const valid =
      node.kind === "start"
        ? inCount === 0 && outCount === 1
        : inCount >= 1 &&
          outCount ===
            (node.kind === "end" ? 0 : node.kind === "branch" ? 2 : 1);

    if (!valid) {
      report(
        "AFIR-FLOW-006",
        `/nodes/${i}`,
        "Node incoming or outgoing connection count is invalid for its kind.",
      );
    }

    if (!reachable.has(i)) {
      report(
        "AFIR-FLOW-007",
        `/nodes/${i}`,
        "Node is not reachable from entry.",
      );
    }
  });

  const remaining = incoming.map((edges) => edges.length);
  const queue = action.nodes
    .map((_node, i) => i)
    .filter((i) => remaining[i] === 0);

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const n = queue[cursor]!;

    order.push(n);

    for (const target of outgoing[n]!) {
      remaining[target] = remaining[target]! - 1;

      if (remaining[target] === 0) {
        queue.push(target);
      }
    }
  }

  if (order.length !== action.nodes.length) {
    report("AFIR-FLOW-008", "/nodes", "Action graph must be acyclic.");
  }

  return { diagnostics, incoming, outgoing, order };
}

function checkAction(action: BranchAction, path: string): Diagnostic[] {
  const topology = graph(action, path);
  const declarations = validateVariables(action, path, false);
  const diagnostics = [...topology.diagnostics, ...declarations];
  const ordered = [...action.inputs, ...action.outputs, ...action.locals];
  const variables =
    declarations.length === 0
      ? new Map(ordered.map((variable) => [variable.id, variable]))
      : undefined;
  const variableIndices = new Map(
    ordered.map((variable, i) => [variable.id, i]),
  );
  const inputIds = new Set(action.inputs.map((variable) => variable.id));
  const analyses = new Map<
    number,
    { expression: ExpressionAnalysis; valid: boolean }
  >();

  action.nodes.forEach((node, i) => {
    if (node.kind !== "assign" && node.kind !== "branch") {
      return;
    }

    const nodePath = `${path}/nodes/${i}`;
    const expression = analyzeExpression(
      node.kind === "assign" ? node.value : node.condition,
      nodePath + (node.kind === "assign" ? "/value" : "/condition"),
      variables,
    );
    let valid =
      expression.diagnostics.length === 0 && expression.type !== undefined;

    diagnostics.push(...expression.diagnostics);

    if (variables) {
      if (node.kind === "branch") {
        if (expression.type !== undefined && expression.type !== "Boolean") {
          valid = false;
          diagnostics.push({
            code: "AFIR-BRANCH-001",
            severity: "error",
            path: nodePath + "/condition",
            message: "Branch condition must have type Boolean.",
          });
        }
      } else {
        const target = variables.get(node.targetVariableId);

        if (!target) {
          valid = false;
          diagnostics.push({
            code: "AFIR-REF-001",
            severity: "error",
            path: nodePath + "/targetVariableId",
            message:
              "Assignment destination does not resolve within this action.",
          });
        } else if (inputIds.has(target.id)) {
          valid = false;
          diagnostics.push({
            code: "AFIR-ASSIGN-001",
            severity: "error",
            path: nodePath + "/targetVariableId",
            message: "Inputs are read-only assignment destinations.",
          });
        } else if (
          expression.type !== undefined &&
          expression.type !== target.type
        ) {
          valid = false;
          diagnostics.push({
            code: "AFIR-TYPE-003",
            severity: "error",
            path: nodePath + "/value",
            message:
              "Assignment value and destination must have matching types.",
          });
        }
      }
    }

    analyses.set(i, { expression, valid });
  });

  if (topology.diagnostics.length > 0 || !variables) {
    return diagnostics;
  }

  // Immutable predecessor states are shared by outgoing edges, including parallel outcomes.
  const states = new Map<number, Uint32Array | undefined>();
  const words = Math.ceil(ordered.length / 32);

  const set = (state: Uint32Array, variable: number) => {
    const word = Math.floor(variable / 32);

    state[word] = state[word]! | (1 << (variable % 32));
  };

  const has = (state: Uint32Array, variable: number) =>
    (state[Math.floor(variable / 32)]! & (1 << (variable % 32))) !== 0;

  for (const i of topology.order) {
    const node = action.nodes[i]!;
    let state: Uint32Array;

    if (node.kind === "start") {
      state = new Uint32Array(words);

      for (let n = 0; n < action.inputs.length; n += 1) {
        set(state, n);
      }
    } else {
      const predecessors = topology.incoming[i]!;

      if (predecessors.some((n) => !states.has(n))) {
        throw new Error("Topological predecessor state is missing");
      }

      if (predecessors.some((n) => states.get(n) === undefined)) {
        states.set(i, undefined);

        continue;
      }

      state = new Uint32Array(states.get(predecessors[0]!)!);

      for (let p = 1; p < predecessors.length; p += 1) {
        const other = states.get(predecessors[p]!)!;

        for (let w = 0; w < words; w += 1) {
          state[w] = state[w]! & other[w]!;
        }
      }
    }

    if (node.kind === "assign" || node.kind === "branch") {
      const analysis = analyses.get(i)!;
      let valid = analysis.valid;

      for (const read of analysis.expression.reads) {
        if (!has(state, variableIndices.get(read.id)!)) {
          valid = false;
          diagnostics.push({
            code: "AFIR-INIT-002",
            severity: "error",
            path: read.path,
            message: "Variable is read before initialization.",
          });
        }
      }

      if (!valid) {
        states.set(i, undefined);

        continue;
      }

      if (node.kind === "assign") {
        set(state, variableIndices.get(node.targetVariableId)!);
      }
    } else if (node.kind === "end") {
      action.outputs.forEach((output, o) => {
        if (!has(state, variableIndices.get(output.id)!)) {
          diagnostics.push({
            code: "AFIR-INIT-001",
            severity: "error",
            path: `${path}/outputs/${o}/id`,
            message: "Output is uninitialized at normal completion.",
          });
        }
      });
    }

    states.set(i, state);
  }

  return diagnostics;
}

// Called only after matching schema and draft.5 resource accounting succeed.
export function validateBranchDocument(document: BranchDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const ids = new Set<string>();

  document.actions.forEach((action, i) => {
    const path = `/actions/${i}`;

    if (ids.has(action.id)) {
      diagnostics.push({
        code: "AFIR-ACTION-001",
        severity: "error",
        path: path + "/id",
        message: "Action ID is duplicated within this document.",
      });
    }

    ids.add(action.id);
    diagnostics.push(...checkAction(action, path));
  });

  return normalizeSemanticDiagnostics(diagnostics);
}
