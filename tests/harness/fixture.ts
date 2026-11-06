import { readFile } from "node:fs/promises";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { ValidationResult } from "../../src/validator/diagnostics.js";

export interface Expectation {
  id: string;
  rules: string[];
  status: ValidationResult["status"];
  diagnostics: { code: string; severity: "error" | "warning"; path?: string }[];
  allowAdditionalDiagnostics: boolean;
}

const ajv = new Ajv2020({ strict: true, allErrors: true });
const schema: unknown = JSON.parse(
  await readFile(new URL("./expectation.schema.json", import.meta.url), "utf8"),
);

if (!ajv.validateSchema(schema as object)) {
  throw new Error("Invalid expectation schema");
}

const validate = ajv.compile<Expectation>(schema as object);

export async function loadFixture(input: URL, sidecar: URL) {
  const expected: unknown = JSON.parse(await readFile(sidecar, "utf8"));

  if (!validate(expected)) {
    throw new Error(
      "Invalid expectation sidecar: " + ajv.errorsText(validate.errors),
    );
  }

  return { text: await readFile(input, "utf8"), expected };
}

export function matchesExpectation(
  result: ValidationResult,
  expected: Expectation,
): boolean {
  if (result.status !== expected.status) {
    return false;
  }

  const remaining = [...result.diagnostics];

  for (const diagnostic of expected.diagnostics) {
    const i = remaining.findIndex(
      (actual) =>
        actual.code === diagnostic.code &&
        actual.severity === diagnostic.severity &&
        actual.path === diagnostic.path,
    );

    if (i < 0) {
      return false;
    }

    remaining.splice(i, 1);
  }

  return expected.allowAdditionalDiagnostics || remaining.length === 0;
}
