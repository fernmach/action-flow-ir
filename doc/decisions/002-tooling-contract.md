# ADR-002: Tooling foundation conventions

Status: accepted
Compiler preservation choice superseded by ADR-003; remaining conventions unchanged.
Date: 2026-11-06
Related iteration: ITER-000

## Context and options

The user authorized executing Step 0. Existing local installations are Node 24.22.1 and Bun 1.4.4. A Bun-oriented template conflicts with the selected Node runtime. Separate package installs or a workspace are possible; keep the existing two-package layout to minimize scaffolding changes.

## Decision

Use Node 24.22.1 and Bun 1.4.4, recorded in version files and CI. Use TypeScript NodeNext ESM with a separate emit configuration. Keep existing locked compiler versions (root TypeScript 7, website TypeScript 6) isolated in their own packages. Keep the installed Node typings version unless checks reveal incompatibility; restrict actual runtime APIs to Node 24.

Use JSON as initial input. Adopt the tooling result/exit conventions in the tooling reference and implementation-independent sidecars in the harness guide. Use Draft 2020-12 for test metadata and the planned IR schema. Do not treat parser success as IR conformance.

Use existing `doc/` Markdown in Docusaurus with Markdown parsing for `.md` files, so ordinary placeholders such as angle-bracket CLI arguments do not become JSX. Keep broken links fatal. No hosting target is selected; the site URL is a local placeholder and no deployment workflow is added.

These are routine implementation decisions under the user's Step 0 authorization, not separately asserted user approvals of IR semantics.

## Consequences

Track both lockfiles, run frozen installs and a shared check script in Windows/Linux CI. IR schema, supported versions, flow semantics and adapters remain future iterations. Update version files and CI together when upgrading tooling.
