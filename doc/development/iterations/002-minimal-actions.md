# ITER-002: Minimal actions and connections

Status: complete
Date: 2026-11-06
Roadmap step: 2
Target IR version: 0.1.0-draft.2

## Purpose and scope

Implement the user-approved Step 2 plan: strict action graphs with start/end nodes, explicit entry and endpoint-only connections. Preserve draft.1. Variables, operations, execution, adapters, publishing and commits are excluded.

## Acceptance criteria

Both drafts validate by exact version. Draft.2 supports empty action collections and multiple independent minimal actions. Identity, references, cardinalities and reachability follow ACT-001 through ACT-009, with precisely staged diagnostics. Schema, corpus, examples and documentation agree; all aggregate checks pass.

## Design

Required action fields: id, entryNodeId, nodes, connections. Nodes have id/kind; connections have fromNodeId/toNodeId. Exactly one start and one end; no connection IDs. Strings inherit document ID constraints; identities are exact and scoped. The accepted plan resolves all scope decisions. Start marks entry and end normal completion, without introducing execution. Draft.1 remains immutable; draft.2 uses its own Draft 2020-12 schema and URN. See the normative actions chapter for rules and diagnostic staging.

## Deliverables

| Deliverable                         | Paths                                                     | Change and completion evidence                                                                                    |
| ----------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Normative specification             | doc/spec/actions.md                                       | ACT-001 through ACT-009, precise diagnostics and prerequisites; inherited envelope scope clarified                |
| JSON Schema                         | schema/0.1.0-draft.2/action-flow.schema.json              | Independent strict Draft 2020-12 schema; both schemas compiled/meta-validated                                     |
| Reference validator                 | src/validator/schema.ts, index.ts, actions.ts             | Exact registry dispatch, scoped indexes, iterative traversal, normalized diagnostics; unit/corpus/CLI checks pass |
| Conformance suite                   | tests/conformance/actions/                                | 162 new cases, including inherited envelope boundaries; all 246 corpus cases pass                                 |
| Runnable examples                   | examples/minimal-action.json, multiple-actions.json       | Both validate automatically along with four retained draft.1 examples                                             |
| Explanatory/reference documentation | doc/reference/actions.md, doc/tutorials/minimal-action.md | Field/diagnostic reference, tutorial and supported-version updates; production site/link build passes             |
| Adapters and execution              | Not applicable                                            | Explicitly excluded; no importer, execution engine or generator                                                   |

## Rule traceability

The [normative traceability table](../../spec/actions.md#traceability) links ACT-001 through ACT-009 to structural or semantic enforcement, diagnostics, and positive/negative/boundary cases. Inherited envelope requirements are re-exercised by inherited-* cases under draft.2, with the original draft.1 corpus retained. Direct tests cover nonmutation, property/declaration order, mixed version dispatch, deterministic semantic ordering, both-schema initialization failures and compiled CLI behavior outside the repository working directory.

## Implementation tasks

- [x] Finalize rules and relevant decisions from the approved plan.
- [x] Define independent acceptance fixtures and expectations.
- [x] Implement applicable deliverables.
- [x] Verify and reconcile artifacts.
- [x] Update status and handoff.

## Verification results

Commands ran in `C:\Projects\action-flow-ir` with installed Bun 1.4.4 added to PATH using `$env:PATH = "$env:USERPROFILE\.bun\bin;$env:PATH"`. No dependency upgrades or lockfile changes.

| Exact command                               | Actual result                                   | Limitations                                                                                                            |
| ------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| bun install --frozen-lockfile               | Passed, no changes                              | Root dependencies                                                                                                      |
| bun install --cwd website --frozen-lockfile | Passed, no changes                              | Website dependencies                                                                                                   |
| bun run lint:fix                            | Passed; reviewed readability fixes              | Deliberate automatic corrections before formatting                                                                     |
| bun run format                              | Passed; reviewed diff                           | Fixture directories excluded                                                                                           |
| bun run typecheck                           | Passed                                          | Root types                                                                                                             |
| bun run build                               | Passed                                          | NodeNext emit                                                                                                          |
| bun run test                                | First pass: 279 passed, 3 failed                | Fixture expectations corrected for new action fields and simultaneous type/enum failures, without weakening validation |
| bun run check                               | Passed after corrections: 287 tests in 11 files | Includes formatting, lint, root types/build/tests, website types and production documentation/link build               |
| bun run schema:check (through check)        | Passed: 3 checks                                | Both bundled Draft 2020-12 schemas                                                                                     |
| bun run test:conformance (through check)    | Passed: 246 cases                               | 84 original cases and 162 draft.2 cases                                                                                |
| bun run examples:check (through check)      | Passed: 7 checks                                | Six discovered examples plus required-example presence guard                                                           |

Production documentation build succeeds with a nonfatal Docusaurus update-notifier config-store notice. Hosted CI and Linux execution remain unobserved; local results do not claim either.

## Completion and handoff

All planned deliverables agree and local checks pass; no unresolved decision blocks this draft. The draft.1 schema and its accepted documents remain unchanged. Its formerly unsupported draft.2 fixture now uses unimplemented draft.3; missing envelope fields in draft.2 are structural errors. Exact version dispatch preserves package version 0.0.0, CLI streams and exits, and schema initialization failure classification.

The accepted plan fixed exactly one start/end, no connection IDs, scoped case-sensitive identities and explicit prerequisite suppression. Counts remain semantic even though they imply a two-node valid graph today. Cycles fail degree rules; iterative traversal terminates even for invalid cyclic input. No variable/type/execution semantics, adapters, publication or commit were introduced. Next: Step 3 variables and types under a new draft contract.
