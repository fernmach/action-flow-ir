import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { validateActions } from "../../src/validator/actions.js";
import type { BranchDocument } from "../../src/validator/branches.js";
import { validateDocument } from "../../src/validator/index.js";
import {
  dataFlowWordUnits,
  DATA_FLOW_WORD_LIMIT,
  exceedsContainerLimits,
} from "../../src/validator/limits.js";
import { schemas } from "../../src/validator/schema.js";
import { branchBudgetDocument } from "../harness/branch-budget.js";

const text = await readFile(
  new URL(
    "../../tests/conformance/branches/initialize-both-arms.input.txt",
    import.meta.url,
  ),
  "utf8",
);
const document = JSON.parse(text) as BranchDocument;

test("branch analysis preserves input and depends on edges rather than array/property order", () => {
  const input = structuredClone(document);

  for (const action of input.actions) {
    action.nodes.reverse();
    action.connections.reverse();
  }

  const before = structuredClone(input);

  expect(validateActions(input)).toEqual([]);
  expect(input).toEqual(before);
  expect(
    validateDocument(
      JSON.stringify(Object.fromEntries(Object.entries(input).reverse())),
    ),
  ).toEqual({ status: "valid", diagnostics: [] });
});

test("path-local recovery reports the unaffected arm and deterministically suppresses the tainted end", () => {
  const input = structuredClone(document);
  const action = input.actions[0]!;
  const left = action.nodes[2]!;
  const right = action.nodes[3]!;

  if (left.kind !== "assign" || right.kind !== "assign") {
    throw new Error("Missing assignments");
  }

  action.locals.push({ id: "Local", name: "Local", type: "Integer" });
  left.targetVariableId = "missing";
  right.value = { kind: "variable", variableId: "Local" };

  const before = structuredClone(input);
  const result = validateActions(input);

  expect(result.map(({ code, path }) => ({ code, path }))).toEqual([
    { code: "AFIR-REF-001", path: "/actions/0/nodes/2/targetVariableId" },
    { code: "AFIR-INIT-002", path: "/actions/0/nodes/3/value/variableId" },
  ]);
  expect(validateActions(input)).toEqual(result);
  expect(validateDocument(JSON.stringify(input)).diagnostics).toEqual(result);
  expect(input).toEqual(before);
});

test("intersection preserves signed bit 31 and the next word without accepting one-arm writes", () => {
  const input = structuredClone(document);
  const a = input.actions[0]!;

  a.locals = [
    ...Array.from({ length: 29 }, (_unused, i) => ({
      id: `v${i}`,
      name: `v${i}`,
      type: "Integer" as const,
    })),
    { id: "Shared", name: "Shared", type: "Integer" },
    { id: "Next", name: "Next", type: "Integer" },
  ];

  for (const i of [2, 3]) {
    const n = a.nodes[i]!;

    if (n.kind !== "assign") {
      throw new Error("Missing assignment");
    }

    n.targetVariableId = "Shared";
  }

  a.nodes.push(
    {
      id: "join",
      kind: "assign",
      targetVariableId: "Next",
      value: { kind: "variable", variableId: "Shared" },
    },
    {
      id: "copy",
      kind: "assign",
      targetVariableId: "Result",
      value: { kind: "variable", variableId: "Next" },
    },
  );
  a.connections[3]!.toNodeId = "join";
  a.connections[4]!.toNodeId = "join";
  a.connections.push(
    { fromNodeId: "join", toNodeId: "copy" },
    { fromNodeId: "copy", toNodeId: "end" },
  );

  expect(validateDocument(JSON.stringify(input)).status).toBe("valid");

  const right = a.nodes[3]!;

  if (right.kind !== "assign") {
    throw new Error("Missing assignment");
  }

  right.targetVariableId = "Next";
  expect(
    validateDocument(JSON.stringify(input)).diagnostics.map(
      ({ code, path }) => ({ code, path }),
    ),
  ).toEqual([
    { code: "AFIR-INIT-002", path: "/actions/0/nodes/5/value/variableId" },
  ]);
});

