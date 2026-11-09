# Roadmap

Steps 0–6 are implemented locally; Steps 7–10 remain planned. Each follows `iteration-workflow.md` and produces the applicable full deliverable set. The sequence may change through a recorded rationale when dependencies or real examples require it. See [Step 0](iterations/000-tooling-foundation.md), [Step 1](iterations/001-document-envelope.md) [Step 2](iterations/002-minimal-actions.md) [Step 3](iterations/003-variables-and-types.md), [Step 4](iterations/004-expressions.md) [Step 5](iterations/005-assignment.md) and [Step 6](iterations/006-branches.md) for evidence and limits.

| Step | Capability          | Key rules and checks                                                                                                                        | Dependencies                                |
| ---- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0    | Tooling foundation  | Scaffold accepted TypeScript/Node.js/Ajv/Vitest/Docusaurus stack; minimal CLI, diagnostics contract, fixture harness, reproducible commands | Stack accepted in ADR-001                   |
| 1    | Document envelope   | Version declaration, identity, collection shape, metadata policy, unknown fields, supported-version handling                                | 0                                           |
| 2    | Minimal action      | Action and node IDs, start/end, entry, connections, endpoint resolution, cardinalities                                                      | 1                                           |
| 3    | Variables and types | Inputs, outputs, locals, primitive types, naming, scope, initialization policy                                                              | 2                                           |
| 4    | Expressions         | Typed literals/references, small operator set, type results, evaluation rules, decimal representation                                       | 3                                           |
| 5    | Assignment          | Writable destinations, compatible types, evaluation and update order                                                                        | 4                                           |
| 6    | Branches            | Boolean conditions, branch labels, uniqueness, required connections and merges                                                              | 5                                           |
| 7    | Loops               | Loop representation, collection types, iteration scope/order, exits and cycles                                                              | 6; collection type design                   |
| 8    | Action calls        | Signatures, resolution, argument evaluation, output mapping, recursion/failure policy                                                       | 6; extend analysis for loops when supported |
| 9    | Flow analysis       | Reachability, definite initialization/output assignment, legal termination, merge and loop behavior                                         | Incrementally from 2; complete against 7–8  |
| 10   | Compatibility       | Feature declarations/profiles and target-specific unsupported-feature diagnostics                                                           | Stable core; concrete target requirements   |

Step 0 supplies only infrastructure needed to execute Step 1; avoid speculative frameworks. It may be delivered with Step 1 while retaining separate acceptance criteria.

## First usable milestone — complete locally

Delivered Steps 0–6 and the applicable flow analysis from Step 9: one typed `CalculateDiscount` action, assignments and a conditional, a precisely defined small operator set, structural/reference/type validation, and flow checks required by its specified rules. CLI text/JSON results and complete conformance/docs coverage are verified. This is a static-validation milestone, without an execution engine or runtime-equivalence claim.

Do not postpone validation of already-supported normative rules until Step 9. More advanced analysis can arrive later only with its scope clearly bounded. General termination cannot be guaranteed for arbitrary programs; specify structural termination rules and conservative analysis limits instead.

Test the design against an authorized real OutSystems action before expanding it. Record fidelity gaps and provenance without importing private module content into public examples.

## Later work

Queries, entity operations, exceptions, transactions, client/server context, adapters, generators, executable reference semantics, human-readable syntax, graphical views, and optional DMN/FEEL integration require separately scoped increments. No automatic round-trip fidelity or cross-language behavior equivalence is claimed.

## Release discipline

The first release label is provisional; do not confuse an IR format version, schema dialect, validator package version, and documentation version. Define their relationship during Step 1. Record breaking format/semantic changes and migration expectations. Never reinterpret an already-released version silently.

Step 3 preserves explicit output initialization: draft.3 rejects output-bearing graphs because it has no assignments. Draft.4, delivered in Steps 4/5, permits typed linear computations that initialize locals and outputs. Draft.5 adds acyclic branches and direct joins with all-path initialization. Next: Step 7 loop design.

## Joint Step 4/5 delivery

[Expressions](iterations/004-expressions.md) and [assignment](iterations/005-assignment.md) were implemented together as draft.4 with separate acceptance records and a shared verified completion milestone. Assignment supplies a useful expression consumer without a temporary container, preserving the dependency order. The accepted design uses matching types, one update per node, pure expressions, linear graphs, explicit initialization and bounded validator resources. Branches/joins were added subsequently in draft.5; loops/calls remain unsupported. No execution engine or adapter was introduced.

## Step 6 delivery

The approved [decision-complete implementation plan](iterations/006-implementation-plan.md) is implemented and [ITER-006](iterations/006-branches.md) is verified. Draft.5 adds Boolean conditions, true/false labels, direct joins (including same-target outcomes), arbitrary reachable DAGs, all-predecessor initialization intersection and path-local recovery. Iterative graph/bitset analysis has explicit validator resource limits. Specification, schema, validator, 531 added conformance cases, three new examples and documentation agree; all prior drafts remain supported unchanged.

The [native-target review](reviews/006-outsystems-server-action-fidelity.md) includes observed validation of three manual positive branch translations and an intentionally negative one-arm output translation. The simplified optional fixture remains valid in draft.4. Native IDs/payloads stay local, same-target coverage is synthetic, and no implicit defaults or flow repairs were inserted. Runtime equivalence and a production importer remain future work.

Step 7 begins with design, especially collection dependencies, iteration scope/order, legal cycles/exits and extending conservative initialization/recovery. Do not enable arbitrary cycles in the existing acyclic version.
