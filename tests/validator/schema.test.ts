import { expect, test } from "vitest";
import { schemas } from "../../src/validator/schema.js";
import { validateDocument } from "../../src/validator/index.js";

const validateEnvelope = schemas.get("0.1.0-draft.1")!;

// Compilation checks the bundled schema against Draft 2020-12 in strict mode.
test.each([...schemas])(
  "bundled schema compiles and validates an envelope: %s",
  (version, validate) => {
    expect(validate({ irVersion: version, id: "test", actions: [] })).toBe(
      true,
    );
  },
);

test("validation preserves data, rejects rather than repairs and is deterministic", () => {
  const input = {
    irVersion: "0.1.0-draft.1",
    id: 42,
    metadata: { title: null },
    source: {},
    actions: [],
    "a/b~c": true,
  };
  const before = structuredClone(input);

  expect(validateEnvelope(input)).toBe(false);
  expect(input).toEqual(before);
  expect(
    validateEnvelope({ irVersion: "0.1.0-draft.1", id: "test", actions: [] }),
  ).toBe(true);

  const text = JSON.stringify(input);
  const result = validateDocument(text);

  expect(result.diagnostics.map((d) => d.path)).toEqual([
    "/a~1b~0c",
    "/id",
    "/metadata/title",
    "/source/technology",
  ]);
  expect(validateDocument(text)).toEqual(result);
  expect(
    validateDocument(
      JSON.stringify(Object.fromEntries(Object.entries(input).reverse())),
    ),
  ).toEqual(result);
  expect(JSON.stringify(input)).toBe(text);
});
