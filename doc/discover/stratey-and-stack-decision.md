I would build this as a **versioned language specification with a reference validator and a conformance test suite**. That gives you an ecosystem similar in spirit to OpenAPI: a documented contract, machine-readable definitions, reusable tooling, and examples.

One adjustment to your approach: **write documentation alongside each feature**, then assemble and publish it at the end. Decisions about execution behavior are part of the specification and cannot all be generated from code.

### 1. Separate the deliverables

| Deliverable | Purpose |
|---|---|
| Specification | Defines what every construct means |
| JSON Schema | Defines the permitted document structure |
| Reference validator | Checks structure, references, types, and flow rules |
| Conformance suite | Supplies valid and invalid documents with expected results |
| Documentation | Explains concepts, fields, semantics, errors, and examples |
| Adapters, later | Import OutSystems and generate target implementations |

JSON Schema is a good foundation for the structural contract. I would explicitly select **Draft 2020-12**, which has established validator support. OpenAPI 3.1 also aligned its schema model with this draft. Your IR would have its own schema and semantics. [JSON Schema specification](https://json-schema.org/draft/2020-12), [OpenAPI migration guide](https://learn.openapis.org/upgrading/v3.0-to-v3.1.html)

### 2. Build the IR in small, complete increments

For **each feature**, follow this cycle:

> Describe its purpose → define its representation → specify its semantics → add schema constraints → implement semantic checks → add valid and invalid examples → document it.

A practical sequence would be:

| Step | Define | Validate |
|---|---|---|
| 1. Document envelope | IR version, document identity, action collection, metadata | Required fields, supported versions, unknown fields |
| 2. Minimal action | Action ID, start node, end node, connections | Unique IDs, valid endpoints, valid entry node, connection rules |
| 3. Variables and types | Inputs, outputs, locals, initial primitive types | Names, scope, valid type references |
| 4. Expressions | Literals, variable references, operators | Operand types, result types, reference resolution |
| 5. Assignment | Writable destination and source expression | Assignment compatibility, writable references |
| 6. Branches | Boolean conditions and labeled outgoing connections | Boolean result, required branches, branch uniqueness |
| 7. Loops | Loop form, iteration variable, collection, exit behavior | Collection types, variable scope, legal connections |
| 8. Action calls | Action signatures, input binding, output mapping | Existing callees, argument compatibility, output destinations |
| 9. Flow analysis | Reachability, initialization, termination rules | Unreachable nodes, use before initialization, required output assignments |
| 10. Compatibility | Supported features and target profiles | Unsupported constructs for a particular adapter |

At each step, make the validator work end to end. For example, after assignment support you should already have a command that accepts a valid assignment flow and explains why an invalid one fails.

**Decide execution rules before implementing their checks.** An “output assigned” check depends on whether outputs have implicit initial values. A loop check depends on whether arbitrary cycles are legal or only explicit loop constructs are permitted.

### 3. Treat validation as a pipeline

```text
Document
   ↓
Parsing
   ↓
Structural validation — JSON Schema
   ↓
Reference resolution — IDs, variables, actions, types
   ↓
Type checking — expressions, assignments, calls
   ↓
Control-flow and data-flow analysis
   ↓
Optional target compatibility checks
   ↓
Diagnostics
```

JSON Schema can establish that an assignment has a destination reference and an expression. Your semantic validator establishes that the destination exists and can receive that expression’s type.

Keep these stages separate enough to test independently, and avoid cascading errors: an unresolved variable should not produce several misleading type errors afterward.

Define a diagnostic format early:

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

Stable error codes can connect validator output directly to documentation and conformance tests.

### 4. Give every feature a specification template

For example, the assignment section should answer:

| Part | Questions it answers |
|---|---|
| Purpose | What does an assignment represent? |
| Representation | Which fields are required? |
| Static rules | Which destinations and expression types are allowed? |
| Execution semantics | When is the expression evaluated and the destination updated? |
| Failure behavior | What happens if evaluation fails? |
| Examples | What are valid and invalid assignments? |
| Diagnostics | Which rule violations can the validator report? |

For a node containing multiple assignments, specify whether they execute sequentially or evaluate all expressions before updating destinations. That distinction can change program behavior.

### 5. Choose a stack

These are three reasonable options. All can implement the same language-independent format.

| Stack | Suggested components | Best fit | Main tradeoff |
|---|---|---|---|
| **TypeScript** | Node.js, Ajv, custom semantic passes, Vitest, Docusaurus | CLI plus a future browser editor or validator | Numeric execution semantics need deliberate handling |
| **C# / .NET** | System.Text.Json, JsonSchema.Net, custom semantic passes, xUnit, Markdown documentation | Tooling close to an existing C# integration | A browser playground would usually need a separate frontend |
| **Python** | `jsonschema`, custom semantic passes, pytest, Sphinx | Rapid exploration and a readable reference implementation | A browser validator would usually require a service or another implementation |

The structural validator choices are established: [Ajv supports Draft 2020-12](https://ajv.js.org/json-schema.html), [JsonSchema.Net supports it](https://docs.json-everything.net/schema/basics/), and [Python `jsonschema` supports it](https://python-jsonschema.readthedocs.io/en/stable/). Docusaurus also supports versioned documentation, useful when the IR develops multiple released versions. [Docusaurus versioning](https://docusaurus.io/docs/versioning)

**My default recommendation is TypeScript + JSON Schema + Ajv**, particularly if you expect an interactive viewer or editor. Choose C# if direct integration with your OutSystems tooling is the stronger priority. Python is attractive if your immediate goal is to experiment with semantics quickly.

In every case, I would keep the **published JSON Schema as the authoritative structural contract**, rather than making consumers depend on implementation-language classes. The prose specification remains authoritative for execution semantics.

### 6. Organize the repository around those boundaries

```text
schema/
  0.1/
    action-flow.schema.json

src/
  validator/
    structure/
    references/
    types/
    flow/
    diagnostics/
  cli/

tests/
  conformance/
    valid/
    invalid/

examples/

doc/
  discover/
  spec/
  reference/
  tutorials/
  decisions/
```

Each invalid conformance case should declare the expected diagnostic code and location. This eventually lets a second validator implementation prove that it follows the same rules.

CI should validate the schema itself, check all examples, run the conformance suite, and build the documentation.

### 7. Aim for a small first milestone

Your first milestone should demonstrate:

- One action with typed inputs and outputs.
- Start/end nodes, assignments, and one conditional.
- A few precisely defined expression operators.
- Structural, reference, and type validation.
- A CLI with readable and JSON diagnostics.
- A specification chapter and valid/invalid examples for every supported construct.

Use `CalculateDiscount` as the first complete example. Then test the design against a real OutSystems action before expanding it.

That produces a useful **v0.1 specification and validator** while exposing semantic gaps early. Loops, calls, database operations, and generators can then arrive as deliberate extensions.