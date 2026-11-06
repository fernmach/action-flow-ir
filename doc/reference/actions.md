# Action field and diagnostic reference

Available in **0.1.0-draft.2**. See the [normative actions chapter](../spec/actions.md) for all rules and the diagnostic table.

| Object     | Required fields                     | Meaning                                          |
| ---------- | ----------------------------------- | ------------------------------------------------ |
| Action     | id, entryNodeId, nodes, connections | A declaration with a scoped graph                |
| Node       | id, kind                            | Start or end marker                              |
| Connection | fromNodeId, toNodeId                | Directed control transfer between local node IDs |

IDs and references are nonempty strings without surrounding ECMAScript whitespace. Action IDs are document-scoped; node IDs are action-scoped. Arrays and objects reject null, and objects reject unknown properties. Connections have no IDs. Each action has exactly one start and one end, connected start → end; declaration order is irrelevant. Empty document action collections are allowed.

Duplicate identities, unresolved references and graph errors produce invalid status and CLI exit 1. Reference and graph checks only run after structural success. The normative chapter specifies dependent-check suppression, pointer locations and deterministic diagnostic ordering. Draft.1 still requires empty actions.

Try the [minimal-action tutorial](../tutorials/minimal-action.md).
