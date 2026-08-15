# 0041 — Freeze the Emblor v2 Vertical-Slice Architecture

## Status

Accepted

## Context

The Emblor v2 vertical slice implements the accepted decisions DR-0001 through DR-0040. Its coverage matrix contains 64 Required obligations, all of which are now `Verified`.

The freeze review includes:

- package formatting, lint, typecheck, tests, production build, export, and tarball-content gates
- 51 passing unit and integration tests under Node 22 and Node 24
- isolated packed consumers using React 18.3.1 and React 19.1.1, each compiling the public declarations and mounting the package in a client DOM
- browser acceptance for controlled and uncontrolled use, forms, accessibility, LTR/RTL focus behavior, narrow and wide layouts, and polymorphic composition
- focused coverage for portals, Strict Mode, structural registration, selection restoration, blur boundaries, sparse indexes, controlled acknowledgement/refusal/divergence, ownership switching, and external-value authority

Jaleel directed that the architecture be frozen once every Required coverage row was Verified and the final evidence-based review passed. Those conditions were satisfied on 2026-08-12.

## Decision

Freeze the Emblor v2 vertical-slice architecture represented by DR-0001 through DR-0040 and the verified implementation plan.

The frozen boundary includes:

- one published `emblor` package with a root-only public API
- the eight public compound parts: Root, Label, TagList, Tag, TagText, Input, TagRemove, and Clear
- public `string[]` tag values with consumer-owned occurrence identity
- Root ownership of tag state, draft state, mutation coordination, form participation, validation state, announcements, focus restoration, and private registrations
- the accepted controlled/uncontrolled contracts and the single metadata-rich `onValueChange` mutation callback
- candidate evaluation, paste, keyboard, blur, directionality, focus, form, accessibility, polymorphism, and DOM-prop-forwarding behavior defined by the accepted decisions
- exclusion of v1 compatibility components, autocomplete/suggestions, sortable/drag-and-drop, styling runtime, and feature subpath exports from the core slice
- React 18/19 compatibility and Node 22/24 repository verification policy

During alpha, the following remain changeable without superseding this decision, provided all frozen behavior and coverage remain intact:

- private implementation details and internal file organization
- performance improvements and refactoring
- additional regression tests and compatibility fixtures
- acceptance-lab styling and non-contractual presentation
- documentation clarification that does not change semantics
- prerelease versioning, release automation, and packaging metadata consistent with DR-0012 through DR-0014
- bug fixes that restore an already accepted contract

Any change to public exports, public types or props, state ownership, mutation semantics, keyboard/focus behavior, native-form behavior, accessibility guarantees, polymorphic semantics, package boundaries, or excluded-feature scope requires a new accepted decision that supersedes the affected record, followed by plan and coverage resynchronization.

## Alternatives Considered

- Continue treating the architecture as provisional despite complete verification.
- Freeze only the component names while leaving behavioral contracts open.
- Declare the package semver-stable rather than architecture-frozen for alpha.

## Consequences

- Alpha implementation and release work can proceed against a stable architectural target.
- Verification hardening becomes a maintained regression boundary rather than a one-time review artifact.
- New capabilities can be planned independently without leaking into the frozen core slice.
- Necessary architectural corrections remain possible, but require an explicit superseding decision and traceability update.
- This decision does not claim that the v1 website migration or unrelated future features are complete.

## Related Files

- `.project-planning/plans/emblor-v2-vertical-slice/plan.md`
- `.project-planning/plans/emblor-v2-vertical-slice/coverage.md`
- `.project-planning/plans/emblor-v2-vertical-slice/implementation-review.md`
- `packages/emblor/src/`
- `packages/emblor/tests/`
- `packages/emblor/playground/`
- `packages/emblor/package.json`
- `.github/workflows/ci.yml`

## Related Plan

`.project-planning/plans/emblor-v2-vertical-slice/plan.md`

## Supersedes

None.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-12 after the final evidence-based review. Architecture freeze is narrower than semver stability: alpha fixes may continue within the boundary defined above.
