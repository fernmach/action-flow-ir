import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import prettier from "eslint-config-prettier/flat";

export default defineConfig(
  globalIgnores([
    "**/node_modules/**",
    "dist/**",
    "coverage/**",
    ".vitest/**",
    "website/build/**",
    "website/.docusaurus/**",
  ]),
  {
    files: ["eslint.config.mjs"],
    extends: [js.configs.recommended],
  },
  {
    files: [
      "src/**/*.ts",
      "tests/**/*.ts",
      "vitest.config.ts",
      "website/**/*.ts",
      "website/**/*.tsx",
    ],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  prettier,
  {
    files: [
      "eslint.config.mjs",
      "src/**/*.ts",
      "tests/**/*.ts",
      "vitest.config.ts",
      "website/**/*.ts",
      "website/**/*.tsx",
    ],
    plugins: { "@stylistic": stylistic },
    rules: {
      curly: ["error", "all"],
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "always", prev: "*", next: ["const", "let", "var"] },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: "*",
          next: [
            "function",
            "class",
            "interface",
            "type",
            "export",
            "block-like",
            "return",
          ],
        },
        {
          blankLine: "always",
          prev: [
            "function",
            "class",
            "interface",
            "type",
            "export",
            "block-like",
          ],
          next: "*",
        },
      ],
    },
  },
);
