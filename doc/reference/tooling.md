# Tooling contract

Tool version: 0.0.0 (development). Supported IR versions: none.

## Commands

Build with `bun run build`, then run:

```text
bun run cli --help
bun run cli --version
bun run cli validate <file> [--format text|json]
```

TOOL-001: The CLI MUST accept the command shapes above and reject unknown commands, extra arguments, missing files/format values, and unsupported formats. File paths beginning with a dash must be supplied with a path prefix, for example `./-input.json`. Help/version alone exit successfully. The package bin name is `afir`; a global installation is not required.

TOOL-002: Input MUST be parsed as JSON without coercion or repair. Malformed JSON (including a leading BOM) returns `AFIR-PARSE-001`. Parsing does not establish structural or semantic conformance. Parse diagnostics currently omit location, rather than exposing engine-specific wording or offsets.

TOOL-003: Until an IR version is implemented, every parseable JSON input MUST produce `AFIR-TOOL-003` and a tool-error result. No document is accepted as valid IR in Step 0.

TOOL-004: Unreadable files MUST produce `AFIR-TOOL-002`. Unexpected internal failures MUST produce `AFIR-TOOL-004` without stack traces or underlying private filesystem details.

TOOL-005: Validation responses MUST contain `status` (`valid`, `invalid`, or `tool-error`) and a `diagnostics` array. JSON mode MUST emit one JSON object on stdout and no stderr diagnostic text. Text mode sends failures to stderr. Exit codes MUST be 0 for success, 1 for invalid input, and 2 for usage/I/O/unsupported validation/internal failures. The CLI recognizes `--format json` even when other arguments fail validation.

Diagnostics contain `code`, `severity` (`error` or `warning`), and human-readable `message`. `path`, when present, is an instance JSON Pointer; an empty string means document root, omission means unavailable/not applicable. Optional `actionId`/`nodeId` provide context. Message wording is not the stable machine contract; codes, status, severity and locations are. Current validation returns a single diagnostic; future stages must define deterministic ordering before returning multiple diagnostics.

## Diagnostic reference

| Code           | Meaning                      | Exit |
| -------------- | ---------------------------- | ---- |
| AFIR-PARSE-001 | Malformed JSON               | 1    |
| AFIR-TOOL-001  | Invalid command arguments    | 2    |
| AFIR-TOOL-002  | Input cannot be read         | 2    |
| AFIR-TOOL-003  | No IR validation implemented | 2    |
| AFIR-TOOL-004  | Internal/startup failure     | 2    |

Missing CLI package metadata also reports TOOL-004. No IR execution, external schema retrieval, target generation, or publication occurs.
