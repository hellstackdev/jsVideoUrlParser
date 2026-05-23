# ESM Adapter Scaffold

This directory holds the first ESM-compatible wrapper layer for the parser.

Current shape:

- `index.mjs` re-exports the parser entry point.
- `base.mjs` exposes the shared parser instance from the CommonJS implementation.
- `register-providers.mjs` imports provider modules for their existing registration side effects.

This is intentionally a scaffold, not a full rewrite. The goal is to add ESM entrypoints first and then move provider logic in smaller feature branches.