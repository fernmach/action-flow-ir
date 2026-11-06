import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['**/node_modules/**', 'dist/**', 'coverage/**', '.vitest/**', 'website/build/**', 'website/.docusaurus/**']),
  {
    files: ['eslint.config.mjs'],
    extends: [js.configs.recommended],
  },
  {
    files: ['src/**/*.ts', 'tests/**/*.ts', 'vitest.config.ts', 'website/**/*.ts', 'website/**/*.tsx'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
