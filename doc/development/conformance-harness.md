# Conformance harness

HARNESS-001: Each expectation sidecar MUST satisfy the Draft 2020-12 metadata schema at `tests/harness/expectation.schema.json`. The fixture loader validates metadata before evaluating a case. Invalid metadata fails the harness rather than masquerading as invalid IR.

Input documents and expectation metadata are separate files. Metadata contains a unique case ID, relevant rule IDs, expected status, expected diagnostic code/severity/path entries, and an explicit additional-diagnostics policy. Corpus case IDs must be unique.

The matcher compares status and diagnostic multisets without depending on order or message wording. Each expected diagnostic consumes one matching actual diagnostic. Omitted path means no instance path; an empty string means root. Extra diagnostics fail unless explicitly permitted.

Harness samples under `tests/harness/samples/` test parsing and missing-version rejection. The real corpus lives under `tests/conformance/`. The recursive runner rejects missing pairs, duplicate IDs and an empty corpus. Run `bun run test:conformance`. Dedicated validator regression tests check diagnostic ordering.

Run harness self-tests with `bun run test:harness`.
