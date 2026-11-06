# Action-Flow IR

A language-independent, typed representation of application logic, initially focused on OutSystems server actions. The project will include a versioned specification, JSON Schema, reference validator, conformance suite, and documentation.

**Current state:** Step 2 supports **0.1.0-draft.2** minimal actions and connections, plus the unchanged **0.1.0-draft.1** empty envelope. Both support optional source provenance. The accepted stack is TypeScript, Node.js, Ajv, custom semantic passes, Vitest, and Docusaurus. See the [stack decision](doc/decisions/001-implementation-stack.md).

## Development

Use Node 24.22.1 and Bun 1.4.4 (see version files). Ensure both executables are on PATH. Run from the repository root:

```powershell
bun install --frozen-lockfile
bun install --cwd website --frozen-lockfile
bun run check
bun run cli --help
bun run docs:dev
```

`check` includes Prettier formatting, ESLint type-aware/readability rules, type checks, build, compiled CLI tests, schema validation, conformance corpus, examples, and documentation build. Run `bun run lint` or `bun run format:check` independently. Apply automatic corrections with `bun run lint:fix` followed by `bun run format`, then review changes. Prettier uses its default settings; ESLint additionally requires braces and blank-line separation. Generated output, lockfiles, static assets and fixture data are excluded from formatting.

Build first with `bun run build` when running tests individually. `bun run cli validate <file> --format json` validates supported envelopes; invalid documents exit 1 and unsupported versions exit 2. See the [tooling contract](doc/reference/tooling.md).

Both lockfiles belong in version control. CI performs frozen installs and runs checks on Windows and Linux; it does not deploy the website.

## Start here

- [Agent instructions](AGENTS.md)
- [Current status](doc/development/status.md)
- [Roadmap](doc/development/roadmap.md)
- [Iteration workflow](doc/development/iteration-workflow.md)
- [Validation architecture](doc/development/validation-architecture.md)
- [Verification and commands](doc/development/verification.md)
- [Specification index](doc/spec/README.md)
- [Design decisions](doc/decisions/README.md)
- [Initial exploration](doc/discover/initial-exploration-draft.md)
- [Strategy and stack exploration](doc/discover/stratey-and-stack-decision.md)

## Repository layout

| Path                 | Responsibility                                                          |
| -------------------- | ----------------------------------------------------------------------- |
| `doc/discover/`      | Historical exploration; proposals rather than normative rules           |
| `doc/development/`   | Workflow, roadmap, status, templates, and iteration records             |
| `doc/decisions/`     | Significant design choices and rationale                                |
| `doc/spec/`          | Enduring normative language specification                               |
| `doc/reference/`     | Field and diagnostic reference, added as features arrive                |
| `doc/tutorials/`     | Explanatory usage guides, added as features arrive                      |
| `schema/<version>/`  | Versioned structural contract, created during implementation            |
| `src/validator/`     | Validation stages and shared diagnostics, created during implementation |
| `src/cli/`           | Command-line entry point, created during implementation                 |
| `tests/conformance/` | Implementation-independent documents and expected results               |
| `examples/`          | Complete examples validated by the toolchain                            |

Both schemas, the conformance corpus, envelope examples and minimal/multiple-action examples are implemented. See the [minimal-action tutorial](doc/tutorials/minimal-action.md). See verification documentation for current tooling availability.
