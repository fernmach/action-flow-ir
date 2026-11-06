# Current status

Updated: 2026-11-06

## Completed

- Exploration, repository instructions, workflow, roadmap, and templates.
- Accepted stack in [ADR-001](../decisions/001-implementation-stack.md) and conventions in [ADR-002](../decisions/002-tooling-contract.md).
- [Step 0](iterations/000-tooling-foundation.md): NodeNext build, CLI skeleton, JSON parsing/diagnostics, Ajv integration test, Vitest harness, Docusaurus integration, Windows/Linux CI configuration.
- Git initialized; the user created initial commit `3ff8434` after Step 0.
- [Type-aware linting follow-up](iterations/000a-eslint.md): ESLint/typescript-eslint configuration and aggregate check integration.
- [Formatting follow-up](iterations/000b-formatting.md): default Prettier and selected braces/blank-line readability rules.

## Current iteration

Step 0 complete locally. Step 1 not started. No IR schema, supported IR version, actual IR conformance corpus, semantic passes, adapters, or released language specification exists yet. The CLI explicitly returns a tool error for every parseable JSON input until Step 1.

## Agreed direction

- Typed, language-independent Action-Flow IR, initially focused on OutSystems server actions.
- Explicit nodes/connections, typed expressions, stable IDs and source traceability.
- Complete increments across specification, schema, validator, tests, examples, and documentation.
- TypeScript/Node.js, Ajv, custom semantic passes, Vitest, Docusaurus.
- Node 24.22.1 and Bun 1.4.4; root and website dependencies locked separately.
- ESLint 10.14.0, typescript-eslint 8.72.1, root TypeScript 6.0.2; see [ADR-003](../decisions/003-type-aware-linting.md).

## Pending decisions

| Topic                                                                    | Needed by                           |
| ------------------------------------------------------------------------ | ----------------------------------- |
| Envelope fields, IR version syntax, supported-version policy, schema IDs | Step 1                              |
| Type/default/null/numeric semantics                                      | Steps 3–5                           |
| Cycles, loops, calls and failure behavior                                | Steps 7–8                           |
| Hosting URL, remote repository, hosted CI execution                      | When connecting a remote/publishing |

## Next action

Open a Step 1 feature record. Define the envelope and version policy, then deliver normative rules, versioned Draft 2020-12 schema, validation, real conformance fixtures, examples, and documentation together. Do not infer fields from exploratory examples.

## Verification

Aggregate checks passed locally on Windows after default formatting and readability configuration: Prettier check, zero lint warnings/errors, 24 tests across five files, root/website type checks, Node emit, production documentation build. Both frozen installs passed. Readability probes verified braces/padding enforcement and compatibility with default Prettier; fixture text remains unchanged. Hosted CI/Linux execution has not been observed in this increment. See iteration and command registry for verification scope.
