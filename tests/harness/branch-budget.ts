import type { BranchDocument } from "../../src/validator/branches.js";

// Exactly 25,000 nodes/edges and 3,200 declarations: 5,000,000 word units.
export function branchBudgetDocument(extraNodes = 0): BranchDocument {
  const tailLength = 24_995 + extraNodes;
  const action: BranchDocument["actions"][number] = {
    id: "budget",
    entryNodeId: "start",
    inputs: [{ id: "Flag", name: "Flag", type: "Boolean" }],
    outputs: [{ id: "Result", name: "Result", type: "Integer" }],
    locals: Array.from({ length: 3_198 }, (_unused, i) => ({
      id: `v${i}`,
      name: `v${i}`,
      type: "Integer",
    })),
    nodes: [
      { id: "start", kind: "start" },
      {
        id: "check",
        kind: "branch",
        condition: { kind: "variable", variableId: "Flag" },
      },
      {
        id: "left",
        kind: "assign",
        targetVariableId: "Result",
        value: { kind: "literal", type: "Integer", value: "1" },
      },
      {
        id: "right",
        kind: "assign",
        targetVariableId: "Result",
        value: { kind: "literal", type: "Integer", value: "2" },
      },
      { id: "end", kind: "end" },
    ],
    connections: [
      { fromNodeId: "start", toNodeId: "check" },
      { fromNodeId: "check", toNodeId: "left", label: "true" },
      { fromNodeId: "check", toNodeId: "right", label: "false" },
      { fromNodeId: "left", toNodeId: "tail0" },
      { fromNodeId: "right", toNodeId: "end" },
    ],
  };

  for (let i = 0; i < tailLength; i += 1) {
    action.nodes.push({
      id: `tail${i}`,
      kind: "assign",
      targetVariableId: "Result",
      value: { kind: "literal", type: "Integer", value: "1" },
    });
    action.connections.push({
      fromNodeId: `tail${i}`,
      toNodeId: i + 1 === tailLength ? "end" : `tail${i + 1}`,
    });
  }

  return { irVersion: "0.1.0-draft.5", id: "budget", actions: [action] };
}
