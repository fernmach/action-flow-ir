# Assignment and linear computation

Normative for **0.1.0-draft.4**, with [expressions](expressions.md). This version inherits ENV-001–006/008–009, ACT-002–006/008–009, VAR-001–005 and TYPE-001 from the existing envelope/action/variable chapters. It declares irVersion exactly `0.1.0-draft.4`, permits the node shapes below instead of ACT-001's two-kind restriction, extends ACT-007 degree rules, and replaces draft.3-specific VAR-006/007 analysis with ASN-006/007. Envelope/provenance and declaration shapes remain unchanged. Earlier drafts retain their exact contracts, including draft.3 output rejection.

## Nodes and assignment

**ASN-001 — Shape:** A node MUST be either a closed start/end object containing id and kind, or a closed assign object containing id, kind (`assign`), targetVariableId and value. All fields are required and non-null. value MUST be one [expression tree](expressions.md). Assignment fields on markers, multiple targets/values, destination expressions and undeclared fields MUST be rejected. IDs and target strings follow ENV-003.

**ASN-002 — Destination:** Resolve targetVariableId by exact case-sensitive declaration ID within the containing action, not by name, node ID or another action. Only locals and outputs are writable; inputs are read-only. Node/variable namespaces remain separate. An uninitialized target is permitted. Unknown targets and read-only targets MUST have distinct diagnostics.

**ASN-003 — Compatibility:** The inferred expression type MUST exactly equal the destination's declared primitive type. No coercion, parsing, stringification, rounding, promotion or conversion is implied. Integer → Decimal is invalid. Skip assignment compatibility when the destination is unresolved/read-only or the expression type is unknown; continue independent expression checks.

**ASN-004 — Update:** Each node performs exactly one assignment. Evaluate the entire expression against pre-assignment state, then replace the destination value and transfer control. No partial update occurs during expression evaluation. Self-read requires prior initialization. Reassignment and reading previously initialized outputs are permitted; initialization is retained through valid subsequent assignments. A sequence is not a multi-node transaction. This defines meaning without introducing execution or invocation APIs.

**ASN-005 — Linear graph:** Every action MUST be one finite start → zero or more assign nodes → end path containing every node. Retain exactly one start/end, explicit entry at start, scoped identities, resolved endpoints, no duplicate/self edges and reachability. Degree MUST be start 0 incoming/1 outgoing, assign 1/1, end 1/0. Connections, not array order, define sequence. These constraints exclude reachable and disconnected cycles without a separate cycle diagnostic. Traversals MUST terminate on invalid cyclic input. Branches/merges/loops are unsupported.

## Initialization and validation

**ASN-006 — State:** For an eligible action initialize a set with all input IDs. Walk connections from entry. At each assignment check every reference against the pre-state, including short-circuit operands. After a fully valid destination/expression/type/read check add the destination ID. Targets do not initialize their own reads. At normal completion report every output absent from the set, unless ASN-007 suppressed dependent analysis. Empty outputs and unused uninitialized locals are permitted. No general fixed-point or merge analysis is required.

**ASN-007 — Prerequisites and recovery:** After structural success:

1. Run graph checks and declaration identity checks independently, preserving existing diagnostic meanings and graph prerequisite suppression. Duplicate action IDs remain document-level and do not suppress otherwise eligible local work.
2. If IDs/names are unique, resolve destinations and analyze references/types on every assignment independently of graph validity. Otherwise suppress dependent variable resolution/type/read analysis, continuing literal scalar checks and independent graph checks.
3. Run flow-dependent reads/completion only with valid local graph and usable scope. Visit assignments in connection order. At the first assignment with any destination, expression, compatibility or read error, report all its read errors but do not update state. Stop later initialization propagation and suppress subsequent read/completion diagnostics for that action.
4. Continue independent destination/reference/type analysis at all later nodes regardless of the stopped flow walk. Other actions remain independent. A resolved uninitialized read retains its type, permitting independent type errors.

This recovery suppresses cascades, not invalidity: an invalid update never initializes a destination and the action already has an error. An otherwise valid graph that never writes an output still fails completion. Validation MUST NOT evaluate expressions or execute assignments.

| Code            | Meaning                                    | Pointer relative to action  |
| --------------- | ------------------------------------------ | --------------------------- |
| AFIR-REF-001    | Unresolved destination (draft.4 extension) | /nodes/{n}/targetVariableId |
| AFIR-ASSIGN-001 | Input used as destination                  | /nodes/{n}/targetVariableId |
| AFIR-TYPE-003   | Assignment type mismatch                   | /nodes/{n}/value            |
| AFIR-INIT-001   | Output uninitialized at completion         | /outputs/{o}/id             |

Use existing schema/graph/identity diagnostics and the [expression diagnostics](expressions.md#meaning-and-static-obligations). All semantic failures have error severity, invalid status, CLI exit 1, and deterministic pointer/code/message ordering/deduplication. No action/node context fields are added.

## Traceability

Cases are paired files under `tests/conformance/computation/`. Existing cases remain regressions; inherited draft.3 cases additionally exercise draft.4 with unchanged expectations where no behavior changed. Prefixes below include all matching cases.

| Rule    | Enforcement                                       | Case prefixes / evidence                                 |
| ------- | ------------------------------------------------- | -------------------------------------------------------- |
| ASN-001 | Strict marker/assign schema                       | shape-, annotation-                                      |
| ASN-002 | Action-local index/category                       | target-, scope-                                          |
| ASN-003 | Exact inferred/destination comparison             | assignment-, recovery-                                   |
| ASN-004 | Pre-state reads then update                       | read-, reassignment-, output-read-                       |
| ASN-005 | Degrees/reference/reachability and iterative path | graph-, reordered, empty                                 |
| ASN-006 | Forward initialized set                           | read-, completion-, short-circuit-                       |
| ASN-007 | Independent stages and recovery gates             | recovery-, scope-, graph-independent-, duplicate-action- |

## Compatibility and limits

Draft.4's structural contract is the independent schema named in the expressions chapter. Producers migrating draft.3 must explicitly change version and add valid assignments where outputs require initialization; the validator MUST NOT perform migration. No input defaults, nullable types, branch nodes, conversions, adapters or execution are introduced. Draft.4 resource-limit failures are tool errors under EXP-008, distinct from invalid documents.

Draft.5 [branches and joins](branches.md) extend these assignment/expression rules with direct joins, triple edge identity, acyclicity and path-local initialization recovery. The draft.4 linear contract remains unchanged.
