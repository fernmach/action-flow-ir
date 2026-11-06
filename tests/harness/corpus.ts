import { readdir } from "node:fs/promises";
import { loadFixture } from "./fixture.js";

export async function loadCorpus(directory: URL) {
  const files: URL[] = [];

  async function walk(url: URL): Promise<void> {
    for (const entry of await readdir(url, { withFileTypes: true })) {
      const child = new URL(
        encodeURIComponent(entry.name) + (entry.isDirectory() ? "/" : ""),
        url,
      );

      if (entry.isDirectory()) {
        await walk(child);
      } else {
        files.push(child);
      }
    }
  }

  await walk(directory);

  const inputs = files.filter((file) => file.href.endsWith(".input.txt"));
  const sidecars = files.filter((file) => file.href.endsWith(".expected.json"));
  const names = new Set(files.map((file) => file.href));

  if (inputs.length === 0) {
    throw new Error("Conformance corpus is empty");
  }

  for (const file of [...inputs, ...sidecars]) {
    const pair = file.href.endsWith(".input.txt")
      ? file.href.replace(/\.input\.txt$/, ".expected.json")
      : file.href.replace(/\.expected\.json$/, ".input.txt");

    if (!names.has(pair)) {
      throw new Error("Missing fixture pair: " + file.href);
    }
  }

  const cases = [];
  const ids = new Set<string>();

  for (const input of inputs.sort((a, b) =>
    a.href < b.href ? -1 : a.href > b.href ? 1 : 0,
  )) {
    const fixture = await loadFixture(
      input,
      new URL(input.href.replace(/\.input\.txt$/, ".expected.json")),
    );

    if (ids.has(fixture.expected.id)) {
      throw new Error("Duplicate case ID: " + fixture.expected.id);
    }

    ids.add(fixture.expected.id);
    cases.push(fixture);
  }

  return cases;
}
