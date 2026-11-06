import { expect, test } from "vitest";
import { loadFixture, matchesExpectation } from "./fixture.js";
import { validateDocument } from "../../src/validator/index.js";
import type { Expectation } from "./fixture.js";

test.each(["malformed", "parsed"])(
  "loads and checks independent sample %s",
  async (name) => {
    const fixture = await loadFixture(
      new URL("./samples/" + name + ".input.txt", import.meta.url),
      new URL("./samples/" + name + ".expected.json", import.meta.url),
    );

    expect(
      matchesExpectation(validateDocument(fixture.text), fixture.expected),
    ).toBe(true);
  },
);
test("rejects incomplete sidecars", async () => {
  await expect(
    loadFixture(
      new URL("./samples/parsed.input.txt", import.meta.url),
      new URL("./samples/invalid.expected.json", import.meta.url),
    ),
  ).rejects.toThrow("Invalid expectation sidecar");
});
test("checks status, severity, path, multiplicity and additional diagnostics", () => {
  const expected: Expectation = {
    id: "matcher",
    rules: ["HARNESS-001"],
    status: "invalid",
    diagnostics: [{ code: "X", severity: "error", path: "" }],
    allowAdditionalDiagnostics: false,
  };
  const d = {
    code: "X",
    severity: "error" as const,
    path: "",
    message: "wording ignored",
  };

  expect(
    matchesExpectation({ status: "invalid", diagnostics: [d] }, expected),
  ).toBe(true);
  expect(
    matchesExpectation({ status: "tool-error", diagnostics: [d] }, expected),
  ).toBe(false);
  expect(
    matchesExpectation(
      { status: "invalid", diagnostics: [{ ...d, severity: "warning" }] },
      expected,
    ),
  ).toBe(false);
  expect(
    matchesExpectation(
      {
        status: "invalid",
        diagnostics: [{ code: "X", severity: "error", message: "" }],
      },
      expected,
    ),
  ).toBe(false);
  expect(
    matchesExpectation({ status: "invalid", diagnostics: [d, d] }, expected),
  ).toBe(false);
  expect(
    matchesExpectation(
      { status: "invalid", diagnostics: [d, d] },
      { ...expected, allowAdditionalDiagnostics: true },
    ),
  ).toBe(true);
  expect(
    matchesExpectation(
      { status: "invalid", diagnostics: [d] },
      {
        ...expected,
        diagnostics: [...expected.diagnostics, ...expected.diagnostics],
      },
    ),
  ).toBe(false);
});
