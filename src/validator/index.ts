import type { ErrorObject } from "ajv";
import type { Diagnostic, ValidationResult } from "./diagnostics.js";
import { parseDocument } from "./parse.js";
import { validateEnvelope } from "./schema.js";

const versionPattern =
  /^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-draft\.[1-9][0-9]*)?$(?![\s\S])/;

function failure(
  status: ValidationResult["status"],
  code: string,
  path: string,
  message: string,
): ValidationResult {
  return { status, diagnostics: [{ code, severity: "error", path, message }] };
}

function pointerToken(value: string): string {
  return value.replace(/~/g, "~0").replace(/\//g, "~1");
}

function normalize(error: ErrorObject) {
  const property: unknown =
    error.keyword === "required"
      ? error.params.missingProperty
      : error.keyword === "additionalProperties"
        ? error.params.additionalProperty
        : undefined;
  const path =
    error.instancePath +
    (typeof property === "string" ? "/" + pointerToken(property) : "");
  const messages: Record<string, string> = {
    required: "Required property is missing.",
    additionalProperties: "Property is not declared in this format.",
    type: "Value has an invalid type.",
    const: "Value does not match the supported format.",
    minLength: "String must not be empty.",
    pattern: "String does not match the required syntax.",
    maxItems: "Actions must be empty in this draft.",
  };
  const diagnostic: Diagnostic = {
    code: "AFIR-SCHEMA-001",
    severity: "error",
    path,
    message: messages[error.keyword] ?? "Value violates the document schema.",
  };

  return {
    path,
    keyword: error.keyword,
    parameters: JSON.stringify(error.params),
    diagnostic,
  };
}

export function validateDocument(text: string): ValidationResult {
  const parsed = parseDocument(text);

  if (!parsed.ok) {
    return parsed.result;
  }

  const value = parsed.value;

  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return failure(
      "invalid",
      "AFIR-ENV-001",
      "",
      "Document root must be an object.",
    );
  }

  if (
    !("irVersion" in value) ||
    typeof value.irVersion !== "string" ||
    !versionPattern.test(value.irVersion)
  ) {
    return failure(
      "invalid",
      "AFIR-VERSION-001",
      "/irVersion",
      "Declare an IR version using MAJOR.MINOR.PATCH with optional -draft.N.",
    );
  }

  if (value.irVersion !== "0.1.0-draft.1") {
    return failure(
      "tool-error",
      "AFIR-VERSION-002",
      "/irVersion",
      "IR version is not supported.",
    );
  }

  if (validateEnvelope(value)) {
    return { status: "valid", diagnostics: [] };
  }

  const errors = (validateEnvelope.errors ?? []).map(normalize);

  errors.sort((a, b) => {
    for (const key of ["path", "keyword", "parameters"] as const) {
      if (a[key] < b[key]) {
        return -1;
      }

      if (a[key] > b[key]) {
        return 1;
      }
    }

    return 0;
  });

  const seen = new Set<string>();
  const diagnostics = errors
    .map(({ diagnostic }) => diagnostic)
    .filter((diagnostic) => {
      const key = JSON.stringify(diagnostic);

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);

      return true;
    });

  return { status: "invalid", diagnostics };
}
