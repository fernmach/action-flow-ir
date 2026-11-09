# Minimal actions and connections

Normative for **0.1.0-draft.2**. Its independent Draft 2020-12 schema is `schema/0.1.0-draft.2/action-flow.schema.json`, identified by `urn:action-flow-ir:schema:0.1.0-draft.2`. Draft.1 remains supported unchanged. [Draft.3](variables-and-types.md) inherits these graph rules and adds required variable declarations without changing draft.2.

## Representation and rules

Draft.2 inherits [ENV-001 through ENV-006 and ENV-008 through ENV-009](document-envelope.md), including provenance, strictness, exact version dispatch and nonmutation. Its irVersion is exactly `0.1.0-draft.2`. Its actions MUST be an array, empty or containing the action objects defined here; this replaces only draft.1's empty-array restriction ENV-007. No other envelope behavior changes.

**ACT-001 — Shape:** Actions MUST contain id, entryNodeId, nodes (array) and connections (array). Nodes MUST contain id and kind; kind MUST be `start` or `end`. Connections MUST contain fromNodeId and toNodeId. All these objects MUST reject undeclared fields and all declared fields MUST reject null. Empty node/connection arrays are structurally permitted but subject to semantic rules. No action metadata, connection IDs or labels are defined.

**ACT-002 — Strings:** IDs and reference strings MUST satisfy ENV-003's nonempty/no-surrounding-ECMAScript-whitespace constraints. Identity comparison MUST be exact and case-sensitive, with no Unicode normalization.

**ACT-003 — Scope:** Action IDs MUST be unique within a document; node IDs MUST be unique within their action. Node IDs MAY repeat across actions and MAY equal action/document IDs.

**ACT-004 — Markers:** Every action MUST have exactly one start node and exactly one end node.

**ACT-005 — References:** Entry and both connection endpoints MUST resolve within the containing action. Entry MUST identify its start node.

**ACT-006 — Edges:** Duplicate endpoint pairs and self-connections MUST be rejected. Endpoint pair comparison is ordered: from/to. No connection identity beyond that pair is defined.

**ACT-007 — Degree:** Start MUST have zero incoming and exactly one outgoing connection. End MUST have exactly one incoming and zero outgoing connections.

**ACT-008 — Reachability:** Every node MUST be reachable from entry by following outgoing connections.

**ACT-009 — Order:** Node and connection array order MUST NOT establish entry or execution order. Actions are independent declarations; their array order MUST NOT imply invocation.

Start marks entry, its outgoing connection denotes control transfer, and end denotes normal completion. These meanings introduce no execution engine, invocation, return values or failure semantics. Only start → end can form a valid nonempty action in this draft. The supported kinds and degree rules exclude cycles, so no separate cycle algorithm is needed.

## Validation and diagnostics

Parsing, root/version checks and schema validation precede semantic validation. Structural failure MUST stop all semantic checks. Semantic validation MUST:

1. Report duplicate action IDs at every later occurrence while continuing all actions' local checks.
2. Report duplicate node IDs at every later occurrence and independent start/end count violations within each action.
3. Skip remaining local checks when node IDs are duplicated.
4. Otherwise resolve entry/endpoints, check resolved entry kind, and report duplicate/self-connections. Continue independent checks despite other reference errors or marker count violations.
5. Run degree and reachability only if no preceding local semantic errors exist. A duplicate action ID is document-level and does not suppress local checks. Once eligible, run degree and reachability independently.

All semantic diagnostics have severity error and invalid status. They contain code, severity, path and a project-owned message, without action/node context fields. Sort by pointer, code, then message using ascending UTF-16 code-unit comparison, and remove identical diagnostics. Schema diagnostic ordering remains ENV-009.

| Code            | Meaning                                           | Pointer relative to /actions/{index}  |
| --------------- | ------------------------------------------------- | ------------------------------------- |
| AFIR-ACTION-001 | Duplicate action ID                               | /id of later occurrence               |
| AFIR-NODE-001   | Duplicate node ID                                 | /nodes/{index}/id of later occurrence |
| AFIR-FLOW-001   | Start count is not one                            | /nodes                                |
| AFIR-FLOW-002   | End count is not one                              | /nodes                                |
| AFIR-REF-001    | Unresolved entry or endpoint                      | Offending reference field             |
| AFIR-FLOW-003   | Resolved entry is not start                       | /entryNodeId                          |
| AFIR-FLOW-004   | Duplicate endpoint pair                           | Later /connections/{index}            |
| AFIR-FLOW-005   | Self-connection                                   | /connections/{index}                  |
| AFIR-FLOW-006   | Invalid degree; one diagnostic per violating node | /nodes/{index}                        |
| AFIR-FLOW-007   | Unreachable node                                  | /nodes/{index}                        |

## Traceability

Cases are paired files under `tests/conformance/actions/`; prefixes denote all matching cases. Inherited envelope cases are also exercised under draft.2.

| Rule    | Enforcement                                                     | Evidence                                                                         |
| ------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ACT-001 | Schema required/type/additionalProperties/enum; AFIR-SCHEMA-001 | minimal, empty, shape-*                                                          |
| ACT-002 | Schema string constraints, exact Map/Set identity               | string-*, identities, unicode-distinct, case-reference                           |
| ACT-003 | Action/node indexes; AFIR-ACTION-001/NODE-001                   | multiple, identities, duplicate-actions, duplicate-nodes, duplicate-action-local |
| ACT-004 | Marker counts; AFIR-FLOW-001/002                                | minimal, markers-*, duplicate-nodes                                              |
| ACT-005 | Local node index; AFIR-REF-001/FLOW-003                         | minimal, references-*, entry-end, cross-action, case-reference                   |
| ACT-006 | Ordered pair set; AFIR-FLOW-004/005                             | minimal, duplicate-edges, self-edge, combined-reference                          |
| ACT-007 | Adjacency degrees; AFIR-FLOW-006                                | minimal, reversed-edge, missing-edge, cycle                                      |
| ACT-008 | Iterative graph traversal; AFIR-FLOW-007                        | minimal, missing-edge, reversed-edge                                             |
| ACT-009 | Explicit entry and references                                   | reordered, multiple; semantic nonmutation/order regressions                      |

The implementation checks supported rules now. Variables are supported by draft.3; expressions and assignment are supported by draft.4. Branching and joins are supported by [draft.5](branches.md); loops and calls await future drafts.
