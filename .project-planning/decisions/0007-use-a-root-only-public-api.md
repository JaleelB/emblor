# 0007 — Use a Root-Only Public API

## Status

Accepted

## Context

The provisional v2 package exposes `core`, `addons`, `sortable`, `utils`, `types`, and `testing` subpaths in addition to the package root. Most of these either contradict the accepted v2 scope or expose internal implementation details. Because the v2 package contains only the headless tag-input primitive, `emblor/core` would duplicate the meaning of `emblor`.

## Decision

Expose the supported v2 code API only from the `emblor` package root.

The root will export all supported `Emblor*` components and their public types. Retain `emblor/package.json` only as a metadata subpath. Remove the `emblor/core`, `emblor/types`, `emblor/utils`, `emblor/addons`, `emblor/sortable`, and `emblor/testing` public subpaths.

Keep `useEmblorContext`, store types, store helpers, controllable-state helpers, ref helpers, and other implementation utilities internal. A future public hook or subpath requires a new decision based on a demonstrated consumer use case.

## Alternatives Considered

- Keep `emblor/core` as an alias of the root.
- Keep separate `types` and `utils` subpaths.
- Expose `useEmblorContext` and store internals so consumers can build custom parts.
- Preserve all provisional subpaths for compatibility.

## Consequences

- Consumers have one documented import style: `import { ... } from 'emblor'`.
- Public prop and value types remain available without a type-only subpath.
- Internal architecture can evolve without treating store shapes and helper functions as semver contracts.
- The playground, tests, README, build entries, TypeScript paths, and package exports must switch to root imports.
- Package export tests should verify that intended symbols are present and removed subpaths are unavailable.

## Related Files

- `packages/emblor/package.json`
- `packages/emblor/tsup.config.ts`
- `packages/emblor/tsconfig.json`
- `packages/emblor/src/index.ts`
- `packages/emblor/src/core/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/utils/index.ts`
- `packages/emblor/playground/`
- `packages/emblor/tests/`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The provisional v2 multi-entry export map.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11. The `emblor/package.json` metadata export is not considered a public code entry point.
