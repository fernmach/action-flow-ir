# Current status

Updated: 2026-11-06

## Completed

- Exploration, repository instructions, workflow, roadmap, and templates.
- Accepted stack in [ADR-001](../decisions/001-implementation-stack.md) and conventions in [ADR-002](../decisions/002-tooling-contract.md).
- [Step 0](iterations/000-tooling-foundation.md): NodeNext build, CLI skeleton, JSON parsing/diagnostics, Ajv integration test, Vitest harness, Docusaurus integration, Windows/Linux CI configuration.
- Git initialized; the user created initial commit `3ff8434` after Step 0.
- [Type-aware linting follow-up](iterations/000a-eslint.md): ESLint/typescript-eslint configuration and aggregate check integration.
- [Formatting follow-up](iterations/000b-formatting.md): default Prettier and selected braces/blank-line readability rules.
- [Step 1](iterations/001-document-envelope.md): normative envelope, Draft 2020-12 schema, exact version dispatch, deterministic diagnostics, recursive conformance corpus, four examples and CLI tutorial.
- [Step 2](iterations/002-minimal-actions.md): draft.2 minimal actions, scoped identity/reference checks, degree/reachability checks, semantic diagnostics, examples and tutorial; draft.1 remains supported.

## Current iteration

Step 2 complete locally. Supported formats: **0.1.0-draft.1** (unchanged empty envelope) and **0.1.0-draft.2** (minimal start/end action graphs). Both support optional provenance. Structural validation precedes scoped identity, reference and graph checks. Malformed declarations are invalid; well-formed unsupported versions are tool errors. Variables, operations, adapters and execution remain future work. No release was published.

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
| Type/default/null/numeric semantics                 | Steps 3–5                           |
| Cycles, loops, calls and failure behavior           | Steps 7–8                           |
| Hosting URL, remote repository, hosted CI execution | When connecting a remote/publishing |

## Next action

Open Step 3 to specify variables and types: inputs, outputs, locals, primitive types, naming, scope and initialization. Preserve both existing draft contracts; public extensions need a new draft version.

## Verification

Both frozen installs and aggregate checks passed locally on Windows: formatting, zero lint warnings/errors, root/website type checks, Node emit, 287 tests across 11 files (including 246 conformance cases), both schemas, six examples and production documentation/link build. See the Step 2 iteration record for exact commands. Hosted CI/Linux execution has not been observed.
