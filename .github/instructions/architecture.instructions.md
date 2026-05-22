---
description: "Architecture guidance for modernizing a legacy JavaScript library into a clean, ESM-first TypeScript codebase."
applyTo: "**/*"
---

# Architecture Modernization

Use this guidance when auditing or redesigning a legacy JavaScript library for incremental TypeScript migration.

## Core Objectives

- Replace legacy JavaScript with modern TypeScript.
- Preserve backward compatibility whenever feasible.
- Modernize architecture, tooling, testing, linting, packaging, and developer experience.
- Eliminate technical debt and anti-patterns.
- Keep every migration step verifiable through automated CI.
- Replace fundamentally flawed implementations with clean, documented alternatives when needed.

## Global Engineering Standards

- Use strict TypeScript everywhere.
- Avoid `any` unless explicitly justified.
- Prefer composition over inheritance.
- Prefer pure functions and immutable patterns.
- Prefer ESM-first architecture.
- Remove dead code aggressively.
- Remove deprecated APIs.
- Eliminate hidden side effects.
- Avoid singleton state unless it is strictly required.
- Ensure deterministic builds.
- Ensure tree-shakeable exports.
- Use semantic versioning.
- Type and document every public API.
- Add tests for every module.

## Phase 1: Codebase Audit

Analyze and classify the codebase before large edits.

- Public APIs.
- Internal modules.
- Dependency graph.
- Circular dependencies.
- Dead code.
- Side effects.
- Global mutable state.
- CommonJS usage.
- Browser and Node coupling.
- Runtime assumptions.
- Unsafe dynamic behavior.

Produce an architecture report, a migration risk report, and a deprecated API inventory before major rewrites.

## Replace Legacy Patterns

Replace these patterns with modern equivalents:

- CommonJS -> ESM.
- Constructor functions -> classes or functions.
- Prototype mutation -> modules.
- Callbacks -> async/await.
- Mutable shared state -> isolated state containers.
- Deep inheritance -> composition.
- Utility god files -> domain modules.

## Safe Replacement Rules

If a legacy implementation has severe complexity, untestable behavior, implicit global state, race conditions, memory leaks, unsafe mutation, outdated patterns, poor performance, or impossible typing constraints:

1. Design a clean replacement.
2. Implement it from scratch.
3. Preserve the public contract when possible.
4. Add compatibility adapters if needed.
5. Document any breaking changes explicitly.

Do not preserve bad architecture purely for backward compatibility.

## Dependency and Module Design

- Keep dependency boundaries explicit.
- Avoid circular imports.
- Prefer small domain modules over large utility files.
- Keep browser-only and Node-only code separate.
- Make side effects obvious at module boundaries.
- Export stable, typed, documented entry points only.

## Packaging and Runtime Direction

- Prefer modern ESM packaging.
- Keep exports tree-shakeable.
- Avoid runtime patching and hidden globals.
- Keep builds deterministic and reproducible.

## Expected Final State

The final architecture must be maintainable, modular, typed, and compatible with modern tooling.
