# Envelope field reference

Supported formats: **0.1.0-draft.1**, **0.1.0-draft.2**, **0.1.0-draft.3**, **0.1.0-draft.4** and **0.1.0-draft.5**. See the [normative rules](../spec/document-envelope.md).

| Field                | Required    | Value                                                                                                                                                                                       |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| irVersion            | Yes         | Exact supported version string (draft.1 through draft.5)                                                                                                                                    |
| id                   | Yes         | Nonempty string without surrounding ECMAScript whitespace                                                                                                                                   |
| metadata             | No          | Closed object; may be empty                                                                                                                                                                 |
| metadata.title       | No          | Same string constraints as id                                                                                                                                                               |
| metadata.description | No          | String, including empty or multiline                                                                                                                                                        |
| source               | No          | Closed object; cannot be empty                                                                                                                                                              |
| source.technology    | With source | Lowercase extensible hyphen-separated identifier                                                                                                                                            |
| source.version       | No          | Same string constraints as id; source version, not IR version                                                                                                                               |
| actions              | Yes         | Empty in draft.1; [action objects](actions.md) in draft.2; [typed actions](variables-and-types.md) in draft.3; [computation](computation.md) in draft.4; [branches](branches.md) in draft.5 |

All undeclared properties and explicit nulls are invalid. Provenance does not prove origin or select behavior. See the [diagnostic reference](tooling.md#diagnostic-reference) and [CLI tutorial](../tutorials/validate-document.md).
