---
description: "Release and packaging guidance for modern TypeScript library modernization, CI validation, and automated publishing readiness."
applyTo: "**/*"
---

# Release and Packaging Guidance

Use this guidance when preparing a modernized library for release.

## Phase 7: Package Modernization

Modernize package configuration to support ESM-first publishing and typed entry points.

Use this shape as the baseline:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "types": "./dist/index.d.ts",
  "sideEffects": false
}
```

## Phase 8: Dependency Cleanup

- Remove abandoned packages.
- Remove deprecated packages.
- Remove duplicate utilities.
- Remove unnecessary polyfills.
- Remove outdated transpilers.
- Prefer native platform APIs and lightweight maintained libraries.

Every dependency addition must justify maintenance quality, bundle impact, and security impact.

## Phase 9: Performance Optimization

Measure before optimizing.

Validate:

- bundle size
- cold start
- memory usage
- execution hotspots

Apply:

- lazy loading
- code splitting
- memoization where justified
- algorithmic improvements
- tree shaking

Never optimize prematurely.

## Phase 10: Documentation Modernization

Generate:

- migration guide
- API reference
- architecture documentation
- contribution guide
- release process
- changelog

Every public function must include parameter docs, return docs, examples, and error behavior.

## Pull Request Rules

Every PR must:

- stay focused and atomic
- include tests
- include migration rationale
- pass all GitHub Actions checks
- avoid unrelated formatting noise
- preserve backward compatibility unless documented

## Commit Conventions

Use conventional commits:

- `feat:`
- `fix:`
- `refactor:`
- `perf:`
- `test:`
- `docs:`
- `build:`
- `ci:`

## Expected Final State

The repository should be ready for deterministic releases, typed public APIs, automated validation, and long-term maintainability.
