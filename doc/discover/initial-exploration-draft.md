# Action-Flow IR — Initial Exploration Draft

Status: Exploration draft
Date: 2026-11-06

We are exploring a **language-independent representation of application logic** that humans can understand and tools can validate and translate into other languages.

**Initial scope:** OutSystems action flows, possibly expanding to business rules.

### Main conclusions

- **Pseudocode** is readable but lacks standardized syntax and precise semantics for reliable validation and code generation.
- There is no single universal representation that covers all our requirements.
- Existing options include:
  - **Alf + fUML:** standardized textual modeling and executable semantics built around UML.
  - **MLIR:** extensible compiler infrastructure, requiring significant compiler engineering.
  - **DMN + FEEL:** standardized business decisions and executable expressions.
- The proposed approach is a **small, custom, typed Action-flow IR**, with optional DMN/FEEL integration. This is a recommendation, not an implemented solution or finalized specification.

### Proposed architecture

```text
OutSystems actions ←→ Typed Action-flow IR → Other target languages
                               ↕
                    Human-readable notation
```

The structured IR would be the source of truth. Text, diagrams, and generated code would be views or transformations of that model.

Importing/exporting OutSystems and generating other languages require dedicated adapters; choosing an IR does not provide these automatically.

### What the IR should represent

- Action names, typed inputs, outputs, and local variables.
- Start/end nodes, assignments, conditions, switches, loops, and action calls.
- Explicit connections between flow nodes.
- Typed expression trees for literals, references, operators, and function calls.
- Eventually: queries, entity operations, exception handlers, transactions, and client/server execution context.
- Stable IDs and original OutSystems identifiers for traceability.
- Optional diagram coordinates as presentation metadata.

Preserving nodes and connections should make mapping to OutSystems flows easier. Human-readable text could render recognizable structured blocks.

### Example

Human-readable notation, proposed rather than standardized:

```text
action CalculateDiscount(
    Total: Decimal,
    IsPremium: Boolean
) returns (Discount: Decimal)
{
    Discount := 0

    if IsPremium and Total >= 100 {
        Discount := Total * 0.10
    }
}
```

Its flow would be:

```text
Start → Initialize Discount → Check eligibility
                                 ├─ True → Apply discount → End
                                 └─ False ───────────────→ End
```

The JSON IR would contain typed nodes with stable IDs and explicit connections. Expressions would be structured trees, for example:

```json
{
  "kind": "binary",
  "operator": "multiply",
  "left": {
    "kind": "variable",
    "ref": "total"
  },
  "right": {
    "kind": "literal",
    "type": "Decimal",
    "value": "0.10"
  }
}
```

Decimal literal values were represented as strings to avoid floating-point approximation during JSON parsing. Decimal precision and rounding still need explicit definitions.

### Validation and semantic requirements

A schema can validate document structure. Additional semantic validation must check:

- References and flow connections exist.
- Operators, calls, and assignments use compatible types.
- Conditions produce Boolean values.
- Outputs are assigned on required terminating paths.
- Target languages support the requested operations.

The specification must define behavior precisely: defaults, decimal precision, rounding, null handling, evaluation order, short-circuiting, assignment order, list iteration, exceptions, transactions, and output mapping.

Generators should reject unsupported behavior explicitly. Validation alone does not prove that generated implementations behave identically.

### DMN and FEEL

**FEEL is an executable expression language, not a metalanguage describing arbitrary code.** It expresses calculations and decisions.

```text
if IsPremium and Total >= 100
then Total * 0.10
else 0
```

**DMN organizes business decisions**, their dependencies, and decision tables. FEEL supplies conditions and calculations.

Example decision table:

| IsPremium | Total    | Discount       |
| --------- | -------- | -------------- |
| `true`    | `>= 100` | `Total * 0.10` |
| `true`    | `< 100`  | `0`            |
| `false`   | `-`      | `0`            |

`-` means any value. A **Unique** hit policy requires at most one matching rule.

Potential integration:

- Ordinary business logic can remain in the action-flow IR.
- Independent decision tables could use DMN/FEEL.
- FEEL could potentially supply expressions inside the IR, but its semantics and type mappings must be reconciled with OutSystems.
- FEEL alone does not represent the full action flow, including database operations, side effects, and exception handling.

### Benefits and suggested next step

Benefits include a shared representation for humans and tools, validation before generation, reusable generators, traceability to OutSystems, and multiple views of the same logic.

Start with **server actions containing assignments, conditions, loops, and action calls**. Define their semantics, schema, and validator before adding queries and transaction handling.

No implementation has been completed. The next task is to design a minimal IR specification and test whether it can faithfully represent real OutSystems actions.

References: [OutSystems concepts](https://success.outsystems.com/documentation/11/onboarding_developers/outsystems_main_concepts/), [OMG DMN](https://www.omg.org/dmn/index.htm), [Alf reference implementation](https://modeldriven.github.io/Alf-Reference-Implementation/), [MLIR](https://mlir.llvm.org/docs/LangRef/).
