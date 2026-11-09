import { readdir, readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { validateDocument } from "../src/validator/index.js";

const directory = new URL("../examples/", import.meta.url);
const files = (await readdir(directory)).filter((file) =>
  file.endsWith(".json"),
);

test("supported examples exist", () => {
  expect(files).toEqual(
    expect.arrayContaining([
      "minimal.json",
      "outsystems.json",
      "csharp.json",
      "javascript.json",
      "minimal-action.json",
      "multiple-actions.json",
      "typed-action.json",
      "calculate-discount.json",
    ]),
  );
});
test.each(files)("example: %s", async (file) => {
  expect(
    validateDocument(await readFile(new URL(file, directory), "utf8")),
  ).toEqual({ status: "valid", diagnostics: [] });
});
