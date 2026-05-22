---
description: "Testing and CI guidance for validating a legacy-to-TypeScript modernization through automated checks, coverage, and package verification."
applyTo: "**/*"
---

# Testing and CI Safety Net

Use this guidance to keep the modernization process continuously validated.

## Core Requirement

Every migration step must be validated through automated GitHub Actions before continuing.

## Phase 2: Establish CI Safety Net

Before changing implementation, create GitHub Actions workflows for:

- install
- lint
- typecheck
- test
- build
- coverage
- package validation

Run CI on pull requests, pushes to `main`, and release branches.

## Required Validation Stack

- Lint with `eslint` and TypeScript-aware linting.
- Typecheck with `tsc --noEmit`.
- Test with `vitest`.
- Validate package quality with `publint` and `are-the-types-wrong`.
- Validate dependencies with `npm audit` and `pnpm audit`.

## Phase 6: Testing Strategy

Create tests for:

- public APIs
- edge cases
- error handling
- async behavior
- regression scenarios
- serialization behavior
- platform compatibility

## Testing Rules

- Tests must not depend on implementation details.
- Prefer behavior-driven tests.
- Prefer unit tests over implementation-detail tests.
- Use integration tests for public APIs.
- Avoid brittle snapshots.
- Mock only external boundaries.

## Coverage Target

Maintain at least 90% line coverage and 90% branch coverage.

## Validation Order

After each change, prefer this order:

1. Narrow behavior-scoped test.
2. Narrow test for the touched slice.
3. Narrow compile, lint, or typecheck command.
4. `git diff` only when no executable validation exists.

Do not widen scope between the first substantive edit and the first focused validation.

## CI Expectations

- Keep CI green after every migration step.
- Fail fast on type or test regressions.
- Validate package metadata before release.
- Keep checks deterministic across supported Node.js LTS versions.

## Error and Regression Discipline

- Add tests before risky rewrites.
- Keep a regression test for every fixed migration issue when practical.
- Prefer clean redesign over patching broken legacy abstractions.
- Never leave the repository in a failing state.

## Expected Outcome

The codebase should ship with a durable automated safety net that catches type, test, packaging, and dependency regressions early.
