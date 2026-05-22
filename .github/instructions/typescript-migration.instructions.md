---
description: "TypeScript migration guidance for incrementally modernizing a legacy JavaScript library with strict typing and compatibility safeguards."
applyTo: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.mjs, **/*.cjs"
---

# TypeScript Migration Plan

Use this guidance when converting a legacy JavaScript library to modern TypeScript.

## Migration Goals

- Replace legacy JavaScript with modern TypeScript.
- Preserve backward compatibility whenever feasible.
- Modernize tooling, packaging, and developer experience alongside code.
- Keep the migration incremental, verifiable, and production-safe.

## Required TypeScript Configuration

Keep TypeScript strict. Do not weaken compiler settings to bypass migration issues.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true,
    "declaration": true,
    "sourceMap": true,
    "isolatedModules": true,
    "skipLibCheck": false
  }
}
```

## Initial Migration Rules

- Rename files gradually: `.js` -> `.ts`, `.jsx` -> `.tsx`.
- Start with leaf modules.
- Avoid large uncontrolled rewrites.
- Preserve green CI after every migration step.

## Migration Requirements For Each File

- Eliminate implicit `any`.
- Define explicit exports.
- Define input and output types.
- Eliminate mutation where possible.
- Remove legacy prototype patterns.
- Remove callback hell.
- Replace promise chains with async/await.
- Remove dynamic runtime patching.
- Replace magic strings with enums or constants.
- Replace utility duplication with shared modules.

## Dependency and Tooling Standards

- Use strict TypeScript everywhere.
- Prefer ESM-first architecture.
- Use `tsc --noEmit` for type validation.
- Use modern build tooling such as `tsup`, `unbuild`, or Vite library mode.
- Avoid legacy Babel-only pipelines unless strictly required.

## Package Modernization

Use a modern package layout similar to this:

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

## Dependency Cleanup

- Remove abandoned packages.
- Remove deprecated packages.
- Remove duplicate utilities.
- Remove unnecessary polyfills.
- Remove outdated transpilers.
- Prefer native platform APIs and lightweight maintained libraries.

Require a justification for every new dependency, including maintenance quality, bundle impact, and security impact.

## Unsafe Implementation Replacement

If a legacy implementation has severe complexity, untestable behavior, implicit global state, race conditions, memory leaks, unsafe mutation, outdated patterns, poor performance, or impossible typing constraints, replace it with a clean implementation instead of patching around it.

## Documentation Requirements

Generate or update:

- migration guide
- API reference
- architecture documentation
- contribution guide
- release process
- changelog

Every public function must include parameter docs, return docs, examples, and error behavior.

## Code Quality Enforcement

Reject code that:

- disables TypeScript strictness
- introduces `any`
- bypasses lint rules
- reduces test coverage
- introduces hidden side effects
- adds untyped exports
- mixes concerns excessively
- introduces circular dependencies

## Expected Final State

The final codebase must be fully TypeScript, strict, typed, maintainable, and compatible with modern ESM tooling.
