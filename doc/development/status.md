# Current status

Updated: 2026-11-06

## Completed

- Exploration, repository instructions, workflow, roadmap, and templates.
- Accepted stack in [ADR-001](../decisions/001-implementation-stack.md) and conventions in [ADR-002](../decisions/002-tooling-contract.md).
- [Step 0](iterations/000-tooling-foundation.md): NodeNext build, CLI skeleton, JSON parsing/diagnostics, Ajv integration test, Vitest harness, Docusaurus integration, Windows/Linux CI configuration.
- Git initialized locally; lockfiles and package manifests staged. No commit or remote publication created.

## Current iteration

Step 0 complete locally. Step 1 not started. No IR schema, supported IR version, actual IR conformance corpus, semantic passes, adapters, or released language specification exists yet. The CLI explicitly returns a tool error for every parseable JSON input until Step 1.

## Agreed direction

- Typed, language-independent Action-Flow IR, initially focused on OutSystems server actions.
- Explicit nodes/connections, typed expressions, stable IDs and source traceability.
- Complete increments across specification, schema, validator, tests, examples, and documentation.
- TypeScript/Node.js, Ajv, custom semantic passes, Vitest, Docusaurus.
- Node 24.22.1 and Bun 1.4.4; root and website dependencies locked separately.

## Pending decisions

| Topic | Needed by |
|---|---|
| Envelope fields, IR version syntax, supported-version policy, schema IDs | Step 1 |
| Type/default/null/numeric semantics | Steps 3–5 |
| Cycles, loops, calls and failure behavior | Steps 7–8 |
| Hosting URL, remote repository, hosted CI execution | When connecting a remote/publishing |

## Next action

Open a Step 1 feature record. Define the envelope and version policy, then deliver normative rules, versioned Draft 2020-12 schema, validation, real conformance fixtures, examples, and documentation together. Do not infer fields from exploratory examples.

## Verification

Aggregate checks passed locally on Windows: 24 tests across five files, root/website type checks, Node emit, production documentation build. CI is configured but has not run on GitHub or Linux. See iteration and command registry for verification scope.
