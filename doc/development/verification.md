# Verification and command registry

## Prerequisites

Node 24.22.1 and Bun 1.4.4 on PATH. Run all commands below from the repository root. Root and website are separate packages with separate tracked lockfiles. Do not mix package managers or regenerate lockfiles in CI.

## Commands

| Check | Command |
|---|---|
| Root dependency setup | `bun install --frozen-lockfile` |
| Website dependency setup | `bun install --cwd website --frozen-lockfile` |
| Root type checks | `bun run typecheck` |
| Node.js ESM build | `bun run build` |
| All implementation/harness tests | `bun run test` (build first for compiled CLI tests) |
| Harness self-tests | `bun run test:harness` |
| Watch tests | `bun run test:watch` |
| CLI smoke checks | `bun run cli --help` and `bun run cli --version` (build first) |
| Website type checks | `bun run docs:typecheck` |
| Documentation/link checks | `bun run docs:build` |
| Aggregate local/CI check | `bun run check` |
| Local documentation server | `bun run docs:dev` (stop with Ctrl+C) |

No IR schema, version-specific corpus, or supported IR examples exist yet. Schema validity is currently exercised for test metadata and the Ajv integration schema only. Step 1 must add real schema/conformance/example checks to the aggregate command.

## CI

`.github/workflows/ci.yml` runs frozen installs and aggregate checks on Windows and Linux using selected Node/Bun versions. No deployment or remote publication is configured. Local Windows checks do not prove hosted CI or Linux execution; inspect those results once a remote exists.

## Required checks as capabilities arrive

1. Validate every IR schema against its meta-schema and resolve bundled references deterministically.
2. Run all conformance cases for supported versions; fail on an unexpectedly empty corpus.
3. Exercise semantic algorithms and stage boundaries with meaningful unit/interaction cases.
4. Validate supported examples against their versions/profiles.
5. Keep root/website type/build checks passing.
6. Keep broken Markdown/site links fatal; Docusaurus renders existing doc sources.
7. Run the same checks in CI and update this registry.

Test code, severity, status, and paths rather than dependency-generated wording. Record exact commands/results and distinguish failed, unavailable and out-of-scope checks. Required failures prevent completion. Documentation-only changes need consistency/link/build checks, not tests mirroring prose.
