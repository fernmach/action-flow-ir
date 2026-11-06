import { expect, test } from "vitest";
import { loadCorpus } from "./harness/corpus.js";
import { matchesExpectation } from "./harness/fixture.js";
import { validateDocument } from "../src/validator/index.js";

const cases = await loadCorpus(new URL("./conformance/", import.meta.url));

test.each(cases)("conformance: $expected.id", ({ text, expected }) => {
  expect(matchesExpectation(validateDocument(text), expected)).toBe(true);
});
