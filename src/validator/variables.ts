import type { Action, ActionDocument } from "./actions.js";
import type { Diagnostic } from "./diagnostics.js";

export interface Variable {
  id: string;
  name: string;
  type: "Boolean" | "Integer" | "Decimal" | "Text";
}

export interface TypedAction extends Action {
  inputs: Variable[];
  outputs: Variable[];
  locals: Variable[];
}

export interface TypedActionDocument extends Omit<
  ActionDocument,
  "irVersion" | "actions"
> {
  irVersion: "0.1.0-draft.3";
  actions: TypedAction[];
}

// Called only after structural success; graph eligibility is action-local.
export function validateVariables(
  action: Pick<TypedAction, "inputs" | "outputs" | "locals">,
  path: string,
  graphValid: boolean,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const ids = new Set<string>();
  const names = new Set<string>();

  for (const category of ["inputs", "outputs", "locals"] as const) {
    action[category].forEach((variable, index) => {
      for (const [field, seen, code] of [
        ["id", ids, "AFIR-VAR-001"],
        ["name", names, "AFIR-VAR-002"],
      ] as const) {
        if (seen.has(variable[field])) {
          diagnostics.push({
            code,
            severity: "error",
            path: `${path}/${category}/${index}/${field}`,
            message: `Variable ${field} is duplicated within this action.`,
          });
        }

        seen.add(variable[field]);
      }
    });
  }

  if (graphValid && diagnostics.length === 0) {
    action.outputs.forEach((_variable, index) => {
      diagnostics.push({
        code: "AFIR-INIT-001",
        severity: "error",
        path: `${path}/outputs/${index}/id`,
        message: "Output is uninitialized at normal completion.",
      });
    });
  }

  return diagnostics;
}
