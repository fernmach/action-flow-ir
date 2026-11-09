# Expressions

Normative for **0.1.0-draft.4**, delivered with [assignment](assignment.md). Earlier versions do not support expressions. The independent Draft 2020-12 schema is `schema/0.1.0-draft.4/action-flow.schema.json`, identified by `urn:action-flow-ir:schema:0.1.0-draft.4`.

## Representation and types

**EXP-001 — Shape:** Expressions MUST be inline trees of the following closed objects. Every listed field is required; nulls and undeclared fields MUST be rejected. Only literals declare a type. Expressions have no IDs or sharing references. Object-property order has no meaning; tree structure establishes grouping.

| kind     | Required fields             |
| -------- | --------------------------- |
| literal  | kind, type, value           |
| variable | kind, variableId            |
| unary    | kind, operator, operand     |
| binary   | kind, operator, left, right |

operand, left and right are expressions. unary/binary operators MUST belong to their respective rows below.

**EXP-002 — Literals:** Literal types MUST be one of the four [primitive types](variables-and-types.md). Boolean values MUST be JSON booleans. Text values MUST be JSON strings whose decoded contents are Unicode scalar sequences: valid surrogate pairs are permitted, unpaired surrogates are invalid. Empty Text and scalar control characters encoded legally in JSON are permitted. This restriction does not narrow existing ID/envelope strings.

Integer and Decimal values MUST be JSON strings matching these grammars over the entire decoded string:

```text
Integer: -?(0|[1-9][0-9]*)
Decimal: -?(0|[1-9][0-9]*)(\.[0-9]+)?
```

Reject JSON numbers, leading plus, multi-digit leading zeros, exponent notation, separators, surrounding whitespace (including final newlines), `.5`, `1.`, NaN and infinities. Negative zero and trailing fractional zeros are permitted. Decimal "0.10" and "0.1" denote the same mathematical value; signed zero has no distinct mathematical identity. Spelling does not establish monetary scale, rounding or precision. Validation MUST preserve spelling and MUST NOT canonicalize values. The type distinguishes Integer "100", Decimal "100" and Text "100".

**EXP-003 — References:** variableId MUST satisfy ENV-003 and MUST resolve by exact case-sensitive ID in the containing action's declaration scope, not by name or across actions. Its type is the declaration's type. No type annotation is permitted on references or operator expressions.

**EXP-004 — Operator types:** Infer types bottom-up using this exhaustive signature table. N is Integer or Decimal, with matching types across operands; T is the same primitive type on both sides. No implicit conversion, promotion or value-dependent compatibility is permitted.

| Form   | Operator                                                   | Signature                   |
| ------ | ---------------------------------------------------------- | --------------------------- |
| unary  | negate                                                     | N → N                       |
| unary  | not                                                        | Boolean → Boolean           |
| binary | add, subtract, multiply                                    | N × N → N                   |
| binary | equal, notEqual                                            | T × T → Boolean             |
| binary | lessThan, lessThanOrEqual, greaterThan, greaterThanOrEqual | N × N → Boolean             |
| binary | and, or                                                    | Boolean × Boolean → Boolean |

Integer/Decimal equality is invalid even when values are mathematically equal. Text arithmetic/order, division, calls, conversions and conditional expressions are not supported.

## Meaning and static obligations

**EXP-005 — Evaluation:** Expressions are pure and produce one value without writes or side effects. negate is exact additive inverse; not is Boolean negation. add/subtract/multiply are exact mathematical operations within the declared domain, with no rounding or numeric overflow. Ordering is mathematical numeric order. Equality compares Boolean truth values, numeric mathematical values within one type, or decoded Text scalar sequences exactly. Text equality MUST NOT normalize, trim, case-fold or use locale rules.

Evaluate a unary operand before its operator. Ordinary binary expressions evaluate left, then right, then apply the operator. and evaluates right only if left is true; or evaluates right only if left is false. This specifies meaning for consumers, not an execution engine. These well-typed operators are total over valid initialized values; resource exhaustion is not numeric overflow. Invocation failures and execution exceptions are outside this draft.

