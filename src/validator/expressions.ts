import type { Diagnostic } from "./diagnostics.js";
import type { Variable } from "./variables.js";

export type PrimitiveType = Variable["type"];

export type Expression =
  | { kind: "literal"; type: PrimitiveType; value: string | boolean }
  | { kind: "variable"; variableId: string }
  | { kind: "unary"; operator: "negate" | "not"; operand: Expression }
  | {
      kind: "binary";
      operator:
        | "add"
        | "subtract"
        | "multiply"
        | "equal"
        | "notEqual"
        | "lessThan"
        | "lessThanOrEqual"
        | "greaterThan"
        | "greaterThanOrEqual"
        | "and"
        | "or";
      left: Expression;
      right: Expression;
    };

export interface ExpressionAnalysis {
  type: PrimitiveType | undefined;
  diagnostics: Diagnostic[];
  reads: { id: string; path: string }[];
}

// Iterative postorder: infer types without evaluating values or recursing.
export function analyzeExpression(
  expression: Expression,
  path: string,
  variables: ReadonlyMap<string, Variable> | undefined,
): ExpressionAnalysis {
  const diagnostics: Diagnostic[] = [];
  const reads: ExpressionAnalysis["reads"] = [];
  const types = new Map<string, PrimitiveType | undefined>();
  const pending = [{ expression, path, visited: false }];

  const report = (code: string, location: string, message: string) => {
    diagnostics.push({ code, severity: "error", path: location, message });
  };

  while (pending.length > 0) {
    const frame = pending.pop()!;
    const value = frame.expression;
    const location = frame.path;

    if (value.kind === "literal") {
      if (
        value.type === "Text" &&
        typeof value.value === "string" &&
        /[\uD800-\uDFFF]/u.test(value.value)
      ) {
        report(
          "AFIR-LITERAL-001",
          location + "/value",
          "Text must contain only Unicode scalar values.",
        );
      } else {
        types.set(location, value.type);
      }

      continue;
    }

    if (value.kind === "variable") {
      if (variables) {
        const declaration = variables.get(value.variableId);

        if (declaration) {
          types.set(location, declaration.type);
          reads.push({ id: value.variableId, path: location + "/variableId" });
        } else {
          report(
            "AFIR-REF-001",
            location + "/variableId",
            "Variable does not resolve within this action.",
          );
        }
      }

      continue;
    }

    const children =
      value.kind === "unary"
        ? [{ expression: value.operand, path: location + "/operand" }]
        : [
            { expression: value.left, path: location + "/left" },
            { expression: value.right, path: location + "/right" },
          ];

    if (!frame.visited) {
      pending.push({ ...frame, visited: true });

      for (const child of [...children].reverse()) {
        pending.push({ ...child, visited: false });
      }

      continue;
    }

    if (!variables) {
      continue;
    }

    const equality =
      value.operator === "equal" || value.operator === "notEqual";
    const boolean = ["not", "and", "or"].includes(value.operator);
    const operandTypes = children.map((child) => types.get(child.path));
    let invalidDomain = false;

    children.forEach((child, index) => {
      const type = operandTypes[index];

      if (
        type !== undefined &&
        !equality &&
        (boolean
          ? type !== "Boolean"
          : type !== "Integer" && type !== "Decimal")
      ) {
        invalidDomain = true;
        report(
          "AFIR-TYPE-001",
          child.path,
          "Operand type is not supported by this operator.",
        );
      }
    });

    if (invalidDomain || operandTypes.some((type) => type === undefined)) {
      continue;
    }

    if (value.kind === "binary" && operandTypes[0] !== operandTypes[1]) {
      report(
        "AFIR-TYPE-002",
        location + "/operator",
        "Operator operands must have matching types.",
      );

      continue;
    }

    types.set(
      location,
      equality ||
        boolean ||
        value.operator.startsWith("less") ||
        value.operator.startsWith("greater")
        ? "Boolean"
        : operandTypes[0],
    );
  }

  return { type: types.get(path), diagnostics, reads };
}
