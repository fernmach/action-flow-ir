# ITER-000b: Default formatting and readability

Status: complete (local verification)
Date: 2026-11-06
Roadmap step: tooling follow-up
Target IR version: none

## Purpose and acceptance criteria

The user requested default Prettier formatting plus braces and blank-line separation. Install pinned Prettier and ESLint Stylistic, retain existing correctness checks, format maintained files, and include formatting checks in the aggregate CI command. Verify the readability rules and ensure lint fixes and formatting agree.

## Design

An empty root Prettier configuration selects standard defaults. Prettier handles whitespace and wrapping; ESLint core `curly` requires braces and Stylistic padding separates functions, declarations and control-flow groups. Consecutive variable declarations and imports may stay grouped. Authors separate meaningful subgroups that cannot be inferred mechanically. No broad Stylistic preset is enabled. Prettier compatibility config precedes the two selected rules.

Generated/dependency output, static assets, lockfiles and fixture data are excluded from formatting. Fixtures may contain malformed data or intentional whitespace; their metadata schema remains checked by the harness. Existing IR semantics and diagnostics are unchanged.

## Deliverables and traceability

| Deliverable                               | Scope/evidence                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| Specification/schema/adapters/IR examples | Not applicable: development-tooling change                               |
| Implementation                            | Prettier config, Stylistic padding and braces, scripts, formatted source |
| Tests                                     | Existing behavior suite and controlled readability/formatting probes     |
| Documentation                             | Agent conventions, README, command registry, iteration and status        |
| CI                                        | Existing aggregate command now checks formatting and lint                |

Acceptance criteria map to installed versions, rule probes, formatting idempotence, frozen installs and aggregate verification. No new IR rules or conformance corpus are introduced.

## Verification and handoff

Verified on Windows with Node 24.22.1 and Bun 1.4.4:

| Check                                    | Actual result                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependency installation                  | Pinned Prettier 3.9.10, ESLint Stylistic 5.10.0, eslint-config-prettier 10.1.8; approved retry outside sandbox after temporary-directory access failure |
| `bun run lint:fix` then `bun run format` | Applied braces, padding and default formatting to maintained files                                                                                      |
| ESLint API / Prettier API probe          | Missing braces and padding rejected; fixed output passes both tools and repeated formatting is identical                                                |
| Root/website frozen installs             | Passed; website lockfile unchanged                                                                                                                      |
| `bun run check`                          | Passed formatting, zero-warning lint, root type/build checks, 24 tests in five files, website types and production documentation/link build             |
| `git diff --check`                       | Passed                                                                                                                                                  |
| Fixture diff inspection                  | No changes to harness sample data                                                                                                                       |

The documentation builder retains the optional update-notifier cache permission message after successful output generation. Hosted CI/Linux execution was not observed; existing CI uses the updated aggregate command automatically.

All scoped deliverables are complete locally. No IR version, new semantic checks, commit or publication was introduced. Step 1 remains the next language increment. Format-only changes include Markdown, configuration, tests and website source as well as runtime source; fixture text remains untouched.
