import type { ErrorObject } from "ajv";
import { expect, test, vi } from "vitest";

const { validateEnvelope } = vi.hoisted(() => ({
  validateEnvelope: Object.assign(() => false, { errors: [] as ErrorObject[] }),
}));

vi.mock("../../src/validator/schema.js", () => ({ validateEnvelope }));

import { validateDocument } from "../../src/validator/index.js";

test("schema normalization sorts keyword ties and removes identical diagnostics", () => {
  const error = (
    keyword: string,
    params: ErrorObject["params"],
  ): ErrorObject => ({
    keyword,
    params,
    instancePath: "/metadata/title",
    schemaPath: "unused",
  });

  validateEnvelope.errors = [
    error("pattern", { pattern: "second" }),
    error("minLength", { limit: 1 }),
    error("pattern", { pattern: "first" }),
    error("minLength", { limit: 1 }),
  ];

  const text = '{"irVersion":"0.1.0-draft.1","id":"test","actions":[]}';
  const result = validateDocument(text);

  expect(result.diagnostics).toEqual([
    {
      code: "AFIR-SCHEMA-001",
      severity: "error",
      path: "/metadata/title",
      message: "String must not be empty.",
    },
    {
      code: "AFIR-SCHEMA-001",
      severity: "error",
      path: "/metadata/title",
      message: "String does not match the required syntax.",
    },
  ]);
  validateEnvelope.errors.reverse();
  expect(validateDocument(text)).toEqual(result);
});
