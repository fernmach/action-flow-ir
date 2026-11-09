# Declare variables and types

Use **0.1.0-draft.3** to declare typed inputs and locals. The earlier guide pages use draft.2 to introduce graph structure; this chapter adds the three required declaration arrays. The [language specification](../spec/variables-and-types.md) defines the exact rules.

## A valid typed action

```json
{
  "irVersion": "0.1.0-draft.3",
  "id": "discount-module",
  "actions": [
    {
      "id": "inspectDiscount",
      "entryNodeId": "start",
      "nodes": [
        { "id": "start", "kind": "start" },
        { "id": "end", "kind": "end" }
      ],
      "connections": [{ "fromNodeId": "start", "toNodeId": "end" }],
      "inputs": [
        { "id": "total", "name": "Total", "type": "Decimal" },
        { "id": "eligible", "name": "Eligible", "type": "Boolean" }
      ],
      "outputs": [],
      "locals": [
        { "id": "count", "name": "Count", "type": "Integer" },
        { "id": "label", "name": "Label", "type": "Text" }
      ]
    }
  ]
}
```

The declarations do not calculate a discount. Inputs are initialized at entry and read-only. Locals start uninitialized, and unused locals are valid. Expressions, assignments and execution are not supported yet.

Choose `Boolean` for true/false, `Integer` for mathematical integers, `Decimal` for exact finite base-10 numbers, and `Text` for Unicode scalar sequences. All four exclude null. Integer and Decimal are distinct types; this draft defines neither conversions nor value serialization or arithmetic.

## IDs, names and scope

Every declaration needs an ID, a portable name and a type. `Total`, `_count` and `Label2` are valid names; `2Total`, `Total amount` and names with accented letters are invalid. Names and IDs are case-sensitive. No names are reserved.

Use different IDs and names across inputs, outputs and locals in one action. Another action may reuse them. A variable ID may equal a node ID because they occupy separate namespaces. Reordering declarations does not initialize them or create positional argument binding.

## Why outputs currently fail

Replace the example's empty outputs array with this fragment:

```json
"outputs": [
  { "id": "discount", "name": "Discount", "type": "Decimal" }
]
```

The resulting document is **invalid**. The validator reports `AFIR-INIT-001` at `/actions/0/outputs/0/id`: Discount is uninitialized at normal completion. Start and end do not assign values, and there is no automatic zero or empty value. Valid output-producing actions require the future assignment increment.

Adding `default`, `initializer`, `nullable` or `value` to a declaration instead produces `AFIR-SCHEMA-001` at that undeclared field. See the [field and diagnostic reference](../reference/variables-and-types.md).

## Validate and migrate

The repository's `examples/typed-action.json` is a complete valid typed action. Build the CLI, then validate it:

```text
bun run build
bun run cli validate examples/typed-action.json --format json
```

To migrate an existing draft.2 graph, change irVersion to `0.1.0-draft.3` and explicitly add `inputs`, `outputs` and `locals`, using empty arrays where appropriate. The validator does not insert missing arrays. Draft.1 and draft.2 documents continue to use their original contracts.
