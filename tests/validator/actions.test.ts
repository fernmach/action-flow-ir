import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { validateActions } from "../../src/validator/actions.js";
import type { ActionDocument } from "../../src/validator/actions.js";
import { validateDocument } from "../../src/validator/index.js";
import { schemas } from "../../src/validator/schema.js";

const example = await readFile(
  new URL("../../examples/multiple-actions.json", import.meta.url),
  "utf8",
);
const document = JSON.parse(example) as ActionDocument;

test("semantic validation is nonmutating, deterministic and independent of declaration order", () => {
  const input = structuredClone(document);
  const first = input.actions[0];

  if (!first) {
    throw new Error("Missing example action");
  }

  first.connections = [];

  const before = structuredClone(input);
  const result = validateActions(input);

  expect(input).toEqual(before);
  expect(validateActions(input)).toEqual(result);
  expect(result.map(({ code, path }) => ({ code, path }))).toEqual([
    { code: "AFIR-FLOW-006", path: "/actions/0/nodes/0" },
    { code: "AFIR-FLOW-006", path: "/actions/0/nodes/1" },
    { code: "AFIR-FLOW-007", path: "/actions/0/nodes/1" },
  ]);

  const reordered = structuredClone(document);

  reordered.actions.reverse();

  for (const action of reordered.actions) {
    action.nodes.reverse();
    action.connections.reverse();
  }

  expect(validateDocument(JSON.stringify(reordered))).toEqual({
    status: "valid",
    diagnostics: [],
  });

  const propertyReordered = Object.fromEntries(Object.entries(input).reverse());

  expect(
    validateDocument(JSON.stringify(propertyReordered)).diagnostics,
  ).toEqual(result);
});

test("all bundled schemas validate against Draft 2020-12 and preserve inputs", () => {
  expect([...schemas.keys()]).toEqual([
    "0.1.0-draft.1",
    "0.1.0-draft.2",
    "0.1.0-draft.3",
    "0.1.0-draft.4",
    "0.1.0-draft.5",
  ]);

  for (const [version, validate] of schemas) {
    const valid = { irVersion: version, id: "test", actions: [] };

    expect(validate(valid)).toBe(true);

    for (const input of [
      { ...valid, id: 1 },
      { irVersion: version, actions: [] },
      { ...valid, extra: true },
    ]) {
      const before = structuredClone(input);

      expect(validate(input)).toBe(false);
      expect(input).toEqual(before);
    }
  }
});

test("switching versions does not cache document results or reinterpret draft.1", () => {
  expect(validateDocument(example).status).toBe("valid");
  expect(
    validateDocument(example.replace("0.1.0-draft.2", "0.1.0-draft.1")).status,
  ).toBe("invalid");
  expect(validateDocument(example).status).toBe("valid");
});
