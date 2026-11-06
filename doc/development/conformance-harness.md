# Conformance harness

HARNESS-001: Each expectation sidecar MUST satisfy the Draft 2020-12 metadata schema at `tests/harness/expectation.schema.json`. The fixture loader validates metadata before evaluating a case. Invalid metadata fails the harness rather than masquerading as invalid IR.

Input documents and expectation metadata are separate files. Metadata contains a unique case ID, relevant rule IDs, expected status, expected diagnostic code/severity/path entries, and an explicit additional-diagnostics policy. Corpus case IDs must be unique when the Step 1 corpus runner is introduced.

The matcher compares status and diagnostic multisets without depending on order or message wording. Each expected diagnostic consumes one matching actual diagnostic. Omitted path means no instance path; an empty string means root. Extra diagnostics fail unless explicitly permitted.

Step 0 sample fixtures under `tests/harness/samples/` test parsing and unsupported validation only. They are not conforming IR examples. There is no IR conformance corpus yet. Step 1 will add `tests/conformance/` and its runner; it must fail on an unexpectedly empty corpus. The current Vitest run also fails if no tests are discovered.

Run harness self-tests with `bun run test:harness`.
