# Document envelope and source provenance

Normative for **0.1.0-draft.1**. Draft.2 inherits this envelope with the explicitly versioned changes in [Minimal actions and connections](actions.md). Draft.3 inherits it with the changes in [Variables and primitive types](variables-and-types.md). The structural contract is `schema/0.1.0-draft.1/action-flow.schema.json`, Draft 2020-12, identifier `urn:action-flow-ir:schema:0.1.0-draft.1`. No schema hosting is required.

## Requirements

**ENV-001 — Root:** A document MUST be JSON with a non-null object root, excluding arrays. Malformed JSON is invalid.

**ENV-002 — Version:** The root MUST declare string `irVersion`. Declarations MUST use MAJOR.MINOR.PATCH, optionally followed by `-draft.N`. Components are decimal integers without leading zeros (zero is allowed); N starts at 1. Other prereleases, build metadata and surrounding whitespace are invalid. This chapter defines `0.1.0-draft.1`; the validator also supports `0.1.0-draft.2` as specified in the actions chapter and `0.1.0-draft.3` as specified in the variables/types chapter. A well-formed unimplemented version is unsupported, regardless of remaining content. Root/version failures stop dependent validation. Public contract changes MUST receive a new immutable draft version; editorial corrections and implementation bug fixes do not. CLI package version 0.0.0 is independent of the format and schema dialect.

**ENV-003 — Identity:** Required `id` MUST be a nonempty string without leading or trailing ECMAScript regular-expression whitespace (the `\s` character class). Internal whitespace is permitted; no UUID shape is required.

**ENV-004 — Metadata:** Optional `metadata` MUST be an object with optional `title` and `description`. Title MUST obey the same string constraints as id. Description MUST be a string; empty and multiline strings are permitted. Empty metadata is valid.

**ENV-005 — Provenance:** Optional `source` MUST be an object with required string `technology` and optional string `version`. Technology MUST match `^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$` over the entire string, rejecting terminal newlines. The conventions `outsystems`, `csharp` and `javascript` are not an exhaustive enum. Version MUST obey the string constraints of id; it describes the source platform/language and need not use IR version syntax. Empty source is invalid. Omitted source means unspecified provenance; consumers MUST NOT infer technology. Provenance is self-reported descriptive information: it MUST NOT establish authenticity, select an adapter or change execution semantics. This draft records one document-level technology. Mixed origins, importer identity, files, project IDs and element mappings await later design.

**ENV-006 — Strictness:** Root, metadata and source MUST reject undeclared properties. Absent optional values MUST be omitted; explicit null is invalid at every declared field. No defaults are implied.

**ENV-007 — Actions:** Required `actions` MUST be an array and MUST be empty in this draft. Action objects and execution semantics are not defined.

**ENV-008 — Preservation:** Validation MUST NOT trim, coerce, insert defaults, remove properties or repair documents. Object-property order MUST have no meaning. Normalization requires a separate explicit contract.

**ENV-009 — Diagnostics:** Validation MUST follow parse, root, version, exact schema dispatch. Supported-version schema errors MUST be sorted by normalized path, keyword, then serialized Ajv parameters using ascending UTF-16 code-unit comparison before rendering. Identical normalized diagnostics MUST be removed, retaining the first. Missing and unknown properties MUST append their names to the object pointer with JSON Pointer escaping (`~` to `~0`, `/` to `~1`). Root failures use `""`; version failures use `/irVersion`. Messages are project-owned explanatory text. Schema initialization failure is a tool failure, never invalid input. Validation MUST use controlled bundled schemas and MUST NOT fetch document-supplied references.

## Examples

Minimum valid document:

```json
{ "irVersion": "0.1.0-draft.1", "id": "discount-module", "actions": [] }
```

Complete envelope:

```json
{
  "irVersion": "0.1.0-draft.1",
  "id": "discount-module",
  "metadata": {
    "title": "Discount calculations",
    "description": "Actions used to calculate customer discounts."
  },
  "source": { "technology": "outsystems", "version": "11" },
  "actions": []
}
```

## Enforcement and conformance traceability

Case IDs identify paired files under `tests/conformance/envelope/`. Numbered ranges include every case with the indicated prefix. Unit/integration checks cover tool behavior that documents alone cannot establish.

| Rule    | Enforcement / diagnostic                                          | Positive, negative and boundary evidence                                                                                              |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ENV-001 | Parser, root guard; AFIR-PARSE-001 / AFIR-ENV-001                 | minimal, malformed, root-0 through 4                                                                                                  |
| ENV-002 | Version guard, exact dispatch, schema const; AFIR-VERSION-001/002 | minimal, version-invalid-0 through 11, version-unsupported-0 through 2; compiled CLI                                                  |
| ENV-003 | required, type, minLength, pattern; AFIR-SCHEMA-001               | minimal, boundaries, id-0 through 9                                                                                                   |
| ENV-004 | metadata properties/string constraints; AFIR-SCHEMA-001           | full, empty-metadata, empty-description, boundaries, metadata-type-0 through 3, title-0 through 5, description-null                   |
| ENV-005 | source properties, required, type, patterns; AFIR-SCHEMA-001      | minimal, full, technology-only, boundaries, source-empty, source-type-0 through 3, technology-0 through 8, source-version-0 through 5 |
| ENV-006 | additionalProperties, type; AFIR-SCHEMA-001                       | minimal, unknown-root/metadata/source; null/missing cases above                                                                       |
| ENV-007 | required, type, maxItems; AFIR-SCHEMA-001                         | minimal, actions-0 through 3                                                                                                          |
| ENV-008 | Explicit nonmutating Ajv options, no normalization                | property-order, boundaries; schema.test.ts preservation regression                                                                    |
| ENV-009 | Diagnostic normalization, local initialization                    | multiple; schema.test.ts ordering/pointer regression; compiled.test.ts working-directory independence                                 |

Additional boundaries: unicode-internal, unicode-title, unicode-source-version, source-version-omitted, description-number, actions-string and reference-is-unknown. `diagnostics.test.ts` verifies deduplication and keyword ordering; the compiled CLI startup-failure regression verifies tool-error classification.

Future version allocation and truthful provenance are producer/maintenance obligations that static document validation cannot establish. Reference, type and flow passes are not applicable to an empty container.
