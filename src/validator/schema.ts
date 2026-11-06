import { readFileSync } from "node:fs";
import { Ajv2020 } from "ajv/dist/2020.js";

const schema: unknown = JSON.parse(
  readFileSync(
    new URL(
      "../../schema/0.1.0-draft.1/action-flow.schema.json",
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

export const validateEnvelope = ajv.compile(schema);
