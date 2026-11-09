# ITER-002a: IR authoring guide

Status: complete
Date: 2026-11-09
Roadmap step: documentation follow-up to Step 2
Target IR version: unchanged; guide targets 0.1.0-draft.2

## Purpose and scope

Teach users to write supported IR documents independently of CLI usage. Add practical examples for the envelope, minimal graph, local references, metadata and provenance. Separate guide, specification, field reference and CLI navigation. Preserve existing documentation paths, normative rules and developer workflow. No new language capability, publishing or execution is included.

## Acceptance criteria

- The homepage leads to a complete JSON authoring example and separate specification/CLI entry points.
- The guide explains required fields, valid empty documents, start/end graphs, local identity and optional information.
- Common mistakes are explained without presenting unsupported syntax as valid.
- Guide pages are published; developer documentation stays excluded.
- Complete guide documents validate; formatting, lint, existing conformance and documentation checks pass.

## Design

Four non-normative pages in `doc/guide/` link to enduring specification rules. Small fragments are explicitly introduced as fields, connections or action objects rather than complete documents. Existing CLI pages retain their routes and content. The supported versions and compatibility behavior do not change. No unresolved semantic decisions.

## Deliverables

| Deliverable                         | Paths                     | Required changes or reason not applicable                      | Completion evidence                       |
| ----------------------------------- | ------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| Normative specification             | `doc/spec/`               | Not applicable: no rule changes                                | Guide links existing ENV and ACT rules    |
| JSON Schema                         | `schema/`                 | Not applicable: no structural changes                          | Existing schemas retained                 |
| Reference validator                 | `src/`                    | Not applicable: no behavior changes                            | Existing implementation retained          |
| Conformance suite                   | `tests/conformance/`      | No new cases: no new rules                                     | Existing cases run during aggregate check |
| Runnable examples                   | `examples/`, `doc/guide/` | Existing examples retained; complete inline examples checked   | Verification below                        |
| Explanatory/reference documentation | `doc/guide/`, `website/`  | Four guide pages, audience-specific navigation, homepage links | Documentation/link build                  |
| Adapters                            | None                      | Deferred; outside scope                                        | No adapter changes                        |

## Rule traceability

No new rule IDs or diagnostics. Basic structure explains ENV-001–003, ENV-006–008 and ACT-001/009. Actions and identifiers explain ACT-001–009. Metadata/provenance explains ENV-004–006. Existing enforcement and conformance links remain in the normative chapters.

## Implementation tasks

- [x] Review supported rules and current documentation.
- [x] Add example-led authoring pages and separate navigation.
- [x] Validate complete examples and run required checks.
- [x] Record verification and update status.

## Verification results

Commands ran from `C:\Projects\action-flow-ir`, using Node 24.22.1 on the command PATH.

| Command                                               | Actual result                                                                                                                                        | Limitations                                                                                    |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `bun run format`                                      | Passed; reviewed formatting changes                                                                                                                  | No fixture changes                                                                             |
| Inline JavaScript piped to `node --input-type=module` | Extracted JSON fences from `doc/guide/*.md`; validated four complete documents and one action wrapped in a draft.2 envelope using `validateDocument` | Field/connection fragments are explanatory, not complete documents                             |
| `bun run check`                                       | Formatting, lint, root type/build, 287 tests, schema checks, 246 conformance cases, seven example tests and website type checks passed               | Final documentation build failed on Windows EPERM creating generated `website/build/docs/spec` |
| `bun run docs:build` (outside sandbox retry)          | Passed production build and fatal link checks                                                                                                        | Local Windows execution only; not hosted CI                                                    |
| `git diff --check`                                    | Passed                                                                                                                                               | Git reported ordinary LF/CRLF conversion notices                                               |

## Completion and handoff

The authoring guide and separate CLI navigation are complete. Existing normative content and CLI routes remain unchanged. No files were moved and the development workflow is unchanged; only its status/history records were updated. Variables, expressions, assignments and branches remain unsupported; expand the guide when their versions are implemented. The next language increment remains Step 3.
