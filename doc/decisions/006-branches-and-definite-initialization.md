# ADR-006: Branches, direct joins and definite initialization

Status: accepted
Date: 2026-11-09
Related iteration: [ITER-006](../development/iterations/006-branches.md)
Supersedes / superseded by: none

## Context and options

Step 6 needs explicit Boolean control transfer and initialization after convergence. Dedicated merge nodes/paired regions constrain native graph fidelity; union of initialized sets is unsound; enumerating paths is exponential. Stopping a whole action after one path error hides independent diagnostics.

## Decision

The user confirmed direct joins, arbitrary reachable acyclic graphs, same-target outcomes and path-local recovery, then approved all remaining semantic recommendations and implementation. Deliver draft.5 with branch/condition nodes, true/false labeled connections, one end, exact Boolean conditions, all-predecessor intersection and unreliable-state propagation. Analyze both outcomes even for constant conditions. Edge identity includes its outcome. Preserve earlier drafts and keep native defaults/adapters outside scope.

Use iterative topological analysis and variable-indexed Uint32Array state. Bound per-document estimated word units by 5,000,000, using (nodes + edges) × max(1, ceil(declarations / 32)) per action, after schema success. Container limits remain pre-schema. Report excess as a tool error, not invalidity. The accepted [implementation plan](../development/iterations/006-implementation-plan.md) fixes diagnostics, suppression and boundary accounting.

## Consequences and follow-up

The [branches chapter](../spec/branches.md) adopts enduring rules. The [native-target review](../development/reviews/006-outsystems-server-action-fidelity.md) supports direct joins but documents initialization gaps and same-target creation restrictions; these do not silently redefine the core. Synthetic tests cover general DAGs and same-target edges; native payloads stay local. Runtime equivalence, adapters, loops and calls remain separately scoped.
