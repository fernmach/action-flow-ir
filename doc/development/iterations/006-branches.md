# ITER-006: Branches and direct joins

Status: complete
Date: 2026-11-09
Roadmap step: 6, with applicable Step 9 flow analysis
Target IR version: 0.1.0-draft.5

## Purpose and scope

Deliver Boolean control transfer, direct joins and definite initialization over finite DAGs. The user approved the remaining semantics and authorized the [decision-complete implementation plan](006-implementation-plan.md) followed by implementation. [ADR-006](../../decisions/006-branches-and-definite-initialization.md) records the choices; [BRN-001–008](../../spec/branches.md) are the enduring contract.

Include strict branch/condition nodes, labeled true/false outcomes, arbitrary acyclic direct joins, all-predecessor initialization intersection, path-local recovery, independent diagnostics and bounded iterative analysis. Preserve all four earlier drafts and their regression cases. Exclude loops, calls, optional/defaulted inputs, new expression operators, adapters, native-default lowering and execution. Existing discovery notes and the ignored native evidence remain intact.

## Acceptance criteria

- All five exact versions load independent schemas; earlier structural/semantic diagnostics and package/CLI contracts remain unchanged.
- Conditions require Boolean; labels are source-kind-aware, one per outcome; same-target outcomes remain distinct edges. Direct assignment/branch/end joins and crossing/nested DAGs validate.
- Require one start/end, specified degrees, resolved identities/endpoints, reachability and whole-graph acyclicity. Report cycles once per action after prerequisites, independently of degree/reachability.
- Read/write analysis follows connections, intersects all predecessor states and checks both outcomes even for constants. Invalid paths taint their successors; unaffected paths and independent reference/type checks continue. Missing outputs are reported only with reliable completion state.
- Strict malformed shapes, scope/type/reference errors, staging, nonmutation, deterministic diagnostics, resource boundaries, compiled CLI streams/exits and five schema startup failures are covered.
- Reviewed native branch mappings have observed static validation outcomes without defaults or flow repair; no runtime-equivalence claim is made.
- Specification, schema, validator, corpus, examples and docs agree; required checks pass before completion.

## Design

Branch nodes contain exactly id, kind and condition. Only branch connections carry true/false string labels. Edge identity is the ordered endpoint/outcome triple, with absence distinct from either label. Joins need no explicit merge node or paired region. See BRN-001–004 for full representation, degrees and graph staging.

Each reliable initialized state is a variable-indexed bitset. Kahn ordering and iterative reachability avoid recursion/path enumeration. Start initializes inputs; other nodes intersect incoming state. Assignment updates only after successful independent/read checks; branch preserves state. Any unreliable predecessor taints convergence. BRN-005–007 specify conservative static checks and diagnostic suppression precisely.

Resource policy inherits the draft.4 pre-schema 128-level/100,000-container guard. Draft.5 adds a post-schema, pre-semantics inclusive 5,000,000 word-unit estimate; excess returns AFIR-LIMIT-002, tool-error/exit 2. BRN-008 specifies accounting. These are validator limits, not language/numeric restrictions.

Migration is explicit: select draft.5 and use its branch/label contract when needed. Validation never migrates or inserts defaults. Draft.4 linear actions with unchanged fields remain representable in draft.5. Execution semantics retain pure, exact expressions and pre-assignment updates; only the chosen branch outcome transfers control conceptually. Validation never executes or prunes conditions. No blocking design questions remain.

## Deliverables

| Deliverable                | Paths                                                                                            | Changes                                                                                             | Evidence                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Normative specification    | doc/spec/branches.md; inherited chapter links                                                    | BRN-001–008, version-qualified extensions                                                           | Rule/diagnostic traceability below                                                       |
| JSON Schema                | schema/0.1.0-draft.5/action-flow.schema.json                                                     | Independent bundled Draft 2020-12 schema; closed conditional shapes                                 | Five-schema meta-validation and structural corpus                                        |
| Reference validator        | src/validator/branches.ts, limits.ts, index.ts, schema.ts, diagnostics.ts                        | Version-specific graph/bitset analysis; shared unchanged semantic normalizer; isolated budget       | Unit/conformance/compiled CLI tests                                                      |
| Conformance suite          | tests/conformance/branches/                                                                      | 531 paired additions: 59 dedicated branch cases plus 472 reviewed inherited computation regressions | 1,561 total paired cases                                                                 |
| Runnable examples          | examples/conditional-discount.json, branch-rate.json, nested-branches.json                       | Generic conditional discount, both-arm local write/join, nested branch/end joins                    | Eleven required examples validated                                                       |
| Explanatory/reference docs | doc/guide/branches.md; doc/reference/branches.md; related references, README, website navigation | Authoring/diagnostics/resources and five-version descriptions                                       | Website types and documentation/link build                                               |
| Native fidelity study      | ../reviews/006-outsystems-server-action-fidelity.md; ignored out evidence                        | Four additional manual draft.5 mappings, source association review and captured CLI results         | Three positives, one expected initialization failure; original fifteen digests preserved |
| Adapters / execution       | Not applicable                                                                                   | Explicitly excluded; no importer/default lowering or execution engine                               | No such deliverables introduced                                                          |

## Rule traceability

Case IDs below refer to tests/conformance/branches; prefixes denote all matching cases. Existing paired expectations were retained; inherited draft.5 cases were specified before implementation, with changes only where the expanded graph contract requires them.

