# ITER-001: Document envelope and source provenance

Status: complete
Date: 2026-11-06
Roadmap step: 1
Target IR version: 0.1.0-draft.1

## Purpose and scope

Implement the first strict document envelope, optional self-reported provenance, exact version dispatch, schema diagnostics, corpus and examples. Actions, execution, adapters and generators are deferred.

## Acceptance criteria

Accept minimal and populated envelopes. Reject malformed input without mutation. Distinguish unsupported versions from invalid declarations. Deliver schema, normative rules, independent fixtures, examples, CLI checks and documentation together.

## Design

The supplied plan is accepted: exact immutable draft 0.1.0-draft.1, Draft 2020-12, urn:action-flow-ir:schema:0.1.0-draft.1, empty actions only, closed objects, omitted optional values, ECMAScript whitespace and extensible technology identifiers. Provenance is descriptive and never selects behavior. Package version remains 0.0.0. No open semantic questions. Execution semantics are not applicable to a container.

## Deliverables

| Deliverable                         | Paths                                                         | Required changes or reason not applicable                                   | Completion evidence                              |
| ----------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| Normative specification             | doc/spec/document-envelope.md                                 | ENV-001 through ENV-009, version/provenance policy                          | Rule-linked schema/corpus and regressions        |
| JSON Schema                         | schema/0.1.0-draft.1/action-flow.schema.json                  | Closed envelope, exact version, empty actions                               | Strict Draft 2020-12 compilation/meta-validation |
| Reference validator                 | src/validator/, src/cli/                                      | Root/version guards, bundled schema, normalized diagnostics, success output | Unit, corpus and compiled CLI tests              |
| Conformance suite                   | tests/conformance/, tests/harness/corpus.ts                   | Recursive paired discovery, unique IDs, nonempty corpus                     | 84 cases and harness failure regressions         |
| Runnable examples                   | examples/                                                     | Minimal, OutSystems, C#, JavaScript                                         | All four validated automatically                 |
| Explanatory/reference documentation | doc/reference/, doc/tutorials/, README.md, website/src/pages/ | Fields, diagnostics, CLI usage, supported version                           | Website type/link/production build               |
| Adapters                            | Not applicable                                                | Explicitly deferred; no source import or execution                          | No adapter implementation                        |

## Rule traceability

See the [enduring envelope chapter](../../spec/document-envelope.md#enforcement-and-conformance-traceability) for the complete rule-to-enforcement/case mapping. ENV-008 additionally has a direct nonmutation regression; ENV-009 has deterministic order, deduplication, pointer, startup-failure and working-directory regressions. Provenance truth and future version allocation are maintenance/producer obligations, not statically checkable document properties.

## Implementation tasks

- [x] Finalize rules and relevant decisions.
- [x] Define independent acceptance fixtures and expectations.
- [x] Implement applicable deliverables.
- [x] Verify and reconcile artifacts.
- [x] Update status and handoff.

## Verification results

All commands ran in `C:\Projects\action-flow-ir`. Bun was initially absent from the shell PATH; subsequent commands prepended `$env:USERPROFILE\.bun\bin` (installed Bun 1.4.4). No dependencies or locks changed.

| Exact command                               | Actual result                                                                                                                           | Limitations                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| bun install --frozen-lockfile               | Passed, no changes                                                                                                                      | Root dependencies                                          |
| bun install --cwd website --frozen-lockfile | Passed, no changes                                                                                                                      | Website dependencies                                       |
| bun run lint:fix                            | Passed; reviewed readability corrections                                                                                                | Deliberate automatic fixes before formatting               |
| bun run format                              | Passed; reviewed diff                                                                                                                   | Fixtures excluded                                          |
| bun run typecheck                           | Passed                                                                                                                                  | Root TypeScript                                            |
| bun run build                               | Passed                                                                                                                                  | NodeNext emitted CLI                                       |
| bun run test                                | Passed initially with 109 tests; aggregate expanded coverage below                                                                      | Existing tests retained with obsolete expectations updated |
| bun run check                               | Passed: formatting, lint, root types/build/tests, schema:check, test:conformance, examples:check, website types and documentation build | Windows local only; hosted CI unobserved                   |

The final aggregate includes 118 tests across 10 files, 84 corpus cases, two dedicated schema checks and five example checks (four files plus nonempty/exact-count guard). The documentation build succeeds; Docusaurus reports a nonfatal update-notifier config-store notice. No hosted or Linux result is claimed.

## Completion and handoff

All scoped deliverables agree and checks pass. No unresolved decision blocks the envelope. The implementation uses an absolute end-of-input guard after regex `$` so terminal newlines cannot bypass whole-string constraints. Initialization loads/compiles the bundled schema once relative to the module, outside per-document validation; dynamic CLI import ensures initialization failures are rendered as tool errors. Package version remains 0.0.0. The old AFIR-TOOL-003 code is retired and reserved, not repurposed.

The corpus expectations were authored independently of validator output. Invalid empty strings intentionally report both minLength and pattern failures with distinct explanatory messages; identical normalized diagnostics are removed. Explicit nulls, unknown fields and input data are never repaired.

No action objects, execution engine, reference/type/flow passes, importer, generator, publishing or Git commit was in scope. Next: open Step 2 and define minimal action/connection semantics under a new draft contract. Hosted CI remains unobserved.
