# Actions and connections

An action contains a graph: nodes represent positions in the flow, and directed connections describe control transfer. In **0.1.0-draft.2**, each action has exactly one start and one end, with one connection from start to end.

## Describe an action

The following action object belongs inside the document's `actions` array:

```json
{
  "id": "do-nothing",
  "entryNodeId": "begin",
  "nodes": [
    { "id": "begin", "kind": "start" },
    { "id": "finish", "kind": "end" }
  ],
  "connections": [{ "fromNodeId": "begin", "toNodeId": "finish" }]
}
```

`id` identifies the action. `entryNodeId` refers to its start node. Both `nodes` and `connections` are required arrays.

## Declare nodes

Every node has an `id` and a `kind`. The ID is a name you choose; the kind determines its role. In this example, `begin` has kind `start`, and `finish` has kind `end`. IDs do not have to match kind names.

Start marks entry into the action. End denotes normal completion. No other node kinds are supported in this draft.

## Connect the nodes

```json
{ "fromNodeId": "begin", "toNodeId": "finish" }
```

The connection points from the start node to the end node. Connections reference node IDs within the same action; they do not have their own IDs or labels.

The resulting flow is `begin → finish`. Reordering the node array does not change it: entry and connections are explicit references.

## Common mistakes

| Change to this example        | Why it is invalid                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Set `entryNodeId` to `finish` | Entry must refer to the start node.                                                                |
| Remove the connection         | Start needs one outgoing connection, end needs one incoming connection, and end must be reachable. |
| Reverse the connection        | Start cannot have an incoming connection; end cannot have an outgoing connection.                  |
| Add a second start or end     | Each action must contain exactly one of each.                                                      |
| Add an assignment node        | Only `start` and `end` kinds are supported.                                                        |

## Multiple actions

A document may contain several independent actions. Give each action a different ID. Each can reuse the local node IDs `begin` and `finish`; connections cannot cross action boundaries. Declaring multiple actions does not invoke them or specify an execution sequence.

See [identifiers and references](identifiers-and-references.md) for scope examples, or return to the [complete document](basic-structure.md#a-complete-document). Exact constraints are defined by [ACT-001 through ACT-009](../spec/actions.md#representation-and-rules).
