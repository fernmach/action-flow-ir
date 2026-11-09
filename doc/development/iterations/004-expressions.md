# ITER-004: Expressions

Status: complete
Date: 2026-11-09
Roadmap step: 4
Target IR version: 0.1.0-draft.4 (joint delivery)

## Purpose and scope

Implement the user-approved joint Step 4/5 plan with separate acceptance records. Inline expression trees, exact literal encoding, action-scoped references, iterative type inference, conservative read checks and pre-schema resource protection. Depend on Step 3 and the [other joint iteration](005-assignment.md). Preserve drafts 1–3. Branches, merges, loops, calls, optional/defaulted inputs, conversions, division, adapters, execution and publication are excluded.

## Acceptance criteria

Every expression form, primitive and operator signature validates with strict shape and exact types. References resolve by action-local ID. Invalid operands suppress dependent cascades while independent checks continue. Literal spelling is preserved; Text rejects unpaired surrogates. Resource limits classify excess as tool-error, not invalidity.

The complete joint example initializes Decimal Rate, computes Total × Rate and assigns Decimal Discount. All earlier conformance cases/examples remain regressions; specification, schema, diagnostics and docs must agree. Planning alone is not completion.

## Design

Accepted via the user's explicit joint implementation request; [ADR-005](../../decisions/005-expressions-and-assignment.md) records rationale. The [normative chapter](../../spec/expressions.md) adopts EXP-001 through EXP-008. No unresolved design choice remains in the approved scope. Numeric/assignment types match exactly, expression meaning is pure and left-to-right, Boolean evaluation short-circuits but static reads inspect both operands. Locals/outputs begin uninitialized; inputs begin initialized/read-only.

Only the new version changes graph and completion behavior. Conditional schema branches select the applicable shape; draft.4 filters redundant if wrappers. Limits are 128 container levels and 100,000 containers, checked before schema validation. Graph and semantic traversals are iterative. No evaluator, numeric library, coercion or normalization is introduced.

## Deliverables

| Deliverable                         | Paths                                                  | Required changes or reason not applicable                   | Completion evidence                              |
| ----------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------ |
| Normative specification             | doc/spec/expressions.md                                | EXP-001 through EXP-008                                     | Implemented; aggregate checks passed             |
| JSON Schema                         | schema/0.1.0-draft.4/                                  | Strict conditional recursive expression/assignment contract | All four schemas meta-validate; aggregate passes |
| Reference validator                 | src/validator/                                         | Version-specific expression/assignment/flow/resource passes | Unit/corpus/CLI checks and aggregate pass        |
| Conformance suite                   | tests/conformance/computation/                         | 472 new cases, 310 inherited and 162 new computation cases  | 1,030 total cases pass in focused suite          |
| Runnable examples                   | examples/calculate-discount.json                       | Complete typed linear output-producing calculation          | Focused examples pass                            |
| Explanatory/reference documentation | doc/guide/computation.md, doc/reference/computation.md | Literal, operator, assignment, recovery and limit guidance  | Production documentation/link build passes       |
| Adapters and execution              | Not applicable                                         | Explicitly excluded                                         | No adapter or engine introduced                  |

## Rule traceability

The normative chapter maps EXP-001 through EXP-008 to schema/pass enforcement, stable codes and computation case prefixes. Joint unit/CLI tests cover resource boundaries, preservation, ordering, version isolation and all four schema startup failures. Mathematical evaluation semantics are specified without claiming runtime execution tests. Prior conformance cases are retained unchanged except the unsupported version probe; its draft.4 declaration now probes draft.5.

## Implementation tasks

- [x] Finalize rules and decisions from the approved plan.
- [x] Author independent acceptance fixtures and expectations.
- [x] Implement specification/schema/validator/conformance/examples/docs.
- [x] Verify and reconcile the complete increment.
- [x] Update status and handoff.

## Verification results

Commands ran from `C:\Projects\action-flow-ir`, prepending the installed Node 24.22.1 directory to PATH as in Step 3. Bun is 1.4.4. No dependency/lockfile changes.

| Command                                                             | Actual result                                                                    | Limitations                                                                                                                                                                                           |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bun run build                                                       | Initial run found two TypeScript errors; corrected, then passed                  | Use ES2022-compatible Unicode regex instead of newer string API; capture version before Ajv type narrowing                                                                                            |
| bun run test:conformance                                            | Initial 1,017/1,018 passed; corrected new-version expectation, then 1,018 passed | assign is newly supported, so an inherited draft.4 shape case needs missing assignment-field diagnostics instead of unknown-kind diagnostics; earlier-version case unchanged                          |
| bun run lint:fix                                                    | Passed; reviewed statement-spacing fixes                                         | Before formatting                                                                                                                                                                                     |
| bun run build and bun run test                                      | Passed: 1,089 tests across 13 files, including 1,030 conformance cases           | Focused run before separating the expanded CLI capability checks                                                                                                                                      |
| bun run check (first aggregate run)                                 | 1,088 tests passed; one compiled CLI test timed out at 5 seconds                 | Split new draft.4 CLI checks into a separate focused test without changing assertions or global timeouts                                                                                              |
| bun run lint:fix followed by bun run format                         | Passed; reviewed changes                                                         | Default formatting only; existing discovery-note content preserved and formatted to satisfy the root check                                                                                            |
| bun run check (final aggregate run)                                 | Passed: 1,090 tests across 13 files, including 1,030 conformance cases           | Five schema checks cover four bundled schemas; nine example checks cover eight examples plus presence guard; root/website types, Node build, lint, formatting and production docs/link build all pass |
| git diff --check                                                    | Passed                                                                           | Earlier schemas and both lockfiles reviewed unchanged                                                                                                                                                 |
| bun run format:check and bun run docs:build (after handoff updates) | Passed                                                                           | Final documentation consistency/format verification; no additional source changes                                                                                                                     |

The production documentation build emits the existing nonfatal Docusaurus update-notifier config-store notice. Hosted CI/Linux execution is not observed. No checks are claimed for runtime evaluation. Resource boundaries are covered by unit/CLI tests, including valid depth 128 and total containers 100,000, excess limits and pre-schema malformed documents.

## Completion and handoff

The approved increment is complete locally; all applicable deliverables agree and required checks pass. Both iteration records close at this shared milestone. Draft.4 supports typed output-producing linear computation; earlier drafts retain their exact structural and semantic behavior. The new corpus adds 472 cases (310 inherited and 162 new computation cases), while the original 558 cases remain regressions. Only the unsupported-version probe changes to draft.5. No unresolved decision blocks this supported scope.

Next: Step 6 branches, including precise connection labels, merge/initialization rules and conservative flow checks before acceptance. Real OutSystems fidelity validation remains required before broad expansion; no private action was accessed in this task. Adapters, execution, publishing and unsupported future features remain excluded.
