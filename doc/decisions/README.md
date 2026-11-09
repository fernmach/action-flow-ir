# Design decision records

Record significant choices using [the decision template](../development/templates/decision.md). Use sequential filenames such as `001-implementation-stack.md`. Preserve accepted historical records; supersede them explicitly when a choice changes.

Record choices affecting public representation, execution semantics, validation behavior, versioning, or major tooling. Avoid a record for every routine coding detail.

| Decision                                                                       | Status                                                    |
| ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| [ADR-001: Implementation stack](001-implementation-stack.md)                   | Accepted                                                  |
| [ADR-002: Tooling conventions](002-tooling-contract.md)                        | Accepted under Step 0 implementation authorization        |
| [ADR-003: Type-aware linting](003-type-aware-linting.md)                       | Accepted; supersedes ADR-002 compiler preservation choice |
| [ADR-004: Variables and primitive types](004-variables-and-primitive-types.md) | Accepted under the user-approved Step 3 plan              |

Discovery recommendations do not constitute accepted language decisions. See [current pending decisions](../development/status.md).
