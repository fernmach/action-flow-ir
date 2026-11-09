# Variables and primitive types

Normative for **0.1.0-draft.3**. The independent Draft 2020-12 schema is `schema/0.1.0-draft.3/action-flow.schema.json`, identified by `urn:action-flow-ir:schema:0.1.0-draft.3`.

Draft.3 inherits [ENV-001 through ENV-006 and ENV-008 through ENV-009](document-envelope.md), with irVersion exactly `0.1.0-draft.3`. It inherits [ACT-001 through ACT-009](actions.md), except that ACT-001's action shape additionally requires the three declaration arrays below. All node, connection and graph rules remain unchanged. Draft.1 and draft.2 retain their original contracts. Migrating a draft.2 action requires changing the version and adding all three arrays; validation MUST NOT perform this migration.

## Declarations and scope

**VAR-001 — Shape:** Every action MUST contain arrays `inputs`, `outputs` and `locals`. Empty arrays are permitted. Each element MUST be an object containing exactly `id`, `name` and `type`. All fields are required and MUST reject null. Defaults, initializers, metadata, nullable flags and all other undeclared properties MUST be rejected.

**VAR-002 — Identity and names:** Declaration IDs MUST satisfy ENV-003. Names MUST match `[A-Za-z_][A-Za-z0-9_]*` over the entire string, including rejection of terminal newlines. No names are reserved. IDs and names MUST be compared exactly and case-sensitively, without Unicode normalization.

**VAR-003 — Scope:** IDs MUST be unique across inputs, outputs and locals within the containing action; names MUST independently be unique across those same declarations. All declarations belong to one action-wide scope with no shadowing. IDs and names MAY repeat in other actions. Variable IDs occupy a separate namespace from document, action and node IDs and MAY equal those IDs. Future variable references use IDs; this draft defines no variable-reference field.

**VAR-004 — Order:** Declaration array order MUST NOT imply initialization order or positional argument binding. Object-property order MUST have no meaning. Declaration ordering affects only diagnostic locations and which duplicate is reported as a later occurrence.

## Primitive domains

**TYPE-001 — Types:** A declaration's type MUST be exactly one of the following non-nullable primitive types. The types are distinct; no implicit conversions are defined.

| Type    | Value domain                                                                                                               |
| ------- | -------------------------------------------------------------------------------------------------------------------------- |
| Boolean | `true` and `false`                                                                                                         |
| Integer | Mathematical integers, without a language-level size bound                                                                 |
| Decimal | Finite exact base-10 values: numbers expressible as an integer multiplied by an integer power of ten; no infinities or NaN |
| Text    | Finite sequences of Unicode scalar values, including the empty sequence; surrogate code points are not scalar values       |

The schema validates type declarations, not values: this draft has no value or literal fields. Numeric serialization, precision/resource limits, arithmetic, division, rounding, literal encoding and text operations MUST NOT be inferred from the host language. They require specification in a later draft before expressions are supported. The Unicode scalar restriction concerns future Text values, not existing envelope or ID strings.

## Initialization

**VAR-005 — Entry state and access:** Inputs are initialized at entry and read-only. Outputs and locals begin uninitialized and are writable by future assignment-capable drafts. No implicit default values exist. Uninitialized is an analysis state, not a value or null. Unused locals are permitted. This draft has no reads, writes, invocation or execution engine; those access obligations have no operations to enforce yet.

**VAR-006 — Normal completion:** Every output MUST be initialized before normal completion. Only start → end is supported and neither node initializes outputs. Consequently, any otherwise valid action with a nonempty outputs array MUST be rejected, once per output. An empty outputs array needs no initialization diagnostic. Valid output-producing actions require a future draft with assignments.

## Validation and diagnostics

**VAR-007 — Staging:** Structural failure MUST stop all semantic checks. After structural success, declaration identity checks MUST run independently of graph checks in every action. Traverse inputs, then outputs, then locals, preserving each array's order. Report each later occurrence of a duplicate ID and each later occurrence of a duplicate name, including both diagnostics on one declaration when applicable. All checks in the inherited action validation procedure refer to graph errors only; declaration errors MUST NOT suppress graph checks.

Output initialization MUST run only when the containing action has neither declaration identity errors nor local graph errors. A duplicate action ID is document-level and MUST NOT suppress local graph, declaration or output checks. For an eligible action emit one diagnostic for each output. No general data-flow algorithm is required for the supported two-node graph.

Here category is inputs, outputs or locals. All semantic diagnostics MUST follow ACT's severity, status, ordering, deduplication and field contract. These additional diagnostics have severity error, invalid status and CLI exit 1:

| Code          | Meaning                                   | Pointer relative to /actions/{index}       |
| ------------- | ----------------------------------------- | ------------------------------------------ |
| AFIR-VAR-001  | Duplicate variable ID                     | Later declaration /{category}/{index}/id   |
| AFIR-VAR-002  | Duplicate variable name                   | Later declaration /{category}/{index}/name |
| AFIR-INIT-001 | Output uninitialized at normal completion | /outputs/{index}/id                        |

## Traceability

Cases below are paired files under `tests/conformance/variables/`; prefixes include all matching cases. Existing envelope and action cases are also ported into this directory under `inherited-*` to enforce inherited rules in draft.3.

| Rule     | Enforcement                                                   | Positive / negative / boundary evidence                                                    |
| -------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| VAR-001  | Schema required/type/additionalProperties; AFIR-SCHEMA-001    | empty, typed, `shape-*`, `field-*`, `forbidden-*`                                          |
| VAR-002  | Schema string/pattern constraints and exact identity sets     | `name-*`, `id-*`, case-distinct, unicode-ids                                               |
| VAR-003  | Scoped sets; AFIR-VAR-001/002                                 | namespace-reuse, multiple-actions, `duplicate-*`, triple-duplicate                         |
| VAR-004  | ID/name sets, graph references, no normalization              | reordered; variables.test.ts ordering and preservation checks                              |
| TYPE-001 | Schema type enum; AFIR-SCHEMA-001                             | `type-*`, typed; value domains are semantic definitions without value syntax in this draft |
| VAR-005  | No value/default/initializer fields; no reads or writes exist | typed, unused-locals, `forbidden-*`; input access has no operations to enforce             |
| VAR-006  | Eligible output declarations; AFIR-INIT-001                   | empty, output-one, output-multiple, duplicate-action-output                                |
| VAR-007  | Independent passes and initialization prerequisites           | `suppress-*`, `combined-*`, structural-first; variables.test.ts determinism                |

No producer value, arithmetic or runtime conformance is claimed by declaration validation. Expressions and assignment remain separately scoped increments.

Draft.4 inherits the declaration/type rules with [expressions](expressions.md) and [assignment](assignment.md); its graph-order initialization replaces only the draft.3-specific completion/staging behavior.
