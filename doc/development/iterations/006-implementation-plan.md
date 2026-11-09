# Step 6 implementation plan: draft.5 branches and joins

Status: implemented and verified — see ITER-006 for actual results
Date: 2026-11-09
Related record: [ITER-006](006-branches.md)

The user approved all remaining semantic recommendations and authorized implementation across specification, schema, validator, conformance, examples and documentation. This plan fixes the remaining engineering choices. Enduring rules belong in the [branches specification](../../spec/branches.md), not this development plan.

## Contract and compatibility

- Add immutable 0.1.0-draft.5 with strict branch nodes containing id, kind and condition; Boolean conditions use unchanged draft.4 expression trees and exact typing.
- Add optional connection label, structurally limited to string true/false. Branch sources require one of each; ordinary sources prohibit labels. Keep one start/end. Incoming degrees: start 0; assign/branch/end at least 1. Outgoing degrees: start/assign 1, branch 2, end 0.
- Permit direct joins and same-target true/false outcomes. Edge identity is ordered (fromNodeId, toNodeId, label), using a missing-label sentinel distinct from strings. Self-edges remain invalid. Exact duplicates produce both duplicate-edge and duplicate-outcome diagnostics where applicable.
- Require all nodes reachable and the graph acyclic. Analyze both outcomes, including constant conditions, without execution or constant folding. Use all-predecessor initialization intersection and path-local reliable/unreliable state.
- Preserve earlier schemas, diagnostic staging and resource policies exactly. Exclude native-default lowering, adapters, loops, calls, optional inputs, new operators and execution. Native review evidence remains ignored/local.

## Graph diagnostics and staging

After structural success, declaration/graph checks and literal scalar checks remain independent. Existing graph staging is retained: report duplicate node IDs and marker counts, then skip dependent graph checks if node IDs are ambiguous. Otherwise resolve references and inspect edge triples/self-edges and source labels. Run degree/reachability/acyclicity independently only when no earlier local graph diagnostic exists. Document-level duplicate action IDs never suppress local work.

| Code            | Violation                                                   | Pointer                 |
| --------------- | ----------------------------------------------------------- | ----------------------- |
| AFIR-BRANCH-001 | Known condition result is not Boolean                       | Branch /condition       |
| AFIR-BRANCH-002 | Missing true or false outcome; one diagnostic per branch    | Branch node             |
| AFIR-BRANCH-003 | Later duplicate outcome label, even with a different target | Later connection /label |
| AFIR-BRANCH-004 | Branch edge lacks a label                                   | Connection /label       |
| AFIR-BRANCH-005 | Ordinary edge has a label                                   | Connection /label       |
| AFIR-FLOW-008   | Cycle detected; one per action                              | Action /nodes           |

Retain AFIR-FLOW-004 for later duplicate triples, AFIR-FLOW-005 for self-edges, and existing reference/degree/reachability codes and pointers. Structural label errors use AFIR-SCHEMA-001. A branch with two unlabeled edges receives missing-label diagnostics and one missing-outcome diagnostic; source-specific label checks require resolved source IDs. Duplicate outcome checks follow connection-array order. Semantic output retains sorting/deduplication and exit 1. Unknown expression types suppress only dependent condition-type errors.

## Analysis and resource choices

- Build integer node indexes, incoming/outgoing edge lists and an iterative Kahn order. Count parallel outcomes separately. A cycle produces one action-level diagnostic, not misleading reports for every residual descendant. Use iterative reachability and preserve declaration-array duplicate ordering.
- Run independent assignment/condition expression checks on every node after structural success, regardless of graph validity. Reuse existing expression analysis. Duplicate variable ID/name gates suppress dependent scope checks but not Text scalar checks.
- For a graph/scope-valid action, propagate a state per node, shared immutably by its outgoing edges. A state is either a Uint32Array bitset or an explicit unreliable marker. Variable indices follow inputs, outputs, locals. Each reliable node clones its first predecessor state and intersects the rest; start begins with input bits set. An assignment sets its destination bit only after every independent and read check succeeds; branch never adds bits.
- If any incoming state is unreliable, suppress dependent reads/completion at that node and propagate unreliable. For reliable input, report all reads even if independent errors exist; any error taints all outgoing edges. Unaffected paths continue. At end report each missing output once, only when all incoming states are reliable.
- Retain 128 container levels / 100,000 containers pre-schema for draft.5, with unchanged AFIR-LIMIT-001. After structural success, before semantic checks, compute a per-document estimate: sum over actions of (nodeCount + connectionCount) × max(1, ceil(declarationCount / 32)). Allow at most **5,000,000 word units**, inclusive. This bounds bitset storage and intersection/copy work without path enumeration; persistent node bitsets occupy at most 20 MB of word storage under this estimate, excluding ordinary graph/index overhead already bounded by container count.
- At estimate excess return only AFIR-LIMIT-002, error severity, root pointer, tool-error status, exit 2, message `Document exceeds validator data-flow limits.` Skip semantic analysis, even if it would have found invalidity. Structural errors win over this estimate; pre-schema container excess still wins first. Earlier versions never receive the new estimate. Threshold/accounting are fixed, reproducible tool policy, not language restrictions.

## Delivery and acceptance

1. Adopt BRN-001–008 and ADR-006, then author independent expectations before implementation.
2. Add draft.5 schema/types/dispatch and resource policy, with unchanged expression definitions and applicable-only schema diagnostic normalization.
3. Implement version-specific graph validation and reliable bitset propagation. Share semantic diagnostic ordering without changing drafts 2–4. Preserve the old linear flow implementation for draft.4.
4. Add conditional CalculateDiscount, both-arm initialization and nested-join public examples authored from generic design cases, not private native IDs. Keep the one-arm negative and same-target synthetic cases explicit. Validate local reviewed native mappings separately from public examples.
5. Cover condition types/reads, malformed nodes/labels, missing/duplicate outcomes and triples, same-target edges, direct/crossing/nested/branch/end joins, cycles, array order, intersections, constant paths, tainted joins and unaffected siblings, scope/reference cascades, budgets/boundaries, CLI streams/exits, startup failures and mixed-version isolation. Retain all existing regressions; port compatible draft.4 cases as additional draft.5 coverage with independently reviewed changes for expanded graph semantics.
6. Update field/diagnostic references, authoring guide, navigation and supported versions; advance unsupported draft.5 probes to draft.6. Run lint fixes before default formatting, review the diff, then bun run check. Record exact actual outcomes. Close ITER-006 and update status/roadmap only after all required checks pass.
