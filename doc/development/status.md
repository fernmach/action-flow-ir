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

## Current iteration

Step 3 complete locally. Supported formats: **0.1.0-draft.1** (unchanged empty envelope), **0.1.0-draft.2** (unchanged minimal start/end action graphs) and **0.1.0-draft.3** (typed declarations). All support optional provenance. Structural validation precedes independent graph/declaration checks; output checks require valid local prerequisites. Outputs and locals start uninitialized; no current node can initialize an output, so eligible output-bearing actions are invalid. Expressions, assignments, adapters and execution remain future work. No release was published.

## Agreed direction

- Typed, language-independent Action-Flow IR, initially focused on OutSystems server actions.
- Explicit nodes/connections, typed expressions, stable IDs and source traceability.
- Complete increments across specification, schema, validator, tests, examples, and documentation.
- TypeScript/Node.js, Ajv, custom semantic passes, Vitest, Docusaurus.
- Node 24.22.1 and Bun 1.4.4; root and website dependencies locked separately.
- ESLint 10.14.0, typescript-eslint 8.72.1, root TypeScript 6.0.2; see [ADR-003](../decisions/003-type-aware-linting.md).

## Pending decisions

| Topic                                                       | Needed by                           |
| ----------------------------------------------------------- | ----------------------------------- |
| Literal encoding, numeric operators and read initialization | Steps 4–5                           |
| Cycles, loops, calls and failure behavior                   | Steps 7–8                           |
| Hosting URL, remote repository, hosted CI execution         | When connecting a remote/publishing |

## Next action

Open Step 4 expressions: typed literals and ID references, a small operator set, exact numeric/literal representation, evaluation rules and read-before-initialization checks. Preserve all three existing draft contracts; public extensions need a new draft version.

## Verification

Step 3 checks passed locally on Windows: formatting, zero lint warnings/errors, root/website type checks, Node emit, 606 tests across 12 files (including 558 conformance cases), all three schemas and seven examples. The final `bun run check` passed, including production documentation/link generation. An initial sandbox mkdir failure was resolved; see the iteration record. No dependency or lockfile changes. See the Step 3 iteration record for exact commands and the runtime PATH workaround. Hosted CI/Linux execution has not been observed.
