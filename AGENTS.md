# Action-Flow IR agent instructions

## Purpose and current scope

Build a language-independent, typed representation of application logic, a reference validator, and a conformance suite. Initially model OutSystems server actions while keeping the core independent of OutSystems and the implementation language. Deliver small, complete increments across specification, schema, validator, tests, examples, and documentation.

## Start every task here

1. Read `doc/development/status.md` and `doc/development/roadmap.md`.
2. Follow `doc/development/iteration-workflow.md` and `doc/development/validation-architecture.md`.
3. Read affected sections of `doc/spec/` and applicable decisions in `doc/decisions/`.
4. Use `doc/development/templates/feature.md` for iteration records under `doc/development/iterations/`.
5. Inspect actual source, tests, and available commands before editing. Preserve unrelated user changes.

## Authority and design discipline

- User instructions govern the requested scope. Discovery notes are background and proposals, not adopted language rules.
- Published JSON Schema is the structural contract; normative prose defines semantics. Neither may silently contradict the other. Resolve conflicts at their source and add regression cases.
- Keep development feature plans separate from the enduring language specification. Move every implemented language rule into `doc/spec/`.
- Do not infer language behavior from host-language defaults. Specify defaults, nulls, numeric behavior, evaluation order, scope, assignment order, and failure behavior when relevant.
- Keep stable rule IDs, diagnostic codes, and traceability from rules to enforcement and conformance cases.
- Do not silently coerce input, insert schema defaults, discard unknown fields, or repair flows during validation. Any normalization must be separately specified and explicit.
- Ask about unresolved choices that materially alter intended behavior; continue independent work. Resolve routine implementation details autonomously and document meaningful choices.
- The accepted stack is TypeScript on Node.js, Ajv for structural validation, custom TypeScript semantic passes, Vitest for tests, and Docusaurus for documentation. Follow `doc/decisions/001-implementation-stack.md`. Select compatible versions and record reproducible commands during Step 0.
- JSON Schema Draft 2020-12 is the planned structural baseline. Treat a different dialect as a documented design change.
- No adapters, generators, custom textual parser, publishing, or execution engine are required until explicitly scoped by an iteration.

## Definition of done

An increment is complete only when applicable specification, schema, validator, conformance cases, examples, and explanatory documentation agree; required checks pass; and no unresolved decision prevents precise semantics. Mark a deliverable not applicable with a reason, never silently omit it.

Run existing conformance cases as well as checks for the new increment. Do not weaken tests to fit an implementation. Add meaningful positive, negative, and boundary cases. Report commands actually run and their results; never claim unimplemented checks passed.

Update the iteration record and `doc/development/status.md` before handing off. Report changed behavior, verification, and remaining limitations. Never mark a feature or release complete merely because its plan exists.

## Repository map and commands

See `README.md` for the repository map and `doc/development/verification.md` for actual commands. Run `bun run check` for the aggregate Node build, tests, website type checks, and documentation build. No IR versions are supported yet: parseable JSON returns an explicit tool error. Do not invent schema/conformance/example commands before Step 1 implements them.