| Rule                                                             | Enforcement                                                     | Diagnostics                                            | Positive / negative / boundary evidence                                                                                  |
| ---------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [BRN-001](../../spec/branches.md#representation-and-graph-rules) | Independent schema, kind/type conditional shapes                | AFIR-SCHEMA-001                                        | shape-_, inherited-_; all three public examples                                                                          |
| BRN-002                                                          | Existing expression analysis, exact condition result check      | AFIR-BRANCH-001; AFIR-REF/TYPE/LITERAL/INIT codes      | constant-true/false; condition-*; short-circuit-condition-read                                                           |
| BRN-003                                                          | Endpoint/outcome triple index, source-kind labels/outcome index | AFIR-BRANCH-002–005; AFIR-FLOW-004/005                 | same-target/end; label-*; edge-duplicate-triple; edge-unresolved-target                                                  |
| BRN-004                                                          | Degree/reachability and iterative topological analysis          | Existing graph/identity/reference codes; AFIR-FLOW-008 | join-_, nested public example, crossing, reordered; graph-_                                                              |
| BRN-005                                                          | Bitset predecessor intersection and successful writes           | AFIR-INIT-001/002                                      | initialize-_; completion-_; constant-does-not-prune; join-read-only-one-arm; bit31/32 unit case                          |
| BRN-006                                                          | Explicit unreliable state and independent analysis              | Existing scope/type/read diagnostics                   | recovery-_; scope-_; independent-actions; combined-duplicate-action                                                      |
| BRN-007                                                          | Structural gate, graph prerequisites, common sorting/dedup      | Existing structural/semantic contract                  | combined-graph-condition; inherited-*; order/preservation/schema unit cases                                              |
| BRN-008                                                          | Pre-schema containers; schema-success word estimate             | AFIR-LIMIT-001/002 (tool-error)                        | Exact 5m-word valid DAG; excess before semantics; schema/container priority; deep branch 128/129 levels; CLI limit exit2 |

Evaluation-only aspects (actual value computation, exact target runtime behavior and short-circuit execution) are specified but not dynamically enforced; no interpreter is part of this increment.

## Implementation tasks

- [x] Finalize rules and ADR-006 / decision-complete plan.
- [x] Define independent acceptance fixtures and expectations.
- [x] Implement specification, schema, validator, corpus, examples and docs.
- [x] Review local native mappings without changing the raw captures.
- [x] Finish aggregate verification and reconciliation.
- [x] Update status and handoff.

## Verification results

All commands run from C:\Projects\action-flow-ir. Node 24.22.1 was prepended to PATH from its installed nvm directory for shell scripts, as in previous iterations. No dependencies or lockfiles changed.

| Exact command / check                                                            | Actual result                                                                                                                                              | Limitations                                                                                                              |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| bun run build; bun run test (initial implementation)                             | Passed: 1,636 tests / 14 files, including 1,561 conformance cases                                                                                          | Before the additional draft.5 depth-boundary unit case                                                                   |
| bun run lint:fix                                                                 | Passed; automatic fixes reviewed                                                                                                                           | Statement padding fixes; no global rule suppression                                                                      |
| bun run format                                                                   | Initial attempt hit the existing broken Node shim; rerun with installed Node on PATH passed                                                                | No raw/ignored fixtures formatted                                                                                        |
| bun run check (initial aggregate)                                                | Formatting/lint/types/build, 1,637 tests / 14 files, five schemas, 1,561 conformance and eleven examples passed; docs generation hit Windows sandbox EPERM | Failure creating generated website output; no validator/test failure                                                     |
| bun run docs:build (outside sandbox after EPERM)                                 | Passed: production generation and link checks                                                                                                              | No publication; local build only                                                                                         |
| bun run check (final aggregate rerun)                                            | Passed: all registered stages                                                                                                                              | Hosted CI/Linux execution remains unobserved                                                                             |
| Compiled CLI: node dist/cli/main.js validate &lt;local mapping&gt; --format json | Three branch mappings valid/exit0; one-arm negative exit1 with exactly AFIR-INIT-001                                                                       | Exact paths/arguments/results retained in ignored draft5-validation-results.json; manual mappings, no runtime evaluation |
| SHA-256 evidence check via bun run -                                             | Fifteen original raw/native/supplementary digests match; derived mappings/results added to ignored manifest                                                | Local sequential source capture, not a refreshed native observation                                                      |

Final review: git diff --check passed; earlier schemas and both lockfiles have no diff. A relative-link check resolved 41 development-document targets. Post-format evidence checks reconfirmed all 15 original and 10 derived digests. The final documentation build emitted only the existing nonfatal update-notifier config-store notice.

## Completion and handoff

All applicable deliverables and required checks are complete locally. Draft.5 static validation is implemented with prior versions preserved. The first usable static-validation milestone includes generic CalculateDiscount with conditional flow and the reviewed native branch mappings. Native implicit defaults, numeric/runtime equivalence, an adapter and live execution remain unverified or out of scope. Same-target outcomes have synthetic core coverage because the tested Model API creation route rejected that fixture.

Next executable increment after verified completion: Step 7 loop design, including iteration representation, collection dependencies, scope/order, termination/exits and extending conservative flow analysis. No loop implementation is authorized by this record.
