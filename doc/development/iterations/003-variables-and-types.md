# ITER-003: Variables and primitive types

Status: complete
Date: 2026-11-09
Roadmap step: 3
Target IR version: 0.1.0-draft.3

## Purpose and scope

Implement the user-approved Step 3 plan: strict typed inputs, outputs and locals, scoped identities/names, primitive domains and explicit initialization. Depend on Step 2 and preserve both earlier drafts. Expressions, value initializers, assignment, collections, calls, execution, adapters and publication are excluded.

## Acceptance criteria

All three drafts dispatch exactly. Draft.3 requires declaration arrays and supports four non-nullable primitives. Duplicate IDs/names are diagnosed across categories. Declaration checks and graph checks remain independent; output initialization is enforced only with valid local prerequisites. Conformance, examples, specification and documentation agree, and required aggregate checks pass.

## Design

See [ADR-004](../../decisions/004-variables-and-primitive-types.md) and [the normative chapter](../../spec/variables-and-types.md). Required declaration fields are id/name/type; portable names and exact identities share one action-wide scope. Inputs are initialized/read-only; locals and outputs start uninitialized. Outputs cannot be initialized by the two supported nodes, so eligible output-bearing actions are invalid. No unresolved semantic choices remain in the approved scope.

## Deliverables

| Deliverable                         | Paths                           | Required changes or reason not applicable          | Completion evidence                             |
| ----------------------------------- | ------------------------------- | -------------------------------------------------- | ----------------------------------------------- |
| Normative specification             | doc/spec/variables-and-types.md | VAR-001 through VAR-007 and TYPE-001               | Implemented; required checks passed (see below) |
| JSON Schema                         | schema/0.1.0-draft.3/           | Independent strict Draft 2020-12 contract          | Implemented; required checks passed (see below) |
| Reference validator                 | src/validator/                  | Version dispatch, declarations and initialization  | Implemented; required checks passed (see below) |
| Conformance suite                   | tests/conformance/variables/    | Independent expectations and inherited regressions | Implemented; required checks passed (see below) |
| Runnable examples                   | examples/typed-action.json      | Valid inputs and unused locals                     | Implemented; required checks passed (see below) |
| Explanatory/reference documentation | doc/guide/, doc/reference/      | Typed authoring and diagnostic reference           | Implemented; required checks passed (see below) |
| Adapters and execution              | Not applicable                  | Explicitly excluded                                | No adapter or engine introduced                 |

## Rule traceability

The normative chapter's traceability table maps every new rule to schema/semantic enforcement, diagnostic codes and positive/negative/boundary cases. Domain definitions and access obligations without value/operation syntax are identified explicitly rather than claiming runtime validation.

## Implementation tasks

- [x] Finalize rules and relevant decisions.
- [x] Define independent acceptance fixtures and expectations.
- [x] Implement applicable deliverables.
- [x] Verify and reconcile artifacts.
- [x] Update status and handoff.

## Verification results

Commands ran from `C:\Projects\action-flow-ir`. The configured Node launcher initially could not locate Node; the installed runtime was found and used without changing system settings by prepending `C:\Users\Fernando.Machado\AppData\Local\Author Software\nvm\installs\v24.22.1` to PATH in each verification command. Node reports v24.22.1 and Bun reports 1.4.4. Python and the default Node launcher could not run initial schema-generation commands; schema/corpus authoring used the installed Bun instead. No dependency installs, upgrades or lockfile changes.

| Exact command            | Actual result                                                                                           | Limitations                                                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bun run build            | Passed                                                                                                  | NodeNext emit before focused conformance run                                                                                                                                             |
| bun run test:conformance | Initial run: 544 passed, 6 failed out of 550                                                            | Six authored expectations omitted overlapping schema constraints (type/enum or minLength/pattern); corrected expectations without changing validation, then added eight field-type cases |
| bun run lint:fix         | Passed; reviewed the diff                                                                               | Automatic fixes added required statement separation                                                                                                                                      |
| bun run format           | Passed; reviewed the diff                                                                               | Fixtures excluded; new schema/docs/source formatted                                                                                                                                      |
| bun run check            | All checks through website type checking passed; documentation build failed at sandbox mkdir with EPERM | 606 tests in 12 files; 558 conformance cases; 4 schema checks; 8 example checks covering seven examples and the presence guard                                                           |
| bun run docs:build       | Passed outside sandbox                                                                                  | Production static generation and fatal link checks passed; no hosted CI/Linux verification                                                                                               |

The final `bun run check` rerun after documentation/status review passed in the normal sandbox: formatting, zero lint errors/warnings, root/website types, Node build, 606 tests in 12 files, four schema checks, 558 conformance cases, eight example checks and production documentation/link generation. The earlier mkdir failure was transient. Docusaurus emits a nonfatal update-notifier config-store notice in the sandbox; its production build succeeds. `git diff --check` passed, and review confirmed the earlier schemas and both lockfiles have no changes.

## Completion and handoff

The approved increment is implemented and all required check components pass. The new corpus adds 312 cases (150 declaration/interaction cases plus 162 inherited action/envelope cases), retaining the 246 earlier cases. Four focused unit tests cover typed preservation, deterministic mixed-pass diagnostics, schema nonmutation and version isolation. Compiled CLI tests cover valid typed actions, initialization failures in text/JSON and startup failure for all three schemas.

VAR-001 through VAR-007 and TYPE-001 are traced in the normative chapter; no unresolved choice blocks this scope. Value domains are specified without claiming literal/arithmetic/runtime validation. No general data-flow framework, execution, adapter, publishing or dependency change was introduced. Draft.1/draft.2 schemas remain unchanged; the unsupported draft.3 fixture now uses draft.4. Existing authoring-guide changes are preserved.

Next: Step 4 expressions with read-before-initialization checks and explicit value/operator semantics; valid output-producing actions require Step 5 assignment.
