# Validate a document

From the repository root, install dependencies with `bun install --frozen-lockfile` and build with `bun run build`.

Validate a bundled example:

```text
bun run cli validate examples/outsystems.json
```

Success prints `Document is valid.` on stdout and exits 0. For structured results:

```text
bun run cli validate examples/minimal.json --format json
```

The result is `{"status":"valid","diagnostics":[]}`. Change the id to an empty string to receive invalid status and exit 1. A declaration such as `1.0.0` is well-formed but unsupported, producing tool-error and exit 2. A missing or malformed declaration is invalid and exits 1.

JSON responses go to stdout; text failures go to stderr. Use codes and JSON Pointer paths to inspect errors. The package version shown by `--version` is independent of the IR version. This draft validates the container only: actions must remain empty. See the [field reference](../reference/envelope.md).
