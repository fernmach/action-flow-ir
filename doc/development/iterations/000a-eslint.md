# ITER-000a: Type-aware implementation linting

Status: complete (local verification)
Date: 2026-11-06
Roadmap step: tooling follow-up to Step 0
Target IR version: none

## Purpose and scope

Install and configure ESLint/typescript-eslint as requested by the user. Apply recommended type-aware rules to validator source, CLI, tests, configuration and website TypeScript. No language behavior, IR schema, or adapter is introduced.

## Acceptance criteria

- Supported compiler/linter versions installed and root lockfile updated.
- Root flat config covers maintained TypeScript/TSX and ignores generated/dependency files.
- Type-aware rules active, with source issues fixed rather than globally suppressed.
- `lint` and `lint:fix` scripts documented; aggregate local/CI checks include lint.
- Frozen install, lint, type/build checks, existing tests and documentation build pass.

## Design and decisions

The documented typescript-eslint support range is TypeScript >=4.8.4 and <6.1.0. Align root compiler to 6.0.2, matching the website baseline, rather than suppressing unsupported-version warnings. This supersedes ADR-002's original compiler preservation choice only. User authorized this installation after the compatibility recommendation.

Use one root ESLint flat config with `recommendedTypeChecked` and project service for each file's tsconfig. Generated output, dependencies, coverage and test artifacts are ignored. Configuration JavaScript receives ordinary recommended checks. Formatting and framework-specific plugins are outside this increment.

## Deliverables and traceability

| Deliverable | Change/evidence |
|---|---|
| Normative IR specification / IR schema / IR examples / adapters | Not applicable: tooling-only increment |
| Implementation | ESLint config, scripts, lint-driven source/test corrections |
| Tests/conformance | Existing behavior tests retained; controlled lint probes verify type-aware coverage rather than introducing IR conformance cases |
| Documentation | Command registry, README, agent instructions and status |
| CI | Existing aggregate command now includes lint |

Tooling acceptance criteria map to configuration, lint probes, frozen install and aggregate verification below. No new language rule IDs or diagnostics are introduced.

## Verification results and handoff

All checks ran on Windows with Node 24.22.1 and Bun 1.4.4. Installation required an approved retry outside the sandbox after Bun could not access its temporary directory.

| Check | Result |
|---|---|
| `bun add --dev --exact eslint @eslint/js typescript-eslint typescript@6.0.2` | Installed ESLint 10.14.0, @eslint/js 10.0.1, typescript-eslint 8.72.1, TypeScript 6.0.2; root lockfile updated |
| `bun run lint` | Passed with zero warnings/errors after fixing six findings |
| `bun run typecheck` | Passed with supported compiler |
| ESLint API `lintText` probes on existing source/test/website paths | Forgotten promise rejected by `no-floating-promises` in all three locations |
| ESLint API `isPathIgnored` probes | Dependency and generated paths ignored |
| `bun install --frozen-lockfile` | Passed without changes |
| `bun install --cwd website --frozen-lockfile` | Passed without changes |
| `bun run check` | Passed lint, root types/build, 24 tests in five files, website type checks and production documentation/link build |
| `git diff --check` | Passed |
| Final `bun run docs:build` after recording results | Sandbox denied creation of a generated directory (EPERM); approved retry outside sandbox passed |

The documentation build retains the previously recorded optional update-notifier cache permission message; the build succeeds. Hosted CI/Linux execution has not been observed in this increment. No CI workflow edit is needed because it already invokes the aggregate command.

Source fixes retain CLI behavior: package metadata is checked as unknown before reading version; tests avoid unsafe JSON member access and unnecessary async wrappers. No linter rule was suppressed. The root config and explicit lint probes establish coverage without new tests mirroring configuration.

All scoped acceptance criteria are satisfied. No release, publication, or commit created. Step 1 remains the next language increment. Formatting and framework-specific linting remain outside scope.
