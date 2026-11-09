# Current status

Updated: 2026-11-09

## Completed

- Exploration, repository instructions, workflow, roadmap, and templates.
- Accepted stack in [ADR-001](../decisions/001-implementation-stack.md) and conventions in [ADR-002](../decisions/002-tooling-contract.md).
- [Step 0](iterations/000-tooling-foundation.md): NodeNext build, CLI skeleton, JSON parsing/diagnostics, Ajv integration test, Vitest harness, Docusaurus integration, Windows/Linux CI configuration.
- Git initialized; the user created initial commit `3ff8434` after Step 0.
- [Type-aware linting follow-up](iterations/000a-eslint.md): ESLint/typescript-eslint configuration and aggregate check integration.
- [Formatting follow-up](iterations/000b-formatting.md): default Prettier and selected braces/blank-line readability rules.
- [Step 1](iterations/001-document-envelope.md): normative envelope, Draft 2020-12 schema, exact version dispatch, deterministic diagnostics, recursive conformance corpus, four examples and CLI tutorial.
- [Step 2](iterations/002-minimal-actions.md): draft.2 minimal actions, scoped identity/reference checks, degree/reachability checks, semantic diagnostics, examples and tutorial; draft.1 remains supported.
- [Authoring guide follow-up](iterations/002a-authoring-guide.md): example-led draft.2 guide, separate language/field/CLI navigation and homepage entry points. Developer documentation remains GitHub-only; language and validator contracts are unchanged.
- [Step 3](iterations/003-variables-and-types.md): draft.3 typed inputs, outputs and locals; four non-nullable primitive domains, action-wide variable identities/names, and output-initialization checks. Earlier drafts remain unchanged.
- [Steps 4 and 5](iterations/004-expressions.md): joint draft.4 expressions and [assignment](iterations/005-assignment.md), exact typing, graph-order initialization, output completion and pre-schema resource protection; all prior drafts preserved.

- [Step 6](iterations/006-branches.md): draft.5 Boolean branches, labeled outcomes, direct DAG joins, definite initialization by predecessor intersection, path-local recovery and bounded iterative analysis; all prior drafts preserved.

## Current iteration

Step 6 is complete locally as **0.1.0-draft.5** under the approved [implementation plan](iterations/006-implementation-plan.md) and [ADR-006](../decisions/006-branches-and-definite-initialization.md). All five exact formats remain supported: empty envelope, minimal actions, typed declarations, linear computation and acyclic branches/joins. Drafts 1–4 retain their semantics and schemas. Validation checks all incoming paths without executing conditions and distinguishes validator resource limits from invalid input. No release was published.

The first usable **static-validation milestone** is complete: typed CalculateDiscount with assignments/conditional flow, CLI text/JSON diagnostics and full specification/schema/conformance/docs coverage. The [native Server Action fidelity review](reviews/006-outsystems-server-action-fidelity.md) now includes three observed valid manual draft.5 branch mappings and the expected one-arm output-initialization failure. The simplified linear mapping remains valid in draft.4. All fifteen original evidence digests match; raw JSON/native identities stay ignored. This does not prove runtime equivalence or resolve native implicit defaults.

## Agreed direction

- Typed, language-independent Action-Flow IR, initially focused on OutSystems server actions.
- Explicit nodes/connections, typed expressions, stable IDs and source traceability.
- Complete increments across specification, schema, validator, tests, examples, and documentation.
- TypeScript/Node.js, Ajv, custom semantic passes, Vitest, Docusaurus.
- Node 24.22.1 and Bun 1.4.4; root and website dependencies locked separately.
- ESLint 10.14.0, typescript-eslint 8.72.1, root TypeScript 6.0.2; see [ADR-003](../decisions/003-type-aware-linting.md).

## Pending decisions

| Topic                                               | Needed by                           |
| --------------------------------------------------- | ----------------------------------- |
| Cycles, loops, calls and failure behavior           | Steps 7–8                           |
| Hosting URL, remote repository, hosted CI execution | When connecting a remote/publishing |

## Next action

Design Step 7 loops: select the iteration/collection representation, variable scope and order, exits/termination, and initialization/recovery analysis. Use explicit new versioning; preserve all five existing contracts. Native default lowering, adapters, numeric/runtime equivalence and live execution require separate scope.

## Verification

Step 6 verification covers formatting, zero lint warnings/errors, root/website types, Node build, **1,637 tests across 14 files** (including **1,561 conformance cases**), all five schemas, eleven examples and production documentation/link build. The initial aggregate attempt reached the final docs stage and hit Windows sandbox EPERM creating generated output; the documentation build passed when rerun outside the sandbox. The final aggregate rerun and exact outcomes are recorded in [ITER-006](iterations/006-branches.md). Earlier schemas and both lockfiles remain unchanged. Hosted CI/Linux execution and runtime target behavior remain unobserved.
