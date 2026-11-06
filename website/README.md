# Documentation website

Docusaurus reads the existing `../doc/` directory. Do not duplicate specification sources here.

From the root, run `bun run docs:dev`, `bun run docs:typecheck`, and `bun run docs:build`. Install dependencies with `bun install --cwd website --frozen-lockfile`.

The site URL is a placeholder; no hosting or deployment is configured. Normal Markdown parsing is used for .md and MDX for .mdx. Broken links fail the build.
