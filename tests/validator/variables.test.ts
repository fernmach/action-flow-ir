import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { validateActions } from "../../src/validator/actions.js";
import { validateDocument } from "../../src/validator/index.js";
import { schemas } from "../../src/validator/schema.js";
import type { TypedActionDocument } from "../../src/validator/variables.js";

const text = await readFile(
  new URL("../../examples/typed-action.json", import.meta.url),
  "utf8",
);
const document = JSON.parse(text) as TypedActionDocument;

test("typed validation preserves declarations and ignores declaration/property order", () => {
  const input = structuredClone(document);
  const before = structuredClone(input);

  expect(validateActions(input)).toEqual([]);
  expect(input).toEqual(before);

  for (const action of input.actions) {
    action.inputs.reverse();
    action.locals.reverse();
    action.nodes.reverse();
  }

  expect(validateDocument(JSON.stringify(input))).toEqual({
    status: "valid",
    diagnostics: [],
  });
  expect(
    validateDocument(
      JSON.stringify(Object.fromEntries(Object.entries(input).reverse())),
    ),
  ).toEqual({ status: "valid", diagnostics: [] });
});

test("semantic diagnostics combine independent passes in deterministic pointer order", () => {
  const input = structuredClone(document);
  const action = input.actions[0]!;
  const variable = action.inputs[0]!;

  action.inputs.push({ ...variable });
  action.outputs.push({ ...variable });
  action.connections = [];

  const before = structuredClone(input);
  const diagnostics = validateActions(input);

  expect(input).toEqual(before);
  expect(validateActions(input)).toEqual(diagnostics);
  expect(diagnostics.map(({ code, path }) => ({ code, path }))).toEqual([
    { code: "AFIR-VAR-001", path: "/actions/0/inputs/2/id" },
    { code: "AFIR-VAR-002", path: "/actions/0/inputs/2/name" },
    { code: "AFIR-FLOW-006", path: "/actions/0/nodes/0" },
    { code: "AFIR-FLOW-006", path: "/actions/0/nodes/1" },
    { code: "AFIR-FLOW-007", path: "/actions/0/nodes/1" },
    { code: "AFIR-VAR-001", path: "/actions/0/outputs/0/id" },
    { code: "AFIR-VAR-002", path: "/actions/0/outputs/0/name" },
  ]);

  const serialized = JSON.stringify(input);

  expect(validateDocument(serialized).diagnostics).toEqual(diagnostics);
  expect(validateDocument(serialized).diagnostics).toEqual(diagnostics);
});

test("typed schema rejects rather than fills missing arrays or coerces fields", () => {
  const validate = schemas.get("0.1.0-draft.3")!;

  for (const patch of [
    { inputs: undefined },
    { inputs: null },
    { inputs: [{ id: 1, name: "Value", type: "Decimal" }] },
    { locals: [{ id: "local", name: "Local", type: "Text", default: "" }] },
  ]) {
    const input = structuredClone(document);

    Object.assign(input.actions[0]!, patch);

    const before = structuredClone(input);

    expect(validate(input)).toBe(false);
    expect(input).toEqual(before);
  }
});

test("mixed version validation does not reinterpret earlier contracts", () => {
  expect(validateDocument(text).status).toBe("valid");
  expect(
    validateDocument(text.replace("0.1.0-draft.3", "0.1.0-draft.2")).status,
  ).toBe("invalid");
  expect(
    validateDocument(text.replace("0.1.0-draft.3", "0.1.0-draft.1")).status,
  ).toBe("invalid");
  expect(validateDocument(text).status).toBe("valid");
});
