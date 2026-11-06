import { readFileSync } from "node:fs";
import { Ajv2020 } from "ajv/dist/2020.js";

function loadSchema(version: string) {
  const schema: unknown = JSON.parse(
    readFileSync(
      new URL(
        "../../schema/" + version + "/action-flow.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const ajv = new Ajv2020({
    strict: true,
    allErrors: true,
    coerceTypes: false,
    useDefaults: false,
    removeAdditional: false,
  });

  if (
    typeof schema !== "object" ||
    schema === null ||
    !ajv.validateSchema(schema)
  ) {
    throw new Error("Invalid bundled IR schema");
  }

  return ajv.compile(schema);
}

export const schemas = new Map([
  ["0.1.0-draft.1", loadSchema("0.1.0-draft.1")],
  ["0.1.0-draft.2", loadSchema("0.1.0-draft.2")],
]);
