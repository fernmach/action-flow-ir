export interface Diagnostic {
  code: string;
  severity: "error" | "warning";
  path?: string;
  message: string;
  actionId?: string;
  nodeId?: string;
}

export interface ValidationResult {
  status: "valid" | "invalid" | "tool-error";
  diagnostics: Diagnostic[];
}

export function toolError(code: string, message: string): ValidationResult {
  return {
    status: "tool-error",
    diagnostics: [{ code, severity: "error", message }],
  };
}

export function normalizeSemanticDiagnostics(
  diagnostics: Diagnostic[],
): Diagnostic[] {
  diagnostics.sort((a, b) => {
    for (const key of ["path", "code", "message"] as const) {
      const left = a[key] ?? "";
      const right = b[key] ?? "";

      if (left < right) {
        return -1;
      }

      if (left > right) {
        return 1;
      }
    }

    return 0;
  });

  const seen = new Set<string>();

  return diagnostics.filter((diagnostic) => {
    const key = JSON.stringify(diagnostic);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}
