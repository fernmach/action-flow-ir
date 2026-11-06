import type { Diagnostic } from "./diagnostics.js";

export interface ActionNode {
  id: string;
  kind: "start" | "end";
}

export interface Connection {
  fromNodeId: string;
  toNodeId: string;
}

export interface Action {
  id: string;
  entryNodeId: string;
  nodes: ActionNode[];
  connections: Connection[];
}

export interface ActionDocument {
  irVersion: "0.1.0-draft.2";
  id: string;
  metadata?: { title?: string; description?: string };
  source?: { technology: string; version?: string };
  actions: Action[];
}

function checkAction(action: Action, path: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  const report = (code: string, suffix: string, message: string) => {
    diagnostics.push({ code, severity: "error", path: path + suffix, message });
  };

  const nodes = new Map<string, ActionNode>();
  let duplicateNodes = false;

  action.nodes.forEach((node, index) => {
    if (nodes.has(node.id)) {
      report(
        "AFIR-NODE-001",
        `/nodes/${index}/id`,
        "Node ID is duplicated within this action.",
      );
      duplicateNodes = true;
    }

    nodes.set(node.id, node);
  });

  for (const [kind, code] of [
    ["start", "AFIR-FLOW-001"],
    ["end", "AFIR-FLOW-002"],
  ] as const) {
    if (action.nodes.filter((node) => node.kind === kind).length !== 1) {
      report(code, "/nodes", `Action must contain exactly one ${kind} node.`);
    }
  }

  if (duplicateNodes) {
    return diagnostics;
  }

  const entry = nodes.get(action.entryNodeId);

  if (!entry) {
    report(
      "AFIR-REF-001",
      "/entryNodeId",
      "Entry node does not resolve within this action.",
    );
  } else if (entry.kind !== "start") {
    report(
      "AFIR-FLOW-003",
      "/entryNodeId",
      "Entry must identify the start node.",
    );
  }

  const pairs = new Set<string>();
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, number>();

  action.connections.forEach((connection, index) => {
    const suffix = `/connections/${index}`;

    for (const field of ["fromNodeId", "toNodeId"] as const) {
      if (!nodes.has(connection[field])) {
        report(
          "AFIR-REF-001",
          `${suffix}/${field}`,
          "Connection endpoint does not resolve within this action.",
        );
      }
    }

    const pair = JSON.stringify([connection.fromNodeId, connection.toNodeId]);

    if (pairs.has(pair)) {
      report(
        "AFIR-FLOW-004",
        suffix,
        "Connection endpoint pair is duplicated.",
      );
    }

    pairs.add(pair);

    if (connection.fromNodeId === connection.toNodeId) {
      report(
        "AFIR-FLOW-005",
        suffix,
        "A connection must not reference the same node at both ends.",
      );
    }

    const targets = outgoing.get(connection.fromNodeId) ?? [];

    targets.push(connection.toNodeId);
    outgoing.set(connection.fromNodeId, targets);
    incoming.set(
      connection.toNodeId,
      (incoming.get(connection.toNodeId) ?? 0) + 1,
    );
  });

  if (diagnostics.length > 0) {
    return diagnostics;
  }

  const reachable = new Set<string>();
  const pending = [action.entryNodeId];

  while (pending.length > 0) {
    const id = pending.pop();

    if (id === undefined || reachable.has(id)) {
      continue;
    }

    reachable.add(id);

    for (const target of outgoing.get(id) ?? []) {
      pending.push(target);
    }
  }

  action.nodes.forEach((node, index) => {
    const inDegree = incoming.get(node.id) ?? 0;
    const outDegree = outgoing.get(node.id)?.length ?? 0;
    const validDegree =
      node.kind === "start"
        ? inDegree === 0 && outDegree === 1
        : inDegree === 1 && outDegree === 0;

    if (!validDegree) {
      report(
        "AFIR-FLOW-006",
        `/nodes/${index}`,
        "Node incoming or outgoing connection count is invalid for its kind.",
      );
    }

    if (!reachable.has(node.id)) {
      report(
        "AFIR-FLOW-007",
        `/nodes/${index}`,
        "Node is not reachable from entry.",
      );
    }
  });

  return diagnostics;
}

// Called only after the matching structural schema has succeeded.
export function validateActions(document: ActionDocument): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const actionIds = new Set<string>();

  document.actions.forEach((action, index) => {
    const path = `/actions/${index}`;

    if (actionIds.has(action.id)) {
      diagnostics.push({
        code: "AFIR-ACTION-001",
        severity: "error",
        path: path + "/id",
        message: "Action ID is duplicated within this document.",
      });
    }

    actionIds.add(action.id);
    diagnostics.push(...checkAction(action, path));
  });

  diagnostics.sort((a, b) => {
    for (const key of ["path", "code", "message"] as const) {
      const left = a[key] ?? "";
      const right = b[key] ?? "";

      if (left < right) {
        return -1;
      }

      if (left > right) {
        return 1;
      }
    }

    return 0;
  });

  const seen = new Set<string>();

  return diagnostics.filter((diagnostic) => {
    const key = JSON.stringify(diagnostic);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}
