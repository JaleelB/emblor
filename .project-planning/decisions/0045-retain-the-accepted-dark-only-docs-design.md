# 0045 — Retain the accepted dark-only documentation design

## Status

Accepted on 2026-11-12 by Jaleel.

## Context

The accepted documentation redesign forces dark mode and removes theme switching. Older Phase 6 QA requirements and screenshot names still imply light-mode support. Jaleel explicitly confirmed that the accepted dark-only implementation should be preserved and committed/pushed.

## Decision

Preserve the current dark-only homepage, documentation, and playground. Replace the earlier dual-theme acceptance requirement with desktop/mobile review of the actual dark-only product. Remove obsolete light screenshot baselines and do not describe duplicate dark captures as successful light-mode validation.

Keep responsive, contrast, forced-colors, reduced-motion, keyboard, and screen-reader obligations. Product/design approval does not close unperformed technical or manual checks.

## Alternatives Considered

- Restore light-mode support and a theme switch; rejected in favor of the accepted design.
- Retain misleading light-named snapshots; rejected because they do not verify light mode.

## Consequences

Current visual coverage contains 34 dark desktop/mobile captures instead of 54 dual-theme captures. Historical QA evidence remains dated and unchanged. This decision changes website presentation acceptance only; it does not change any package contract or release gate.

## Related Files

- `website/app/layout.tsx`
- `website/components/fumadocs-provider.tsx`
- `website/tests/visual.spec.ts`
- `.project-planning/plans/emblor-v2-docs-site/`
- `.project-planning/plans/emblor-v2-beta-release/`

## Supersedes

The Phase 6 plan/checklist requirement to validate both light and dark presentation.

## Superseded By

None.