**EXP-006 — Reads:** Every reference MUST be definitely initialized at its consuming node's pre-state. Static resolution, typing and initialization MUST inspect both operands, including runtime-skipped operands. No constant-based exemption is permitted. Inputs begin initialized; locals/outputs require an earlier valid assignment. Reading does not initialize a declaration. Resolved uninitialized references retain known types for independent type checks.

**EXP-007 — Analysis:** Structural failure stops all semantic checks. After structural success, analyze all expression trees even if graph validity is unknown/invalid. A duplicate variable ID or name makes that action's scope unusable: suppress dependent reference/type/read checks but continue literal scalar validation. Independently check siblings. Unknown references and invalid expressions have unknown result types; suppress only dependent errors. With usable scope, known operands outside the operator's allowed domain each receive an operand diagnostic. If both operands are allowed but their known types differ, emit one mismatch on operator. An invalid operator application has unknown result type for its parent. Assignment and flow prerequisites/recovery follow ASN-007.

All diagnostics have error severity. Semantic violations are invalid, CLI exit 1, and use ACT's pointer/code/message ordering and deduplication. New expression diagnostics are:

| Code             | Meaning                                            | Relative pointer      |
| ---------------- | -------------------------------------------------- | --------------------- |
| AFIR-LITERAL-001 | Unpaired surrogate in Text                         | Literal /value        |
| AFIR-REF-001     | Unresolved variable (draft.4 extension)            | Reference /variableId |
| AFIR-TYPE-001    | Operand outside operator's domain                  | Operand expression    |
| AFIR-TYPE-002    | Individually allowed operands have different types | Binary /operator      |
| AFIR-INIT-002    | Read before initialization                         | Reference /variableId |

Literal shape/lexical errors use AFIR-SCHEMA-001. For draft.4 only, redundant Ajv if wrapper errors MUST be removed while retaining underlying constraint violations before ENV-009 normalization. No runtime evaluation, numeric library or constant folding is required or performed by validation.

## Validator resource contract

**EXP-008 — Limits:** For a supported draft.4 document, after parsing/root/version dispatch and before structural validation, iteratively inspect all parsed objects/arrays, including unknown fields. Maximum container nesting is 128 (root object is level 1); maximum total containers is 100,000. Scalars are not containers. At either excess, return only AFIR-LIMIT-001, error severity, root pointer `""`, tool-error status and CLI exit 2, skipping dependent validation. The fixed message is `Document exceeds validator container limits.` These are tool limits, not language restrictions or implicit numeric bounds. Earlier drafts do not acquire these limits. Analysis/traversal MUST NOT depend on recursive semantic or graph calls. Failure to complete analysis MUST NOT be reported as semantic success.

## Traceability

Cases are paired files under `tests/conformance/computation/`; prefixes below include all matching cases. Unit tests additionally cover preservation, deterministic ordering, version isolation and resource boundaries. Runtime semantics are specified but not claimed to be executed by these static checks.

| Rule    | Enforcement                                  | Case prefixes / evidence                                         |
| ------- | -------------------------------------------- | ---------------------------------------------------------------- |
| EXP-001 | Draft.4 schema                               | shape-, operator-, annotation-                                   |
| EXP-002 | Schema lexical/type constraints; scalar pass | literal-, text-                                                  |
| EXP-003 | Scoped declaration index                     | reference-, scope-                                               |
| EXP-004 | Iterative type inference                     | signature-, mismatch-, operand-, cascade-                        |
| EXP-005 | Exact-domain/evaluation specification        | signature-; no evaluator claimed                                 |
| EXP-006 | Pre-state initialized set                    | read-, short-circuit-                                            |
| EXP-007 | Independent checks and explicit gates        | recovery-, scope-, graph-independent-; deterministic unit checks |
| EXP-008 | Iterative preflight                          | Resource unit/CLI boundary checks                                |
