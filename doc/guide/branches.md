# Branch and join paths

Use **0.1.0-draft.5** to add Boolean branches to typed computation. This version accepts finite acyclic graphs with direct joins. Older versions retain their original contracts.

## Calculate a conditional discount

This complete example initializes Discount to zero, then applies a rate only when IsPremium is true and Total is at least Decimal 100:

```json
{
  "irVersion": "0.1.0-draft.5",
  "id": "branches",
  "actions": [
    {
      "id": "CalculateDiscount",
      "entryNodeId": "start",
      "inputs": [
        {
          "id": "Total",
          "name": "Total",
          "type": "Decimal"
        },
        {
          "id": "IsPremium",
          "name": "IsPremium",
          "type": "Boolean"
        }
      ],
      "outputs": [
        {
          "id": "Discount",
          "name": "Discount",
          "type": "Decimal"
        }
      ],
      "locals": [],
      "nodes": [
        {
          "id": "start",
          "kind": "start"
        },
        {
          "id": "initialize",
          "kind": "assign",
          "targetVariableId": "Discount",
          "value": {
            "kind": "literal",
            "type": "Decimal",
            "value": "0"
          }
        },
        {
          "id": "eligible",
          "kind": "branch",
          "condition": {
            "kind": "binary",
            "operator": "and",
            "left": {
              "kind": "variable",
              "variableId": "IsPremium"
            },
            "right": {
              "kind": "binary",
              "operator": "greaterThanOrEqual",
              "left": {
                "kind": "variable",
                "variableId": "Total"
              },
              "right": {
                "kind": "literal",
                "type": "Decimal",
                "value": "100"
              }
            }
          }
        },
        {
          "id": "apply",
          "kind": "assign",
          "targetVariableId": "Discount",
          "value": {
            "kind": "binary",
            "operator": "multiply",
            "left": {
              "kind": "variable",
              "variableId": "Total"
            },
            "right": {
              "kind": "literal",
              "type": "Decimal",
              "value": "0.10"
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
          "toNodeId": "initialize"
        },
        {
          "fromNodeId": "initialize",
          "toNodeId": "eligible"
        },
        {
          "fromNodeId": "eligible",
          "toNodeId": "apply",
          "label": "true"
        },
        {
          "fromNodeId": "eligible",
          "toNodeId": "end",
          "label": "false"
        },
        {
          "fromNodeId": "apply",
          "toNodeId": "end"
        }
      ]
    }
  ]
}
```

The true connection reaches apply; false goes directly to end. Both paths reach end with Discount initialized because initialize runs before the split. The validator checks structure, types and initialization; it does not compute Discount or run the action.

```text
bun run build
bun run cli validate examples/conditional-discount.json --format json
```

## Join directly at an assignment or branch

A branch condition is an existing expression with Boolean result type. Every branch needs exactly one true and one false outcome label; other connections omit labels. Joins require no extra node: several incoming edges may reach one assignment, branch or end.

In `examples/branch-rate.json`, each arm assigns Rate and both converge at the Discount assignment. Rate is definitely initialized because every incoming path assigns it. In `examples/nested-branches.json`, four Tier assignments converge at another branch condition, then both final paths assign RouteCode.

Both branch outcomes may target the same node; the labels keep those edges distinct. Reordering node/connection arrays does not change execution order. Acyclic graphs need not have paired branch/join regions, but every node must be reachable and all paths must finish at the single end. Cycles, loops and calls remain unsupported.

## All incoming paths matter

Removing the initial Discount write and retaining only the true-arm update leaves Discount uninitialized on the false path, so end reports AFIR-INIT-001. Initializing a local on one arm and reading it after a join similarly reports AFIR-INIT-002. Both outcomes are checked even when the condition is literal true or false. Runtime short-circuit semantics also do not exempt static operand checks.

If a path has an earlier error, dependent initialization checks on that path stop. Any later join with that path also becomes unreliable; it does not ignore the bad predecessor. Independent sibling paths and reference/type checks continue, giving useful errors without pretending invalid updates succeeded.

## Common errors and limits

An Integer condition produces AFIR-BRANCH-001. Missing outcome labels or duplicate true/false labels have distinct diagnostics. Labels on ordinary assignment/start edges are invalid. A reachable cycle produces AFIR-FLOW-008 before flow analysis; the validator never enumerates paths or runs an action.

Draft.5 inherits pre-schema container protection and adds a bounded data-flow estimate. Exceeding a validator resource limit returns tool-error status and exit 2, distinct from an invalid document's exit 1. See the [field and diagnostic reference](../reference/branches.md) and [normative rules](../spec/branches.md).

Native platforms can have different implicit initialization behavior. This version keeps AFIR's explicit policy; native-default lowering and adapters require separate design. No defaults are inserted to make a one-arm output assignment pass.
