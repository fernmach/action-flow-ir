# Validate a minimal action

Build from the repository root and validate the new example:

```text
bun run build
bun run cli validate examples/minimal-action.json --format json
```

The result is `{"status":"valid","diagnostics":[]}` and exit 0. The example uses draft.2 and declares a start node, an end node, an explicit entry reference and a connection from start to end. Node array order does not choose entry.

Change entryNodeId to a nonexistent node ID to receive AFIR-REF-001 at `/actions/0/entryNodeId` with exit 1. Remove the connection instead to receive degree failures for both nodes and an unreachable-end diagnostic. These checks validate the graph; they do not execute the action.

`examples/multiple-actions.json` demonstrates two independent actions reusing their local start/end IDs. Existing draft.1 examples remain valid, but draft.1 rejects action objects. Merely changing a version does not migrate future unsupported features.

See the [action reference](../reference/actions.md) and [normative specification](../spec/actions.md).
