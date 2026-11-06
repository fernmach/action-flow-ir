# Envelope field reference

Supported format: **0.1.0-draft.1**. See the [normative rules](../spec/document-envelope.md).

| Field                | Required    | Value                                                         |
| -------------------- | ----------- | ------------------------------------------------------------- |
| irVersion            | Yes         | Exact supported string 0.1.0-draft.1                          |
| id                   | Yes         | Nonempty string without surrounding ECMAScript whitespace     |
| metadata             | No          | Closed object; may be empty                                   |
| metadata.title       | No          | Same string constraints as id                                 |
| metadata.description | No          | String, including empty or multiline                          |
| source               | No          | Closed object; cannot be empty                                |
| source.technology    | With source | Lowercase extensible hyphen-separated identifier              |
| source.version       | No          | Same string constraints as id; source version, not IR version |
| actions              | Yes         | Empty array                                                   |

All undeclared properties and explicit nulls are invalid. Provenance does not prove origin or select behavior. See the [diagnostic reference](tooling.md#diagnostic-reference) and [CLI tutorial](../tutorials/validate-document.md).
