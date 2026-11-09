# Basic structure

Action-Flow IR describes application logic as a JSON document containing actions, nodes, and connections. This guide teaches you to write a document using **0.1.0-draft.2**. It explains the existing language; the [language specification](../spec/README.md) defines the exact requirements.

Draft.2 supports minimal actions with one start node connected to one end node. Variables, expressions, assignments, branches, loops, and action calls are not supported yet. The validator checks documents without executing their actions.

## A complete document

This valid document describes an action that begins and immediately completes:

```json
{
  "irVersion": "0.1.0-draft.2",
  "id": "example",
  "actions": [
    {
      "id": "do-nothing",
      "entryNodeId": "start",
      "nodes": [
        { "id": "start", "kind": "start" },
        { "id": "end", "kind": "end" }
      ],
      "connections": [{ "fromNodeId": "start", "toNodeId": "end" }]
    }
  ]
}
```

Save the document as a `.json` file. JSON property names are case-sensitive, and JSON does not allow comments or trailing commas.

## Format version

`irVersion` selects the rules used to interpret the document:

```json
{ "irVersion": "0.1.0-draft.2" }
```

This fragment shows one field, not a complete document. Use the exact version string. Draft.1 remains supported, but only allows an empty `actions` array. The IR version is independent of the validator package version and any source platform version.

## Document identity

`id` identifies the document. Choose a nonempty string without surrounding whitespace, such as `example` or `customer-actions`. A UUID is not required.

## Actions

`actions` is the required array of action declarations. Each action contains its own nodes and connections. Their array order does not cause them to be invoked.

An empty document is also valid in draft.2:

```json
{
  "irVersion": "0.1.0-draft.2",
  "id": "example",
  "actions": []
}
```

## Optional information

You can add [metadata and source provenance](metadata-and-provenance.md). Omit optional fields when unused; do not set them to `null`. Undeclared properties are rejected, so adding a custom field does not extend the language.

Continue with [actions and connections](actions-and-connections.md) to understand the graph in the complete example. When ready, follow the separate [CLI validation guide](../tutorials/validate-document.md).

For typed declarations, continue with [Variables and types](variables-and-types.md), which introduces draft.3 while preserving these draft.2 examples.
