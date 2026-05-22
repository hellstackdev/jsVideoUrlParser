# Migration Audit

Branch: `feature/esm-audit`

## Current State

- The runtime source is still CommonJS-heavy.
- `lib/` contains many `require(...)` and `module.exports` entrypoints.
- The package surface already has explicit exports for the root entry and `lib/*` deep imports.
- The build toolchain is modern enough to support a staged migration.

## Evidence

- The `lib/` tree contains 118 CommonJS markers in the current scan.
- Provider modules still self-register through top-level imports.
- Test files mirror the same CommonJS import style.

## Migration Risks

- A direct `type: module` flip would break the current bundle and provider registration model.
- Deep import compatibility must be preserved until consumers are moved.
- Provider side effects must remain intact during any bundler change.

## Recommended Next Feature Branches

1. `feature/esm-adapter` - add ESM-compatible entrypoints while keeping CommonJS behavior.
2. `feature/typescript-skeleton` - introduce `tsconfig` and typed source scaffolding without rewriting all providers.
3. `feature/provider-module-split` - isolate provider registration from parser logic to reduce side effects.

## Near-Term Goal

Keep `develop` as the integration branch and continue modernization in feature branches only until the module boundary is stable enough for a deeper ESM/TypeScript rewrite.
