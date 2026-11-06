# ITER-000: Tooling foundation

Status: complete (local verification)
Date: 2026-11-06
Roadmap step: 0
Target IR version: none; tool version 0.0.0 is not an IR version.

## Purpose and scope

Configure the accepted stack as a runnable Node.js CLI, test harness, documentation site, and CI. No envelope or executable language semantics are introduced. Validation deliberately cannot return IR success yet.

## Acceptance criteria

- Strict NodeNext TypeScript checks and emits a Node.js ESM CLI.
- CLI help/version, usage, file errors, JSON parsing and unsupported-validation outcomes are tested.
- Draft 2020-12 Ajv integration rejects invalid data without mutation.
- Fixture sidecars and loader are validated independently of IR rules.
- Docusaurus renders existing doc sources without duplicate normative copies.
- Frozen lockfile installs and aggregate checks are reproducible.
- Windows/Linux CI runs the same checks. Hosted execution is outside local verification.

## Design

Node 24.22.1, Bun 1.4.4; separate root/website packages and lockfiles. Node APIs only in runtime source. See [tooling contract](../../reference/tooling.md) and [conformance harness](../conformance-harness.md). No IR version supported, no implicit normalization, no schema fetched from document input. See ADR-001 and ADR-002 for tooling choices.

## Deliverables

| Deliverable | Paths | Scope |
|---|---|---|
| Normative contract | `doc/reference/tooling.md` | Tool behavior only; IR specification not applicable yet |
| JSON Schema | `tests/harness/expectation.schema.json` | Test metadata only, not an IR schema |
| Reference validator | `src/validator/`, `src/cli/` | Parse/diagnostics/CLI foundation; IR support deferred |
| Conformance suite | `tests/harness/` | Harness self-tests; IR cases deferred to Step 1 |
| Runnable examples | CLI help/version and test fixtures | No conforming IR examples exist yet |
| Documentation | `doc/`, `website/` | Single-source documentation build |
| Adapters | Not applicable | Deferred |

## Rule traceability

| Rule | Enforcement | Diagnostics | Cases |
|---|---|---|---|
| TOOL-001 | CLI argument handling | AFIR-TOOL-001 | help/version and invalid-argument tests |
| TOOL-002 | JSON parser | AFIR-PARSE-001 | malformed and primitive JSON tests |
| TOOL-003 | validator entry | AFIR-TOOL-003 | parseable JSON never accepted as IR |
| TOOL-004 | file and tool error handling | AFIR-TOOL-002/004 | injected read failure, compiled missing/directory tests |
| TOOL-005 | result renderer | all | JSON stream, status, exit-code tests |
| HARNESS-001 | sidecar schema/loader/matcher | harness errors | harness self-tests |

## Verification results

All commands ran from the repository root on Windows with Node 24.22.1 and Bun 1.4.4. Bun's bin directory was added to the process PATH because the agent shell did not inherit it.

| Command | Actual result |
|---|---|
| `bun install` | Initial sandbox lockfile replacement failed (EBADF); approved retry outside sandbox succeeded and removed unused Bun typings |
| `bun install --frozen-lockfile` | Passed; root lockfile unchanged |
| `bun install --cwd website --frozen-lockfile` | Passed; website lockfile unchanged |
| `bun run check` | Passed: strict type checks, Node ESM build, 24 tests in five files, website type checks, production site build and link checks |
| `bun run test:harness` | Passed: four harness self-tests |
| `bun run cli --help` | Passed; usage output and exit 0 |
| `bun run cli --version` | Passed; 0.0.0 and exit 0 |
| `git ls-files -- bun.lock website/bun.lock` | Both lockfiles tracked in the local index |

The documentation builder emitted an optional update-notifier cache permission message after successful builds. It did not prevent output generation or fail the build. No system config permissions were changed.

## Completion and handoff

- [x] Tooling scope and acceptance criteria satisfied locally.
- [x] Tool-only requirements and diagnostics documented and traced to tests.
- [x] Metadata schema and matcher exercised with valid/invalid/boundary cases.
- [x] CLI examples and documentation reflect actual behavior.
- [x] Frozen installs and required local checks passed.
- [x] Status, decisions, command registry, README and agent instructions updated.

No IR schema or supported version exists, so language-rule validation, real IR fixtures/examples, and adapters are not applicable to this increment. Parsing-only fixtures are explicitly harness samples. Hosted GitHub Actions and Linux execution remain unobserved until a remote is connected; the workflow is configured but no remote or commit was created. No deployment or release occurred.

Next: Step 1 envelope/version-policy specification and its full applicable deliverables.
