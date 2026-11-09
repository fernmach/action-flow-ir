# Expression and assignment field reference

Available in **0.1.0-draft.4**. See the normative [expression](../spec/expressions.md) and [assignment](../spec/assignment.md) contracts and the [authoring guide](../guide/computation.md).

| Object          | Required fields                                         |
| --------------- | ------------------------------------------------------- |
| Assignment node | id, kind (assign), targetVariableId, value (expression) |
| Literal         | kind (literal), type, value                             |
| Variable read   | kind (variable), variableId                             |
| Unary           | kind (unary), operator, operand                         |
| Binary          | kind (binary), operator, left, right                    |

All objects are closed; all fields are required and reject null. Start/end retain id/kind only. One assignment writes one local or output; inputs are read-only. Targets and reads resolve action-local variable IDs, not names. Literals declare types; other expressions infer them. Integer/Decimal values are plain numeric strings, Boolean values JSON booleans, Text values scalar-valid JSON strings. Types must match exactly; no conversions or defaults exist.

Unary operators are negate/not. Binary operators are add/subtract/multiply, equal/notEqual, lessThan/lessThanOrEqual/greaterThan/greaterThanOrEqual, and/or. Numeric operands match types; Boolean operators require Boolean; equality requires matching primitive types. No division, text arithmetic/order, calls or conditionals are defined.

Expressions read pre-assignment state. Valid assignment initializes its target. Static checks inspect both operands even when runtime short-circuiting would skip one. Valid graphs are finite linear paths start → assignments → end. All outputs must be initialized at completion; unused locals are permitted. Array order does not establish execution order.

## Diagnostics

All semantic codes below have severity error, invalid status and exit 1. Structural errors use AFIR-SCHEMA-001; existing graph/identity codes remain applicable.

| Code             | Meaning                                  | Location              |
| ---------------- | ---------------------------------------- | --------------------- |
| AFIR-REF-001     | Unknown target or variable ID            | Reference field       |
| AFIR-LITERAL-001 | Text contains unpaired surrogate         | Literal value         |
| AFIR-TYPE-001    | Operator operand outside accepted domain | Operand expression    |
| AFIR-TYPE-002    | Allowed operands have mismatching types  | Binary operator       |
| AFIR-ASSIGN-001  | Input is read-only                       | targetVariableId      |
| AFIR-TYPE-003    | Assignment/destination types differ      | Assignment value      |
| AFIR-INIT-002    | Read before initialization               | variableId            |
| AFIR-INIT-001    | Output missing at completion             | Output declaration id |

Graph and scope checks run independently after structural success. Variable ID/name duplicates suppress dependent scope checks; Text scalar validation continues. Invalid graphs suppress flow-dependent checks, retaining independent expression/assignment checks. At the first invalid assignment in graph order, report its reads and stop subsequent initialization/completion checks, retaining independent later errors. Unknown child types suppress dependent type errors rather than acquiring guessed types.

## Resource limits

Draft.4 documents undergo iterative preflight before schema validation. More than 128 object/array nesting levels (root level 1) or 100,000 object/array containers returns one AFIR-LIMIT-001 at root, severity error, **tool-error status and exit 2**, with message `Document exceeds validator container limits.` Scalars do not count. This includes unknown fields, distinguishes tool limits from language invalidity, and does not impose numeric precision bounds. Earlier drafts are unchanged.
