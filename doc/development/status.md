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

## Current iteration

Steps 4 and 5 complete locally as **0.1.0-draft.4**: strict typed expression trees, one assignment per node, exact matching types, pure evaluation semantics and finite linear graphs with read/output initialization checks. Supported formats draft.1 (empty envelope), draft.2 (minimal actions) and draft.3 (typed declarations) remain unchanged. All support optional provenance. Draft.4 limits resource excess to tool-error status; validation never executes actions. Branches, loops, calls, adapters and execution remain future work. No release was published.

## Agreed direction

- Typed, language-independent Action-Flow IR, initially focused on OutSystems server actions.
- Explicit nodes/connections, typed expressions, stable IDs and source traceability.
- Complete increments across specification, schema, validator, tests, examples, and documentation.
- TypeScript/Node.js, Ajv, custom semantic passes, Vitest, Docusaurus.
- Node 24.22.1 and Bun 1.4.4; root and website dependencies locked separately.
- ESLint 10.14.0, typescript-eslint 8.72.1, root TypeScript 6.0.2; see [ADR-003](../decisions/003-type-aware-linting.md).

## Pending decisions

| Topic                                                      | Needed by                           |
| ---------------------------------------------------------- | ----------------------------------- |
| Branch labels, merge semantics and definite initialization | Step 6                              |
| Cycles, loops, calls and failure behavior                  | Steps 7–8                           |
| Hosting URL, remote repository, hosted CI execution        | When connecting a remote/publishing |

## Next action

Open Step 6 branches: Boolean conditions, labeled connections, branch coverage/uniqueness, merges and definite initialization. Preserve all four existing draft contracts; public extensions require a new draft. Validate against an authorized real OutSystems action before broad expansion, recording fidelity gaps without importing private content into public examples.

## Verification

Final `bun run check` passed locally on Windows: formatting, zero lint warnings/errors, root/website types, Node build, 1,090 tests across 13 files (including 1,030 conformance cases), all four schemas, eight examples and production documentation/link build. Earlier schemas and both lockfiles remain unchanged. See the Step 4/5 records for exact commands, initial corrected failures and the runtime PATH setup. Hosted CI/Linux execution remains unobserved.
