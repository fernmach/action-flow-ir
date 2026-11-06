# Iteration workflow

Each iteration delivers one bounded capability across every applicable deliverable. Extend the same enduring artifacts rather than creating a disconnected language specification for every step.

## 1. Establish context and scope

Read agent instructions, status, roadmap, existing rules, and decisions. Inspect the repository. Create an iteration record from `templates/feature.md`. Identify dependencies, acceptance criteria, deferred work, and the smallest end-to-end capability. Prefer completing the current increment over starting unrelated features.

## 2. Specify before encoding behavior

Define purpose, representation, static rules, execution semantics where applicable, failure behavior, and compatibility implications. Assign stable normative rule IDs. Distinguish required behavior from examples and recommendations. Record open questions explicitly; do not present proposals as agreed semantics.

Ask for input when an unresolved choice materially changes intended behavior. Make routine implementation decisions within scope. Record significant choices using `templates/decision.md`. Specification drafting and implementation may iterate together, but implementation must not silently decide unspecified language behavior.

## 3. Map deliverables and acceptance cases

For each rule, record the schema constraint or semantic check, diagnostic where applicable, and conformance cases. Include valid, invalid, and relevant boundary cases. Define expected codes and locations independently of validator output. Mark deferred enforcement explicitly; do not claim a validator supports a rule it does not check.

## 4. Implement the complete increment

Update the normative specification, versioned schema, applicable validator passes, fixtures, runnable examples, and explanatory documentation together. Keep the schema authoritative for structure. Keep semantic checks in explicit passes rather than implementation-specific schema extensions unless a justified decision says otherwise.

Only create stages needed by this increment. An envelope-only validator does not require type or flow analysis. An iteration record may temporarily contain proposed examples, but supported public examples must use the current implemented format.

## 5. Verify and reconcile

Follow `verification.md`. Verify the schema against its selected dialect, run conformance and regression cases, validate supported examples, and check documentation. Review consistency between prose, schema, implementation, and expected results. Fix conflicts at their source. Record unavailable checks honestly.

## 6. Close and hand off

Complete the deliverables matrix and traceability table. Record actual commands and outcomes, compatibility changes, remaining questions, and limitations. Update status and the roadmap if necessary. State the next executable step. Do not mark an increment complete with failed required checks or unresolved semantics in its supported scope.

## Completion checklist

- [ ] Scope and acceptance criteria are satisfied.
- [ ] Applicable representation and semantics have stable normative rules.
- [ ] Schema and semantic checks enforce the supported rules.
- [ ] Diagnostics have stable codes, severity, location, and documented meaning.
- [ ] Positive, negative, boundary, and regression cases pass as applicable.
- [ ] Examples and documentation match the supported implementation.
- [ ] Traceability is complete; any non-applicable deliverable has a reason.
- [ ] Required verification passed and exact results are recorded.
- [ ] Status, decisions, compatibility notes, and next step are current.
