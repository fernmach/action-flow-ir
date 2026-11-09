# Action-Flow IR specification

Supported: **0.1.0-draft.1** (empty envelope), **0.1.0-draft.2** ([minimal actions and connections](actions.md)) and **0.1.0-draft.3** ([variables and primitive types](variables-and-types.md)). All use the [document envelope and source provenance](document-envelope.md). Execution remains unimplemented.

## Authority

Normative prose defines language meaning; the versioned JSON Schema defines document structure. They must agree. Examples, discovery notes, iteration plans, and generated implementation types do not override either contract. Resolve discrepancies through the iteration workflow and regression cases.

Use MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY deliberately for requirements, recommendations, and permissions. Give each normative requirement a stable ID and scope/version. Clearly mark non-normative explanation and illustrative examples.

## Feature chapter structure

Each chapter describes purpose, representation, static constraints, execution semantics where applicable, failure behavior, version compatibility, and rule-linked examples. Link diagnostics and conformance cases. For purely structural features, explain that execution semantics are not applicable.

## Chapters

1. Document envelope and versioning.
2. Actions, nodes, connections, and identity.
3. Variables, types, scope, and initialization.
4. Expressions and operators.
5. Assignment.
6. Branching.
7. Loops and collections.
8. Action calls.
9. Flow-analysis obligations and limits.
10. Feature/target compatibility.

Chapters become normative only as their iterations define and implement supported behavior. The envelope, minimal-actions and variables/types chapters are implemented; the remaining chapters are planned. Development proposals do not extend the supported envelope.
