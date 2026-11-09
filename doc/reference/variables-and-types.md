# Variable and type field reference

Available in **0.1.0-draft.3**. See the [normative variable/type rules](../spec/variables-and-types.md) and [authoring guide](../guide/variables-and-types.md).

| Field            | Required | Value                                                                                               |
| ---------------- | -------- | --------------------------------------------------------------------------------------------------- |
| action.inputs    | Yes      | Array of input declarations; may be empty                                                           |
| action.outputs   | Yes      | Array of output declarations; nonempty arrays fail initialization checks on otherwise valid actions |
| action.locals    | Yes      | Array of local declarations; may be empty or unused                                                 |
| declaration.id   | Yes      | Nonempty string without surrounding ECMAScript whitespace                                           |
| declaration.name | Yes      | Whole-string ASCII identifier: letter or underscore, followed by letters, digits or underscores     |
| declaration.type | Yes      | Exactly Boolean, Integer, Decimal or Text                                                           |

All objects are closed; nulls, defaults, values, initializer expressions and nullable flags are invalid. IDs and names are separately unique across all three arrays within an action. Identity is exact and case-sensitive. Variable IDs may equal node/action/document IDs and may repeat across different actions. No names are reserved.

Inputs are initialized and read-only. Outputs and locals start uninitialized; no defaults exist. Only start/end nodes are supported, so no output can be initialized. Every otherwise valid action with outputs is invalid. These are static validation rules, not an invocation or execution API.

## Diagnostics

All diagnostics below have error severity, invalid status and CLI exit 1. Structural errors use AFIR-SCHEMA-001.

| Code          | Meaning                                      | Location                  |
| ------------- | -------------------------------------------- | ------------------------- |
| AFIR-VAR-001  | Duplicate ID across declaration categories   | Later declaration's /id   |
| AFIR-VAR-002  | Duplicate name across declaration categories | Later declaration's /name |
| AFIR-INIT-001 | Output uninitialized at completion           | Output declaration's /id  |

Duplicate traversal is inputs, outputs, locals. A declaration can receive both duplicate diagnostics. Graph and declaration checks run independently after structural success. Initialization checks require a valid local graph and no duplicate variable IDs/names; duplicate action IDs do not suppress local checks. Semantic diagnostics use the existing deterministic pointer/code/message order.
