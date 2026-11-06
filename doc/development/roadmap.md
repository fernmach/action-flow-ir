# Roadmap

Steps 0–1 are implemented locally; Steps 2–10 remain planned. Each follows `iteration-workflow.md` and produces the applicable full deliverable set. The sequence may change through a recorded rationale when dependencies or real examples require it. See [Step 0](iterations/000-tooling-foundation.md) and [Step 1](iterations/001-document-envelope.md) for evidence and limits.

| Step | Capability          | Key rules and checks                                                                                                                        | Dependencies                                |
| ---- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 0    | Tooling foundation  | Scaffold accepted TypeScript/Node.js/Ajv/Vitest/Docusaurus stack; minimal CLI, diagnostics contract, fixture harness, reproducible commands | Stack accepted in ADR-001                   |
| 1    | Document envelope   | Version declaration, identity, collection shape, metadata policy, unknown fields, supported-version handling                                | 0                                           |
| 2    | Minimal action      | Action and node IDs, start/end, entry, connections, endpoint resolution, cardinalities                                                      | 1                                           |
| 3    | Variables and types | Inputs, outputs, locals, primitive types, naming, scope, initialization policy                                                              | 2                                           |
| 4    | Expressions         | Typed literals/references, small operator set, type results, evaluation rules, decimal representation                                       | 3                                           |
| 5    | Assignment          | Writable destinations, compatible types, evaluation and update order                                                                        | 4                                           |
| 6    | Branches            | Boolean conditions, branch labels, uniqueness, required connections and merges                                                              | 5                                           |
| 7    | Loops               | Loop representation, collection types, iteration scope/order, exits and cycles                                                              | 6; collection type design                   |
| 8    | Action calls        | Signatures, resolution, argument evaluation, output mapping, recursion/failure policy                                                       | 6; extend analysis for loops when supported |
| 9    | Flow analysis       | Reachability, definite initialization/output assignment, legal termination, merge and loop behavior                                         | Incrementally from 2; complete against 7–8  |
| 10   | Compatibility       | Feature declarations/profiles and target-specific unsupported-feature diagnostics                                                           | Stable core; concrete target requirements   |

Step 0 supplies only infrastructure needed to execute Step 1; avoid speculative frameworks. It may be delivered with Step 1 while retaining separate acceptance criteria.

## First usable milestone

Complete Steps 0–6 and the applicable flow analysis from Step 9: one typed `CalculateDiscount` action, assignments and a conditional, a precisely defined small operator set, structural/reference/type validation, and flow checks required by its specified rules. Provide CLI text/JSON results and complete conformance/docs coverage.

Do not postpone validation of already-supported normative rules until Step 9. More advanced analysis can arrive later only with its scope clearly bounded. General termination cannot be guaranteed for arbitrary programs; specify structural termination rules and conservative analysis limits instead.

Test the design against an authorized real OutSystems action before expanding it. Record fidelity gaps and provenance without importing private module content into public examples.

## Later work

Queries, entity operations, exceptions, transactions, client/server context, adapters, generators, executable reference semantics, human-readable syntax, graphical views, and optional DMN/FEEL integration require separately scoped increments. No automatic round-trip fidelity or cross-language behavior equivalence is claimed.

## Release discipline

The first release label is provisional; do not confuse an IR format version, schema dialect, validator package version, and documentation version. Define their relationship during Step 1. Record breaking format/semantic changes and migration expectations. Never reinterpret an already-released version silently.
