# 0001 — Emblor v2 Is a Headless Tag Input and a Hard Break

## Status

Accepted

## Context

Emblor v1 combined tag-input behavior, Shadcn-oriented markup and styling, autocomplete, popovers, sorting, and several UI dependencies in a large component. The v2 direction recorded in `project-status/HANDOFF.md` narrows the library to a composable primitive.

## Decision

Emblor v2 will be a headless tag-input primitive. The library owns tag state, validation, focus, keyboard behavior, and accessibility behavior. Consumers own markup, styling, and optional integrations.

Version 2 is a deliberate breaking release. It will not ship a compatibility `TagInput` component.

The package will not include autocomplete, cmdk, drag-and-drop, sorting, Shadcn components, Tailwind classes, CVA variants, or a built-in styling layer. Optional integrations belong in examples or future documentation rather than package exports.

## Alternatives Considered

- Continue evolving the v1 mega-component.
- Preserve a v1-compatible component alongside the compound API.
- Ship optional features as first-party addon and sortable modules.

## Consequences

- The v2 package surface stays small and dependency-light.
- Consumers must compose presentation and advanced integrations themselves.
- A migration guide is required because existing v1 usage will not compile unchanged.
- Scope additions require an explicit decision rather than being inferred from v1 behavior.

## Related Files

- `project-status/HANDOFF.md`
- `packages/emblor/src/core/`
- `packages/emblor/package.json`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The v1 product and component architecture.

## Superseded By

None.

## Notes

Captured from the handoff's locked decisions and non-goals on 2026-08-11.
