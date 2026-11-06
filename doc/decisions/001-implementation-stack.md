# ADR-001: Implementation stack

Status: accepted
Date: 2026-11-06
Related iteration: [Step 0 — tooling foundation](../development/iterations/000-tooling-foundation.md)
Supersedes / superseded by: none

## Context

The project needs a versioned structural contract, semantic validation, implementation-independent conformance cases, CLI tooling, and documentation developed together. The exploration compared TypeScript, C#/.NET, and Python. A future browser-based viewer or validator is a possible extension, not a current deliverable.

## Options

- TypeScript/Node.js with Ajv, custom semantic passes, Vitest, and Docusaurus: supports a shared TypeScript toolchain and potential reuse of validation in browser tooling.
- C#/.NET with JsonSchema.Net and xUnit: an alternative suited to C# integration.
- Python with jsonschema and pytest: an alternative suited to exploratory implementation.

## Decision

Use the following stack, explicitly selected by the user in this chat:

| Component                         | Responsibility                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------- |
| TypeScript                        | Validator, semantic passes, CLI, and test implementation                                  |
| Node.js                           | Runtime and development tooling                                                           |
| Ajv                               | JSON Schema structural validation                                                         |
| Custom TypeScript semantic passes | References, types, flow/data-flow analysis, and optional target checks as features arrive |
| Vitest                            | Automated implementation tests and the conformance harness                                |
| Docusaurus                        | Documentation site for specification, reference, and guides                               |

The published schema remains the structural contract and normative prose defines semantics. TypeScript types do not replace either. Keep conformance inputs and expectations independent of Vitest and validator internals.

## Consequences and follow-up

- Step 0 selects mutually compatible versions, a supported Node.js version, package tooling, and a lockfile. The original decision selected no exact dependency versions; [ADR-002](002-tooling-contract.md) records subsequent implementation choices.
- Configure Ajv against the planned Draft 2020-12 baseline and disable input mutation/coercion/default insertion. Finalize diagnostic normalization with the diagnostics contract.
- Keep the validator core separate from CLI filesystem operations and Docusaurus presentation code. Do not require a documentation server to validate a document.
- Use existing Markdown as documentation source where practical; avoid maintaining duplicate copies of normative rules when integrating Docusaurus.
- Register build, test, conformance, example-validation, and documentation-build commands as they become available; add reproducible CI checks during tooling implementation.
- JavaScript numeric behavior does not define IR decimal semantics. Specify numeric rules before implementing related features.
- This decision selects tooling only. It does not finalize envelope fields, version policy, types, or execution semantics, and does not authorize deployment or publication.
