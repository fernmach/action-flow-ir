# Verification and command registry

## Prerequisites

Node 24.22.1 and Bun 1.4.4 on PATH. Run all commands below from the repository root. Root and website are separate packages with separate tracked lockfiles. Do not mix package managers or regenerate lockfiles in CI.

## Commands

| Check                            | Command                                                        |
| -------------------------------- | -------------------------------------------------------------- |
| Root dependency setup            | `bun install --frozen-lockfile`                                |
| Website dependency setup         | `bun install --cwd website --frozen-lockfile`                  |
| Default formatting check         | `bun run format:check`                                         |
| Apply default formatting         | `bun run format` (after lint fixes; review the diff)           |
| Type-aware implementation lint   | `bun run lint` (zero warnings permitted)                       |
| Automatic lint corrections       | `bun run lint:fix` (review the diff)                           |
| Root type checks                 | `bun run typecheck`                                            |
| Node.js ESM build                | `bun run build`                                                |
| All implementation/harness tests | `bun run test` (build first for compiled CLI tests)            |
| Harness self-tests               | `bun run test:harness`                                         |
| Watch tests                      | `bun run test:watch`                                           |
| CLI smoke checks                 | `bun run cli --help` and `bun run cli --version` (build first) |
| Website type checks              | `bun run docs:typecheck`                                       |
| Documentation/link checks        | `bun run docs:build`                                           |
| Aggregate local/CI check         | `bun run check`                                                |
| Local documentation server       | `bun run docs:dev` (stop with Ctrl+C)                          |

No IR schema, version-specific corpus, or supported IR examples exist yet. Schema validity is currently exercised for test metadata and the Ajv integration schema only. Step 1 must add real schema/conformance/example checks to the aggregate command.

ESLint 10.14.0, typescript-eslint 8.72.1 and @eslint/js 10.0.1 are root development dependencies. Root TypeScript is pinned to 6.0.2, inside typescript-eslint's documented support range. The root flat config enables recommended type-aware rules using each file's TypeScript project. It covers source, tests, Vitest configuration and website TS/TSX; ESLint configuration itself receives ordinary JavaScript checks. Dependencies, emitted code, website build/generated state, coverage and Vitest artifacts are ignored. No React-specific lint plugin is configured.

Prettier 3.9.10 uses an empty `.prettierrc.json`, preserving all standard defaults. ESLint Stylistic 5.10.0 supplies only statement padding; core `curly` requires braces. Padding is required around functions/types/classes/exports and control-flow blocks, between variable declarations and other statements, after the import group, and before returns. Consecutive imports and variable declarations may stay grouped. Meaningful subgroups remain an author responsibility. `eslint-config-prettier` 10.1.8 disables conflicting formatting rules before the two selected readability rules. There is no broad Stylistic preset or Prettier-as-an-ESLint-rule plugin.

Prettier excludes generated output, dependencies, static assets, lockfiles and fixture directories via `.prettierignore`. Fixture whitespace and malformed data must stay intact; expectation metadata validation remains a separate harness responsibility. Supported examples added later should be formatted unless their exact text is intentionally part of a test.

## CI

`.github/workflows/ci.yml` runs frozen installs and aggregate checks on Windows and Linux using selected Node/Bun versions. No deployment or remote publication is configured. Local Windows checks do not prove hosted CI or Linux execution; inspect those results once a remote exists.

## Required checks as capabilities arrive

1. Validate every IR schema against its meta-schema and resolve bundled references deterministically.
2. Run all conformance cases for supported versions; fail on an unexpectedly empty corpus.
3. Exercise semantic algorithms and stage boundaries with meaningful unit/interaction cases.
4. Validate supported examples against their versions/profiles.
5. Keep format, lint and root/website type/build checks passing. Formatting then lint run first in the aggregate command and therefore in CI.
6. Keep broken Markdown/site links fatal; Docusaurus renders existing doc sources.
7. Run the same checks in CI and update this registry.

Test code, severity, status, and paths rather than dependency-generated wording. Record exact commands/results and distinguish failed, unavailable and out-of-scope checks. Required failures prevent completion. Documentation-only changes need consistency/link/build checks, not tests mirroring prose.
