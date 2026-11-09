# Compute and assign values

Use **0.1.0-draft.4** to read inputs, initialize locals and assign outputs. Earlier guide chapters retain their original versioned examples. This is static validation, not execution.

## A complete calculation

The following action follows start → initializeRate → computeDiscount → end. Each assignment writes one variable. Total, Rate and Discount are all Decimal.

```json
{
  "irVersion": "0.1.0-draft.4",
  "id": "module",
  "actions": [
    {
      "id": "calculateDiscount",
      "entryNodeId": "start",
      "inputs": [
        {
          "id": "total",
          "name": "total",
          "type": "Decimal"
        }
      ],
      "outputs": [
        {
          "id": "discount",
          "name": "discount",
          "type": "Decimal"
        }
      ],
      "locals": [
        {
          "id": "rate",
          "name": "rate",
          "type": "Decimal"
        }
      ],
      "nodes": [
        {
          "id": "start",
          "kind": "start"
        },
        {
          "id": "initializeRate",
          "kind": "assign",
          "targetVariableId": "rate",
          "value": {
            "kind": "literal",
            "type": "Decimal",
            "value": "0.10"
          }
        },
        {
          "id": "computeDiscount",
          "kind": "assign",
          "targetVariableId": "discount",
          "value": {
            "kind": "binary",
            "operator": "multiply",
            "left": {
              "kind": "variable",
              "variableId": "total"
            },
            "right": {
              "kind": "variable",
              "variableId": "rate"
            }
          }
        },
        {
          "id": "end",
          "kind": "end"
        }
      ],
      "connections": [
        {
          "fromNodeId": "start",
          "toNodeId": "initializeRate"
        },
        {
          "fromNodeId": "initializeRate",
          "toNodeId": "computeDiscount"
        },
        {
          "fromNodeId": "computeDiscount",
          "toNodeId": "end"
        }
      ]
    }
  ]
}
```

The initialized set begins with total, adds rate after the first assignment, then discount after the second. All outputs are initialized at end, so the document is valid. It computes a fixed rate expression; branches are not supported yet.

Build and validate the repository example:

```text
bun run build
bun run cli validate examples/calculate-discount.json --format json
```

## Expressions get types from their structure

A literal declares its type; a variable reference obtains its type from its declaration. Operators infer result types. The Decimal literal "0.10" preserves its exact value; Integer and Decimal JSON numbers are invalid. Integer "10" cannot be assigned to a Decimal output: use a Decimal literal "10". No implicit conversion, division, rounding or numeric evaluation occurs during validation.

Boolean literals use JSON booleans and Text literals use Unicode scalar strings. Numeric literals reject whitespace, exponent notation and leading plus. Negative zero and trailing fractional zeros are allowed and preserved. See the [operator and literal rules](../spec/expressions.md).

## Read before writing

Swapping the two assignments in the nodes array changes no behavior: connections still define order. Rewiring connections to compute Discount before initializing Rate produces AFIR-INIT-002 at the reference to rate. Reading an output is allowed after assignment, and repeated writes are allowed. A variable cannot initialize its own first read: Count := Count + 1 requires an earlier write to Count.

Inputs are read-only. Changing the discount target to total produces AFIR-ASSIGN-001. Changing the Decimal multiplication to Text produces operand/type diagnostics. An unresolved variable reports AFIR-REF-001; validation does not guess its type.

All operands are statically checked, including the right side of false and ... or true or .... These are explanatory expressions, not supported textual syntax. Runtime short-circuit semantics do not exempt static resolution/type/initialization rules.

## Missing outputs and recovery

Removing the Discount assignment while keeping a valid linear graph produces AFIR-INIT-001 at the output declaration. At the first invalid assignment, dependent initialization checks stop to avoid cascading missing-output errors, while independent reference/type checks continue at later nodes. An error in one action does not stop another action's analysis.

## Versioning

Draft.3 continues to reject output-bearing start/end actions because it has no assignments. Migration requires an explicit version change and valid assignment nodes/connections; validation does not repair documents. No defaults, optional inputs, branches, calls or execution engine are introduced. The [field and diagnostic reference](../reference/computation.md) explains draft.4's resource limits and tool-error distinction.
