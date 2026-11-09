import type { ActionNode } from "./actions.js";
import type { Diagnostic } from "./diagnostics.js";
import { analyzeExpression } from "./expressions.js";
import type { Expression, ExpressionAnalysis } from "./expressions.js";
import { validateVariables } from "./variables.js";
import type {
  TypedAction,
  TypedActionDocument,
  Variable,
} from "./variables.js";

export interface AssignmentNode {
  id: string;
  kind: "assign";
  targetVariableId: string;
  value: Expression;
}

export interface ComputationAction extends Omit<TypedAction, "nodes"> {
  nodes: (ActionNode | AssignmentNode)[];
}

export interface ComputationDocument extends Omit<
  TypedActionDocument,
  "irVersion" | "actions"
> {
  irVersion: "0.1.0-draft.4";
  actions: ComputationAction[];
}

export function validateComputation(
  action: ComputationAction,
  path: string,
  graphValid: boolean,
): Diagnostic[] {
  const diagnostics = validateVariables(action, path, false);
  const variables =
    diagnostics.length === 0
      ? new Map<string, Variable>(
          [...action.inputs, ...action.outputs, ...action.locals].map(
            (variable) => [variable.id, variable],
          ),
        )
      : undefined;
  const inputIds = new Set(action.inputs.map((variable) => variable.id));
  const analyses = new Map<
    number,
    { expression: ExpressionAnalysis; valid: boolean }
  >();

  action.nodes.forEach((node, index) => {
    if (node.kind !== "assign") {
      return;
    }

    const nodePath = `${path}/nodes/${index}`;
    const expression = analyzeExpression(
      node.value,
      nodePath + "/value",
      variables,
    );
    const target = variables?.get(node.targetVariableId);
    const writable = target !== undefined && !inputIds.has(target.id);
    let valid =
      expression.diagnostics.length === 0 &&
      expression.type !== undefined &&
      writable;

    diagnostics.push(...expression.diagnostics);

    if (variables) {
      if (!target) {
        diagnostics.push({
          code: "AFIR-REF-001",
          severity: "error",
          path: nodePath + "/targetVariableId",
          message:
            "Assignment destination does not resolve within this action.",
        });
      } else if (!writable) {
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
          message: "Assignment value and destination must have matching types.",
        });
      }
    }

    analyses.set(index, { expression, valid });
  });

  if (!graphValid || !variables) {
    return diagnostics;
  }

  const initialized = new Set(inputIds);
  const nodes = new Map(
    action.nodes.map((node, index) => [node.id, { node, index }]),
  );
  const outgoing = new Map(
    action.connections.map((connection) => [
      connection.fromNodeId,
      connection.toNodeId,
    ]),
  );
  const visited = new Set<string>();
  let current: string | undefined = action.entryNodeId;

  while (current !== undefined && !visited.has(current)) {
    visited.add(current);

    const entry = nodes.get(current)!;
    const node = entry.node;

    if (node.kind === "assign") {
      const analysis = analyses.get(entry.index)!;
      let valid = analysis.valid;

      for (const read of analysis.expression.reads) {
        if (!initialized.has(read.id)) {
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
        return diagnostics;
      }

      initialized.add(node.targetVariableId);
    } else if (node.kind === "end") {
      action.outputs.forEach((output, index) => {
        if (!initialized.has(output.id)) {
          diagnostics.push({
            code: "AFIR-INIT-001",
            severity: "error",
            path: `${path}/outputs/${index}/id`,
            message: "Output is uninitialized at normal completion.",
          });
        }
      });

      return diagnostics;
    }

    current = outgoing.get(current);
  }

  // Structural/graph prerequisites guarantee reaching end, never silent success.
  throw new Error("Validated linear graph did not reach end");
}
