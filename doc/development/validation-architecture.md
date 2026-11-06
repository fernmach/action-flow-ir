# Validation architecture

This is an implementation design guide, not a finalized IR or diagnostic specification. Adopt concrete external contracts in the relevant iteration.

## Pipeline

```text
Input text
  -> parsing
  -> version dispatch and structural validation
  -> reference resolution
  -> type checking
  -> control-flow and data-flow analysis
  -> optional target compatibility checks
  -> diagnostic result
```

| Stage | Responsibility |
|---|---|
| Parsing | Report malformed input. JSON is the planned initial serialization; YAML is not implicitly supported. |
| Version/structure | Safely inspect version, reject unsupported versions, select the matching schema, validate shape. Bootstrap inspection must handle non-object/malformed envelopes without crashing. |
| References | Build scoped indexes; detect duplicate identifiers and missing/ambiguous references. |
| Types | Resolve expression types and check operators, assignments, conditions, and calls. |
| Flow | Check node connection rules and reachability; perform specified initialization/output analyses with documented limits. |
| Compatibility | Check a validated core model against an explicitly selected target profile. Core validity and target support are separate results. |

Stop dependent analysis when its prerequisites fail. Continue independent checks where safe; prevent cascades such as type errors caused solely by unresolved references. Define diagnostic ordering so fixture results and CLI output are deterministic.

Validation must not execute actions or call application services. Resolve schema dependencies from controlled local resources; do not fetch arbitrary document-supplied URLs. Apply documented input/analysis limits as needed, reporting a tool/resource limitation distinctly from an invalid document. Do not claim semantic success when a required pass could not complete.

## Diagnostics design

Plan stable codes, severity, JSON Pointer instance paths, readable messages, and optional action/node context. Source line/column locations can be added by the parser. A parse failure may have no instance pointer; document that distinction. Rule identifiers name requirements; diagnostic codes name reported violations. They need not map one-to-one.

Illustrative only:

```json
{
  "code": "AFIR-TYPE-001",
  "severity": "error",
  "path": "/actions/0/nodes/2/value",
  "actionId": "calculateDiscount",
  "nodeId": "applyDiscount",
  "message": "Cannot assign Boolean to Decimal."
}
```

Do not snapshot third-party schema validator wording as the public diagnostic contract. Normalize it. Test code, severity, and location; test exact message text only if it is explicitly part of the contract. Specify text/JSON output and distinct exit behavior for validity failures versus tool failures in Step 0–1.

## Conformance design

Use implementation-independent input documents plus expectation sidecars, outside the document under test. Sidecars should identify case ID, relevant rule IDs, expected validity, expected diagnostic codes/severities/paths, and whether additional diagnostics are allowed. Establish and validate the sidecar format with the harness.

Each negative case should isolate its intended violation where possible. Include interactions, boundaries, duplicate IDs, and malformed inputs as support arrives. Keep syntax failures separate from semantic failures. Preserve old cases as regressions. A second implementation should be able to consume the same corpus without importing validator internals.

## Traceability

Use stable IDs such as `ENV-001` for normative requirements; this example does not adopt a particular envelope rule. Never reuse retired IDs for different meanings. Every testable requirement must link to enforcement and conformance cases. Explain advisory or non-statically-checkable requirements rather than claiming full validation.
