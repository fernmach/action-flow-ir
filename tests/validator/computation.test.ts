import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { validateActions } from "../../src/validator/actions.js";
import type { ComputationDocument } from "../../src/validator/computation.js";
import { validateDocument } from "../../src/validator/index.js";
import { exceedsContainerLimits } from "../../src/validator/limits.js";
import { schemas } from "../../src/validator/schema.js";

const text = await readFile(
  new URL("../../examples/calculate-discount.json", import.meta.url),
  "utf8",
);
const document = JSON.parse(text) as ComputationDocument;

test("computation follows connections and preserves input and numeric spelling", () => {
  const input = structuredClone(document);
  const action = input.actions[0]!;

  action.nodes.reverse();
  action.connections.reverse();
  action.inputs.reverse();

  const before = structuredClone(input);

  expect(validateActions(input)).toEqual([]);
  expect(input).toEqual(before);
  expect(JSON.stringify(input)).toContain("0.10");
  expect(validateDocument(JSON.stringify(input))).toEqual({
    status: "valid",
    diagnostics: [],
  });
});

test("combined diagnostics are deterministic and initialization recovery is local", () => {
  const input = structuredClone(document);
  const action = input.actions[0]!;
  const first = action.nodes[1]!;
  const second = action.nodes[2]!;

  if (first.kind !== "assign" || second.kind !== "assign") {
    throw new Error("Missing assignments");
  }

  first.value = { kind: "variable", variableId: "discount" };
  second.targetVariableId = "missing";

  const before = structuredClone(input);
  const diagnostics = validateActions(input);

  expect(diagnostics.map(({ code, path }) => ({ code, path }))).toEqual([
    { code: "AFIR-INIT-002", path: "/actions/0/nodes/1/value/variableId" },
    { code: "AFIR-REF-001", path: "/actions/0/nodes/2/targetVariableId" },
  ]);
  expect(input).toEqual(before);
  expect(validateActions(input)).toEqual(diagnostics);
  expect(
    validateDocument(
      JSON.stringify(Object.fromEntries(Object.entries(input).reverse())),
    ).diagnostics,
  ).toEqual(diagnostics);
});

test("conditional schema reports applicable leaf errors without if wrappers", () => {
  const input = structuredClone(document);
  const first = input.actions[0]!.nodes[1]!;

  if (first.kind !== "assign") {
    throw new Error("Missing assignment");
  }

  first.value = {
    kind: "unary",
    operator: "not",
    operand: { kind: "literal", type: "Boolean", value: true },
  };

  Reflect.deleteProperty(first.value, "operator");

  expect(
    validateDocument(JSON.stringify(input)).diagnostics.map(
      ({ code, path }) => ({ code, path }),
    ),
  ).toEqual([
    { code: "AFIR-SCHEMA-001", path: "/actions/0/nodes/1/value/operator" },
  ]);

  const validate = schemas.get("0.1.0-draft.4")!;
  const before = structuredClone(input);

  expect(validate(input)).toBe(false);
  expect(input).toEqual(before);
});

test("container depth boundary is inclusive and preflight protects malformed inputs", () => {
  const nested = (depth: number) => {
    let child: object = {};

    for (let index = 1; index < depth; index += 1) {
      child = { child };
    }

    return Object.assign(child, {
      irVersion: "0.1.0-draft.4",
      id: "limits",
      actions: [],
    });
  };

  expect(exceedsContainerLimits(nested(128))).toBe(false);
  expect(validateDocument(JSON.stringify(nested(128))).status).toBe("invalid");
  expect(exceedsContainerLimits(nested(129))).toBe(true);
  expect(validateDocument(JSON.stringify(nested(129)))).toEqual({
    status: "tool-error",
    diagnostics: [
      {
        code: "AFIR-LIMIT-001",
        severity: "error",
        path: "",
        message: "Document exceeds validator container limits.",
      },
    ],
  });

  const legacy = nested(129);

  Object.assign(legacy, { irVersion: "0.1.0-draft.3" });
  expect(validateDocument(JSON.stringify(legacy)).status).toBe("invalid");
});

test("container count includes arrays and objects but excludes scalars", () => {
  expect(
    exceedsContainerLimits({
      values: Array.from({ length: 99_998 }, () => ({})),
    }),
  ).toBe(false);
  expect(
    exceedsContainerLimits({
      values: Array.from({ length: 99_999 }, () => ({})),
    }),
  ).toBe(true);
  expect(
    exceedsContainerLimits({
      values: Array.from({ length: 100_001 }, () => "scalar"),
    }),
  ).toBe(false);
});

test("deep valid expressions stay within guarded schema and iterative analysis limits", () => {
  const input = structuredClone(document);
  const first = input.actions[0]!.nodes[1]!;

  if (first.kind !== "assign") {
    throw new Error("Missing assignment");
  }

  for (let index = 0; index < 122; index += 1) {
    first.value = { kind: "unary", operator: "negate", operand: first.value };
  }

  expect(validateDocument(JSON.stringify(input))).toEqual({
    status: "valid",
    diagnostics: [],
  });

  for (let index = 0; index < 100; index += 1) {
    first.value = { kind: "unary", operator: "negate", operand: first.value };
  }

  expect(validateDocument(JSON.stringify(input)).status).toBe("tool-error");
});

test("resource limit wins over schema errors with a single diagnostic", () => {
  const input = {
    irVersion: "0.1.0-draft.4",
    unknown: Array.from({ length: 100_000 }, () => ({})),
  };
  const result = validateDocument(JSON.stringify(input));

  expect(result.status).toBe("tool-error");
  expect(result.diagnostics.map(({ code, path }) => ({ code, path }))).toEqual([
    { code: "AFIR-LIMIT-001", path: "" },
  ]);
});

test("draft.4 does not reinterpret earlier schemas or draft.3 output initialization", () => {
  expect(validateDocument(text).status).toBe("valid");

  for (const version of ["0.1.0-draft.1", "0.1.0-draft.2", "0.1.0-draft.3"]) {
    expect(
      validateDocument(text.replace("0.1.0-draft.4", version)).status,
    ).toBe("invalid");
  }

  const legacy = structuredClone(document);
  const action = legacy.actions[0]!;

  action.nodes = [
    { id: "start", kind: "start" },
    { id: "end", kind: "end" },
  ];
  action.connections = [{ fromNodeId: "start", toNodeId: "end" }];

  expect(
    validateDocument(
      JSON.stringify(legacy).replace("0.1.0-draft.4", "0.1.0-draft.3"),
    ).diagnostics.map(({ code }) => code),
  ).toEqual(["AFIR-INIT-001"]);
  expect(validateDocument(text).status).toBe("valid");
});
