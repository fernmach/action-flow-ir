# Branch and join field reference

Available in **0.1.0-draft.5**. See the [normative branch contract](../spec/branches.md) and [authoring guide](../guide/branches.md). Existing declaration, expression and assignment fields retain their meaning.

| Object      | Required fields                           | Optional fields              |
| ----------- | ----------------------------------------- | ---------------------------- |
| Branch node | id, kind (branch), condition (expression) | None                         |
| Connection  | fromNodeId, toNodeId                      | label (string true or false) |

Branch conditions must have Boolean type. Every branch needs one true and one false connection, even for constant conditions. Those outcomes may share a target. Start/assign connections omit labels; end has no outgoing connection. Objects reject unknown fields/nulls. IDs use existing exact case-sensitive scope rules.

One start and one end remain required. Assignments, branches and end accept one or more incoming edges. All nodes must be reachable and the graph acyclic. Joins use existing nodes, without merge objects or paired-region restrictions. Connections determine control transfer; array order does not.

## Initialization and recovery

At a join, intersect initialization from every incoming edge. A variable initialized before splitting remains initialized; a variable assigned on both arms is initialized after joining; an assignment on only one arm is insufficient. Branches do not initialize variables. Check reads in conditions and values against incoming state, including both outcomes and short-circuited operands. At end, every output must be initialized.

If a node is invalid, its outgoing states become unreliable. A join with any unreliable incoming state suppresses dependent read/completion checks and propagates unreliability. Unaffected sibling paths still receive their checks. Independent reference/type/literal diagnostics continue throughout the graph. Invalid graphs suppress flow analysis; unusable variable scopes retain existing suppression rules.

## Diagnostics

These semantic diagnostics have error severity, invalid status and exit 1. Existing expression/assignment/initialization diagnostics remain in use.

| Code            | Meaning                               | Location                      |
| --------------- | ------------------------------------- | ----------------------------- |
| AFIR-BRANCH-001 | Known condition result is not Boolean | Branch condition              |
| AFIR-BRANCH-002 | Missing one/both outcomes             | Branch node, once             |
| AFIR-BRANCH-003 | Later duplicate true/false label      | Connection label              |
| AFIR-BRANCH-004 | Branch connection lacks label         | Missing label field           |
| AFIR-BRANCH-005 | Ordinary connection has label         | Connection label              |
| AFIR-FLOW-008   | Graph has a cycle                     | Action nodes collection, once |

Draft.5 compares duplicate edges by ordered source/target/label triple. Exact duplicate branch edges also produce duplicate-outcome diagnostics. Missing/duplicate/forbidden label errors suppress dependent degree/reachability/cycle analysis; when those prerequisites pass, degree, reachability and cycle checks run independently. Structural errors stop semantic checks, and invalid label spellings use AFIR-SCHEMA-001. Diagnostics retain deterministic pointer/code/message sorting and deduplication.

## Resource limits

The pre-schema 128-level/100,000-container policy is inherited from draft.4 (AFIR-LIMIT-001). After structural success, draft.5 also estimates data-flow word units as the document sum of `(nodes + connections) × max(1, ceil(declarations / 32))` per action. Declarations include inputs/outputs/locals, including duplicates. The inclusive limit is 5,000,000. Excess returns only AFIR-LIMIT-002 at root, severity error, tool-error status, exit 2 and message `Document exceeds validator data-flow limits.` Semantic checks are skipped. Structural errors precede this estimate; earlier drafts do not acquire it.

These are validator resource limits, not restrictions on mathematical values or language validity. Static validation does not execute the action or prove runtime target equivalence. Native defaults, adapters, loops and calls remain outside this version.
