# TypeScript Modernization

This document guides the incremental introduction of TypeScript to `jsVideoUrlParser`.

## Current State (Phase 1)

The codebase now includes:

- **tsconfig.json**: Strict TypeScript configuration using `"strict": true` and `"noEmit"` mode.
- **typecheck script**: `pnpm typecheck` validates all source files without generating output files.
- **Type checking in CI**: Type checking added to `pnpm check` and `pnpm all` commands.

## Baseline

The existing CommonJS codebase (`lib/**/*.js`) passes TypeScript type checking with zero errors. This is because:

1. Most files have no explicit type annotations
2. TypeScript's type inference is sufficient for CommonJS patterns
3. No circular dependencies or problematic patterns detected

## Next Steps

### Phase 2: Type Annotations for Public APIs

Add explicit type annotations to:

- `lib/index.js` (main entry point and exports)
- `lib/base.js` (parser core)
- `lib/urlParser.js` (URL parsing logic)
- Provider base class and registration

### Phase 3: Provider Module Types

Create JSDoc `@typedef` or inline type annotations for provider interface:

```javascript
/**
 * @typedef {Object} VideoInfo
 * @property {string} id - The video ID
 * @property {string} mediaType - The type of media (video, audio, etc)
 * @property {string} provider - The provider name (youtube, vimeo, etc)
 */
```

### Phase 4: Gradual TypeScript File Conversion

Once all CommonJS modules have clear type annotations:

1. Rename `lib/*.js` → `lib/*.ts`
2. Update imports to ESM syntax
3. Add explicit type annotations
4. Regenerate `.d.ts` files

### Phase 5: ESM Source

Convert to native ESM modules using TypeScript's `"module": "esnext"`.

## Commands

- `pnpm typecheck`: Validate types without generating output
- `pnpm check`: Run tests, build, and type checking
- `pnpm all`: Full validation suite including audit, lint, typecheck

## Guidelines

- **Do not rewrite** existing CommonJS code unless necessary
- **Use incremental adoption**: JSDoc annotations first, then `.ts` conversion
- **Preserve backward compatibility** through dual CommonJS + ESM exports
- **Keep strict mode enabled**: All new code must pass strict TypeScript checking

## Type Definition Files

The library's `.d.ts` files are auto-generated from source via Rollup during build. As the codebase gains explicit type annotations, these declarations will become more precise.