test("schema rejects rather than mutates malformed branch fields and exposes only applicable errors", () => {
  const input = structuredClone(document);
  const n = input.actions[0]!.nodes[1]!;

  Reflect.deleteProperty(n, "condition");

  const before = structuredClone(input);

  expect(schemas.get("0.1.0-draft.5")!(input)).toBe(false);
  expect(input).toEqual(before);
  expect(
    validateDocument(JSON.stringify(input)).diagnostics.map(
      ({ code, path }) => ({ code, path }),
    ),
  ).toEqual([
    { code: "AFIR-SCHEMA-001", path: "/actions/0/nodes/1/condition" },
  ]);
});

test("word accounting rounds declarations per action and sums the document", () => {
  const shape = (declarations: number) => ({
    nodes: new Array<unknown>(2),
    connections: new Array<unknown>(1),
    inputs: new Array<unknown>(declarations),
    outputs: [],
    locals: [],
  });

  expect(dataFlowWordUnits({ actions: [shape(0)] })).toBe(3);
  expect(dataFlowWordUnits({ actions: [shape(32)] })).toBe(3);
  expect(dataFlowWordUnits({ actions: [shape(33)] })).toBe(6);
  expect(dataFlowWordUnits({ actions: [shape(32), shape(33)] })).toBe(9);

  const exact = {
    nodes: new Array<unknown>(25_000),
    connections: new Array<unknown>(25_000),
    inputs: new Array<unknown>(3_200),
    outputs: [],
    locals: [],
  };

  expect(dataFlowWordUnits({ actions: [exact] })).toBe(DATA_FLOW_WORD_LIMIT);
  exact.nodes.push({});
  expect(dataFlowWordUnits({ actions: [exact] })).toBe(
    DATA_FLOW_WORD_LIMIT + 100,
  );
});

test("inclusive budget admits a large valid DAG and rejects excess before semantic checks", () => {
  const atLimit = branchBudgetDocument();

  expect(exceedsContainerLimits(atLimit)).toBe(false);
  expect(dataFlowWordUnits(atLimit)).toBe(DATA_FLOW_WORD_LIMIT);
  expect(validateDocument(JSON.stringify(atLimit))).toEqual({
    status: "valid",
    diagnostics: [],
  });

  const excess = branchBudgetDocument(1);

  excess.actions[0]!.nodes[0]!.id = "duplicate";
  excess.actions[0]!.nodes[1]!.id = "duplicate";

  expect(validateDocument(JSON.stringify(excess))).toEqual({
    status: "tool-error",
    diagnostics: [
      {
        code: "AFIR-LIMIT-002",
        severity: "error",
        path: "",
        message: "Document exceeds validator data-flow limits.",
      },
    ],
  });
});

test("structural errors precede the word estimate, while container excess precedes structure", () => {
  const input = branchBudgetDocument(1);

  Reflect.deleteProperty(input.actions[0]!, "outputs");
  expect(
    validateDocument(JSON.stringify(input)).diagnostics.map(({ code }) => code),
  ).toEqual(["AFIR-SCHEMA-001"]);
  expect(
    validateDocument(
      JSON.stringify({
        irVersion: "0.1.0-draft.5",
        extra: Array.from({ length: 100_000 }, () => ({})),
      }),
    ).diagnostics.map(({ code }) => code),
  ).toEqual(["AFIR-LIMIT-001"]);
});

test("branch and parallel-edge behavior is isolated from every earlier draft", () => {
  expect(validateDocument(text).status).toBe("valid");

  for (const version of [
    "0.1.0-draft.1",
    "0.1.0-draft.2",
    "0.1.0-draft.3",
    "0.1.0-draft.4",
  ]) {
    expect(
      validateDocument(text.replace("0.1.0-draft.5", version)).status,
    ).toBe("invalid");
  }

  expect(validateDocument(text).status).toBe("valid");
});

test("deep branch conditions respect the inclusive pre-schema container depth", () => {
  const input = structuredClone(document);
  const node = input.actions[0]!.nodes[1]!;

  if (node.kind !== "branch") {
    throw new Error("Missing branch");
  }

  for (let i = 0; i < 122; i += 1) {
    node.condition = {
      kind: "unary",
      operator: "not",
      operand: node.condition,
    };
  }

  expect(validateDocument(JSON.stringify(input)).status).toBe("valid");
  node.condition = { kind: "unary", operator: "not", operand: node.condition };
  expect(
    validateDocument(JSON.stringify(input)).diagnostics.map(({ code }) => code),
  ).toEqual(["AFIR-LIMIT-001"]);
});
