# ADR-003: Type-aware implementation linting

Status: accepted
Date: 2026-11-06
Related iteration: [ITER-000a](../development/iterations/000a-eslint.md)
Supersedes: ADR-002's preservation of root TypeScript 7 only.

## Context and options

The user selected ESLint plus typescript-eslint after comparing ESLint, Biome and Oxlint. TypeScript checking alone does not enforce the selected type-aware code-quality rules. Root TypeScript 7.0.2 was outside typescript-eslint's [documented supported range](https://typescript-eslint.io/users/dependency-versions/) of >=4.8.4 and <6.1.0 at configuration time.

## Decision

Install pinned root development dependencies ESLint 10.14.0, @eslint/js 10.0.1 and typescript-eslint 8.72.1. Align root TypeScript to 6.0.2, matching the website baseline and avoiding unsupported-version warnings. Keep separate root/website package installs and lockfiles.

Use a root `eslint.config.mjs`, the recommended JavaScript and recommended type-checked TypeScript presets, and TypeScript project service to locate each source file's project. Apply to maintained source, tests, Vitest configuration and website TypeScript/TSX. Lint the JavaScript config without requiring type information. Exclude dependency and generated directories globally.

Expose `lint` and `lint:fix`; fail on warnings and run lint first in `check`, automatically extending the existing CI workflow. Fix findings in code rather than disabling recommended rules globally.

## Consequences

Compiler upgrades must consider linter compatibility. Parsed JSON remains `unknown` until checked; startup package metadata now receives an explicit runtime version guard. No IR semantic rules change. React-specific lint plugins and formatting are outside this increment. Tests and documentation builds remain independent checks.
