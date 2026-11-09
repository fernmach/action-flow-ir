# Branches and direct joins

Normative for **0.1.0-draft.5**. The independent Draft 2020-12 schema is `schema/0.1.0-draft.5/action-flow.schema.json`, identifier `urn:action-flow-ir:schema:0.1.0-draft.5`.

This version inherits draft.4 envelope/declarations/primitive domains, EXP-001–006, and assignment shape/destination/compatibility/update rules ASN-001–004, extended explicitly below. It declares irVersion exactly draft.5. BRN-003/004 replace endpoint-pair and linear graph restrictions; BRN-005/006 replace linear initialization/recovery. EXP-007 scope/type suppression, applicable-only if-wrapper filtering and ACT semantic diagnostic sorting/deduplication apply with these extensions. Earlier drafts remain unchanged; no migration/default insertion is performed.

## Representation and graph rules

**BRN-001 — Shape:** In addition to start/end/assign, nodes MAY be closed objects containing exactly id, kind (`branch`) and condition. All are required and reject null. condition MUST be an existing expression tree; no redundant result type is allowed. Connections retain required fromNodeId/toNodeId and MAY contain label, which MUST be exactly string `true` or `false`. Connections reject other fields and nulls. ID/reference strings inherit ENV-003 and exact action-local identity.

**BRN-002 — Condition:** A resolved/inferred branch condition MUST have type Boolean exactly. No truthiness/coercion is permitted. Unknown result types suppress dependent condition-type diagnostics. Conceptually evaluate the condition once against incoming state, then follow exactly one labeled outcome. Branches do not write variables. Both outcomes MUST be statically checked, including literal/constant conditions; there is no path pruning or runtime evaluation in validation. Existing conservative short-circuit operand checking remains applicable.

**BRN-003 — Labels and edges:** Every branch MUST have exactly one true and one false outgoing edge. Every edge from a nonbranch source MUST omit label. Source-kind checks require a resolved source. Report missing labels on branch edges, forbidden labels on ordinary edges, later duplicate outcome labels and one missing-outcome violation per branch missing either/both outcomes. Compare edge identity as ordered (fromNodeId, toNodeId, label), using a missing-label sentinel distinct from strings. Reject later exact duplicates and self-edges. An exact duplicate branch edge receives both duplicate-edge and duplicate-outcome diagnostics. True/false outcomes MAY share a target and remain separate edges. Order does not establish execution or choose an outcome.

**BRN-004 — DAG:** Exactly one start/end, explicit entry at start, scoped node identity and resolved endpoints remain required. Every node MUST be reachable from entry and the entire graph MUST be acyclic. Degrees are start 0 incoming/1 outgoing; assign at least 1 incoming/1 outgoing; branch at least 1 incoming/2 outgoing; end at least 1 incoming/0 outgoing. Incoming counts count edge occurrences, including parallel outcomes to one target. Direct joins at assign, branch and end nodes are permitted, without dedicated merge nodes or paired-region restrictions. With these rules every path in the finite DAG reaches the unique end. A join is control-flow convergence, not parallel synchronization. Detect cycles explicitly; report one cycle violation per action, not one per residual topological node.

## Initialization and recovery

**BRN-005 — State:** Start's initialized set consists of all input IDs. For every other node, intersect initialized sets on all incoming edges. A reliable assignment reads its pre-state then adds its destination only after destination, expression, compatibility and read checks succeed. A branch reads its pre-state and sends the same unchanged state to both outcomes. Values assigned on different paths may differ; a declaration's fixed type remains unchanged. No phi/value-merging syntax or value computation occurs. At end report each output not definitely initialized once at its declaration. Empty outputs and unused locals are allowed.

**BRN-006 — Reliability:** An edge carries either a reliable initialized set or an explicit unreliable marker. Unreliable is not an empty set or a language value. If any incoming edge is unreliable, suppress dependent reads/completion at the join and propagate unreliable; do not discard the bad predecessor to manufacture guarantees. With reliable input, check all reads even when independent node errors already exist. Any assignment/condition/reference/type/read error makes all outgoing state unreliable, with no assumed write. Unaffected sibling paths continue until convergence with an unreliable path. Independent reference/type/literal checks continue at every node. Invalid graphs suppress flow-dependent analysis. Duplicate variable ID/name suppresses dependent scope/type/read checks but not literal scalar or graph checks. Duplicate action IDs never suppress local work. Actions are independent.

