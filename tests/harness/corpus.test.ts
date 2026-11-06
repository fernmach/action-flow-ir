import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { expect, test } from "vitest";
import { loadCorpus } from "./corpus.js";

test("corpus rejects empty, missing pairs and duplicate IDs; discovers recursively", async () => {
  const directory = await mkdtemp(join(tmpdir(), "afir-corpus-"));
  const url = pathToFileURL(directory + "/");
  const expected = JSON.stringify({
    id: "same",
    rules: ["ENV-002"],
    status: "invalid",
    diagnostics: [],
    allowAdditionalDiagnostics: false,
  });

  try {
    await expect(loadCorpus(url)).rejects.toThrow("empty");
    await writeFile(join(directory, "a.expected.json"), expected);
    await expect(loadCorpus(url)).rejects.toThrow();
    await writeFile(join(directory, "a.input.txt"), "{}");
    expect(await loadCorpus(url)).toHaveLength(1);
    await mkdir(join(directory, "nested"));
    await writeFile(join(directory, "nested", "b.input.txt"), "{}");
    await expect(loadCorpus(url)).rejects.toThrow("Missing fixture pair");
    await writeFile(join(directory, "nested", "b.expected.json"), expected);
    await expect(loadCorpus(url)).rejects.toThrow("Duplicate case ID");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
