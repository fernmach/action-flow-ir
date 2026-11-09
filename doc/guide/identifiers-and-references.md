# Identifiers and references

IDs name documents, actions, and nodes. References use those names to identify entry and connection endpoints. These rules apply to **0.1.0-draft.2**.

## Choose IDs

Use nonempty strings without leading or trailing whitespace. For example, `calculate-total` is valid; an empty string or `" calculate-total "` is invalid. IDs are case-sensitive: `Start` and `start` are different. Validation does not trim or normalize them.

## Understand scope

Action IDs must be unique within the document. Node IDs must be unique within their containing action. A node ID can be reused in another action.

This complete document contains two independent actions with the same local node names:

```json
{
  "irVersion": "0.1.0-draft.2",
  "id": "two-actions",
  "actions": [
    {
      "id": "first",
      "entryNodeId": "start",
      "nodes": [
        { "id": "start", "kind": "start" },
        { "id": "end", "kind": "end" }
      ],
      "connections": [{ "fromNodeId": "start", "toNodeId": "end" }]
    },
    {
      "id": "second",
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

Changing the second action ID to `first` would create a duplicate action ID. Reusing `start` inside a single action would create a duplicate node ID.

## Resolve references locally

`entryNodeId`, `fromNodeId`, and `toNodeId` refer to nodes in the containing action. They cannot refer to a node that exists only in another action. An action ID is not an action-call reference; calls are not supported yet.

In the example, changing the first action's `entryNodeId` to `Start` leaves it unresolved because that action only declares `start` and `end`. Node array order cannot supply a missing entry reference.

See the normative rules [ENV-003](../spec/document-envelope.md#requirements) and [ACT-002 through ACT-005](../spec/actions.md#representation-and-rules), or continue with [metadata and provenance](metadata-and-provenance.md).
