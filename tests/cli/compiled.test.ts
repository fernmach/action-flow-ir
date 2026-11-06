import { spawnSync } from "node:child_process";
import { mkdtemp, writeFile, rm, cp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

test("compiled CLI runs in Node with real filesystem inputs", async () => {
  const directory = await mkdtemp(join(tmpdir(), "afir-"));
  const cli = fileURLToPath(new URL("../../dist/cli/main.js", import.meta.url));
  const call = (args: string[]) =>
    spawnSync(process.execPath, [cli, ...args], {
      encoding: "utf8",
      cwd: directory,
    });

  try {
    expect(call(["--help"]).status).toBe(0);
    expect(call(["--version"]).stdout.trim()).toBe("0.0.0");

    const file = join(directory, "input.json");

    await writeFile(file, "{");
    expect(call(["validate", file]).status).toBe(1);
    await writeFile(file, '{"irVersion":"1.0.0"}');

    const unsupported = call(["validate", file, "--format", "json"]);

    expect(unsupported.status).toBe(2);
    expect(unsupported.stderr).toBe("");
    expect(JSON.parse(unsupported.stdout)).toMatchObject({
      status: "tool-error",
    });
    await writeFile(
      file,
      '{"irVersion":"0.1.0-draft.1","id":"example","actions":[]}',
    );

    const valid = call(["validate", file]);

    expect(valid.status).toBe(0);
    expect(valid.stdout).toBe("Document is valid.\n");
    expect(valid.stderr).toBe("");

    const json = call(["validate", file, "--format", "json"]);

    expect(json.status).toBe(0);
    expect(JSON.parse(json.stdout)).toEqual({
      status: "valid",
      diagnostics: [],
    });
    expect(json.stderr).toBe("");
    await writeFile(file, "{}");

    const invalid = call(["validate", file]);

    expect(invalid.status).toBe(1);
    expect(invalid.stdout).toBe("");
    expect(invalid.stderr).toContain("AFIR-VERSION-001");

    const actionExample = await readFile(
      new URL("../../examples/minimal-action.json", import.meta.url),
      "utf8",
    );

    await writeFile(file, actionExample);

    for (const format of ["text", "json"]) {
      const success = call(["validate", file, "--format", format]);

      expect(success.status).toBe(0);
      expect(success.stderr).toBe("");
      expect(success.stdout).toContain(
        format === "text" ? "Document is valid." : '"status":"valid"',
      );
    }

    await writeFile(
      file,
      actionExample.replace(
        '"entryNodeId": "start"',
        '"entryNodeId": "missing"',
      ),
    );

    for (const format of ["text", "json"]) {
      const failure = call(["validate", file, "--format", format]);

      expect(failure.status).toBe(1);
      expect(format === "text" ? failure.stdout : failure.stderr).toBe("");
      expect(format === "text" ? failure.stderr : failure.stdout).toContain(
        "AFIR-REF-001",
      );
    }

    expect(call(["validate", join(directory, "missing")]).status).toBe(2);
    expect(call(["validate", directory]).status).toBe(2);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test.each(["0.1.0-draft.1", "0.1.0-draft.2"])(
  "schema initialization failures are structured tool failures: %s",
  async (version) => {
    // Keep the isolated installation beneath the repository for dependency resolution.
    const root = fileURLToPath(new URL("../../", import.meta.url));
    const directory = await mkdtemp(join(root, ".afir-startup-"));

    try {
      await cp(join(root, "dist"), join(directory, "dist"), {
        recursive: true,
      });
      await cp(join(root, "package.json"), join(directory, "package.json"));
      await cp(join(root, "schema"), join(directory, "schema"), {
        recursive: true,
      });
      await writeFile(
        join(directory, "schema", version, "action-flow.schema.json"),
        "{",
      );

      const result = spawnSync(
        process.execPath,
        [
          join(directory, "dist", "cli", "main.js"),
          "validate",
          "unused",
          "--format",
          "json",
        ],
        { encoding: "utf8", cwd: tmpdir() },
      );

      expect(result.status).toBe(2);
      expect(result.stderr).toBe("");
      expect(JSON.parse(result.stdout)).toMatchObject({
        status: "tool-error",
        diagnostics: [{ code: "AFIR-TOOL-004" }],
      });
      expect(result.stdout).not.toContain(directory);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);