**BRN-007 — Staging:** Structural failure stops all semantic analysis. After structural success and BRN-008 accounting, run graph/declaration checks independently and independent expression checks on every value/condition. Graph staging MUST report duplicate nodes/marker counts, skipping remaining graph work if node IDs are ambiguous. Otherwise resolve entry/endpoints and check resolved entry kind, edge triples/self-edges and source labels/outcome counts. Run degree, reachability and cycle checks independently only when no earlier local graph diagnostic exists. Then run flow analysis only for graph/scope-valid actions. Traversal/analysis MUST be iterative and terminate on invalid input; array order MUST NOT change validity. Semantic diagnostics retain error severity, invalid status, exit 1 and ascending pointer/code/message ordering with identical entries removed.

| Code            | Meaning                                     | Pointer relative to action |
| --------------- | ------------------------------------------- | -------------------------- |
| AFIR-BRANCH-001 | Known condition result is not Boolean       | /nodes/{n}/condition       |
| AFIR-BRANCH-002 | One/both outcomes missing (once per branch) | /nodes/{n}                 |
| AFIR-BRANCH-003 | Later duplicate outcome                     | /connections/{e}/label     |
| AFIR-BRANCH-004 | Branch edge has no label                    | /connections/{e}/label     |
| AFIR-BRANCH-005 | Ordinary edge has a label                   | /connections/{e}/label     |
| AFIR-FLOW-008   | Cycle (once per action)                     | /nodes                     |

Use existing schema, identity, reference, self/duplicate edge, degree/reachability, expression, assignment and initialization codes where applicable. AFIR-FLOW-004 now compares triples in draft.5 only; missing labels use the pointer of the absent field. A branch with two unlabeled outgoing edges receives both missing-label diagnostics and one missing-outcome diagnostic, plus duplicate-edge diagnostics if triples repeat. Degree/reachability/cycle are suppressed by these earlier local errors. Invalid label syntax itself is structural, not a semantic outcome error.

## Validator resource contract

**BRN-008 — Bounded analysis:** Retain EXP-008 pre-schema container limits for draft.5: 128 levels, 100,000 containers, AFIR-LIMIT-001. After structural success and before semantic checks, compute the sum over actions of:

```text
(node count + connection count) × max(1, ceil(declaration count / 32))
```

Declaration count includes inputs, outputs and locals, even duplicates. The inclusive per-document limit is 5,000,000 word units. At excess return only AFIR-LIMIT-002, severity error, root pointer `""`, tool-error status and exit 2, message `Document exceeds validator data-flow limits.` Skip semantic work; do not claim invalidity or success. Structural errors precede this estimate; pre-schema container failures precede structure. Earlier versions acquire no new estimate. This bounds variable-indexed bitset storage and intersection/copy work without enumerating paths; it is a tool policy, not a numeric/domain restriction.

## Traceability and limits

Cases are paired documents under `tests/conformance/branches/`; prefixes identify all matching cases. Unit/CLI tests additionally cover deterministic ordering, preservation, budgets and version isolation.

| Rule    | Enforcement                                    | Case prefixes / evidence                         |
| ------- | ---------------------------------------------- | ------------------------------------------------ |
| BRN-001 | Draft.5 strict schema                          | shape-, inherited-                               |
| BRN-002 | Expression inference and condition check       | condition-, short-circuit-                       |
| BRN-003 | Source label/edge indexes                      | label-, edge-, same-target                       |
| BRN-004 | Degrees, reachability, iterative Kahn analysis | graph-, join-, nested, crossing, reordered       |
| BRN-005 | Bitset predecessor intersection                | initialize-, completion-, constant-              |
| BRN-006 | Explicit reliable/unreliable propagation       | recovery-, scope-, independent-                  |
| BRN-007 | Independent checks and prerequisites           | combined-, inherited-; deterministic unit checks |
| BRN-008 | Structural-success word estimate               | Resource unit/CLI boundary tests                 |

Native evidence is summarized in the GitHub-only development review at `doc/development/reviews/006-outsystems-server-action-fidelity.md`. It is not an adapter contract: implicit native defaults are not materialized, and native-accepted one-arm output assignment remains AFIR-invalid. Same-target core cases are synthetic because the tested native Model API creation route rejected them. Loops, calls, native-default lowering, adapters and execution remain unsupported. Draft.5 static validity does not prove runtime equivalence to a target.
