import { toolError } from "./diagnostics.js";
import type { ValidationResult } from "./diagnostics.js";
import { parseDocument } from "./parse.js";

export function validateDocument(text: string): ValidationResult {
  const parsed = parseDocument(text);

  if (!parsed.ok) {
    return parsed.result;
  }

  return toolError(
    "AFIR-TOOL-003",
    "IR validation is not implemented. No IR versions are supported yet.",
  );
}
