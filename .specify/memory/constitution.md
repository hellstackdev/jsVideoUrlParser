# jsVideoUrlParser Constitution

## Core Principles

### I. Spec Before Code
Every non-trivial change starts with a feature spec and acceptance scenarios before implementation. Pull requests should map code changes to documented requirements and success criteria.

### II. Backward Compatibility First
Public parsing/creation behavior and package entry points must remain compatible unless explicitly approved as a breaking change in a dedicated spec.

### III. Test-Driven Modernization
Modernization work (tooling, build, packaging) must preserve existing behavior and be validated with repository test and build scripts.

### IV. Incremental, Reviewable Changes
Large upgrades are delivered in small, independently reviewable steps (spec, plan, tasks, implementation) to reduce regression risk.

### V. Secure and Minimal Dependencies
Prefer existing dependencies and keep additions minimal; new tooling choices must be justified in specs and assessed for maintenance/security impact.

## Technical Constraints

- The project remains a JavaScript library focused on URL parsing and creation across providers.
- Any build-tool migration (including Vite+) must preserve current distributable outputs and consumer usage paths during transition.
- Type definitions and runtime behavior must stay aligned.

## Development Workflow

1. Create/update constitution when governance changes.
2. Create a feature spec with prioritized user stories and measurable success criteria.
3. Produce implementation plan and tasks from the approved spec.
4. Implement incrementally with tests/build validation and PR traceability to requirements.

## Governance

This constitution is the top-level process authority for project development practices. Amendments require a pull request that updates this file and includes rationale in the related spec/plan artifacts.

**Version**: 1.0.0 | **Ratified**: 2026-05-21 | **Last Amended**: 2026-05-21
