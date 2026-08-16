# 0042 — Use `main` for v2 Prereleases and Preserve v1 on `1.x`

## Status

Accepted

## Context

Emblor v1 remains published as `emblor@1.4.8` under npm `latest`. The frozen v2 implementation and prepared `2.0.0-alpha.0` release candidate currently live on `feat/emblor-v2-refactor`, while the repository default branch still contains v1 and an automatic token-oriented publish workflow.

Keeping v2 on one long-lived feature branch through alpha and beta would increase branch drift and make the eventual stable integration riskier. Merging v2 into `main` does not itself publish a package or change npm dist-tags. Existing v1 users still need a recoverable source line, but the stale v1 architecture must not consume the v2 rollout through broad maintenance work.

The repository also has old v1 issues and pull requests concerning autocomplete, sortable behavior, Tailwind/Shadcn styling, packaging, React compatibility, keyboard behavior, and other v1 contracts. Some are resolved or intentionally removed by v2; others remain legitimate historical v1 reports.

## Decision

Before integrating v2, create and push a `1.x` branch from the current v1 `main` tip. Treat `1.x` as a maintenance-only source line:

- no new features, architectural redesign, or work to make v1 conform to the v2 headless contract;
- no routine v1 bug-fix program during the v2 rollout;
- only a confirmed security vulnerability, systemic installation failure, or comparably critical regression may justify a v1 patch;
- every v1 patch requires its own bounded review, CI evidence, and deliberate release runbook;
- npm `latest` remains on v1 throughout alpha and beta unless a later accepted release decision says otherwise.

Triage existing v1 issues and pull requests without reopening v1 implementation scope. Reply with current project status, classify reports as v1-only, addressed by v2, intentionally out of v2 scope, invalid, or requiring verification, and close obsolete feature work or incompatible pull requests with migration context. Keep genuine unresolved v1 defects visible when closure would incorrectly claim they are fixed.

Replace the old automatic `main` publish workflow with the prepared manually dispatched OIDC workflow before integrating the full v2 branch. Installing this workflow on `main` does not authorize a publication by itself; publication still requires an exact SHA/version, successful CI, registry checks, protected `npm` environment approval, and explicit user authorization.

Integrate the reviewed v2 alpha candidate into `main`. Afterward, use short-lived branches targeting `main` for alpha fixes, documentation, beta preparation, stabilization, and stable release work. The final merge commit or later approved `main` commit—not the pre-integration feature-branch SHA—becomes the immutable alpha publication candidate after all required gates pass.

The exact v1 sunset duration and npm deprecation timing remain a later stable-release policy decision. Stable v2 will not include a v1 compatibility component.

## Alternatives Considered

- Keep all v2 alpha and beta work on `feat/emblor-v2-refactor` until stable.
- Merge v2 into `main` without preserving a v1 maintenance branch.
- Resume active v1 feature and bug-fix development before publishing v2.
- Leave the automatic token-oriented publish workflow on `main` during integration.
- Close every old v1 issue as fixed by v2, even when v2 only removes or replaces the affected feature.

## Consequences

- `main` becomes the v2 development and prerelease source line, while npm `latest` can continue serving v1.
- `1.x` preserves v1 source and creates an explicit boundary for rare critical patches without burdening v2.
- Existing issue reporters receive clear disposition instead of silence, but stale v1 work cannot delay alpha publication.
- The workflow-only change must reach `main` before the v2 integration PR.
- The integration PR must review the four current `main`-only commits and reject any accidental reintroduction of v1 coupling.
- Merging or pushing code remains non-publishing; npm mutation stays a separate protected Phase 4 action.
- Final stable v1 support and deprecation messaging still require a later accepted decision.

## Related Files

- `.github/workflows/publish.yml`
- `.project-planning/plans/emblor-v2-alpha-release/plan.md`
- `.project-planning/plans/emblor-v2-alpha-release/transition-runbook.md`
- `.project-planning/roadmaps/emblor-v2-to-stable.md`
- `packages/emblor/`

## Related Plan

`.project-planning/plans/emblor-v2-alpha-release/plan.md`

## Supersedes

The provisional operational assumption that v2 prereleases should remain on one long-lived feature branch until stable.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-15. This decision changes release-branch policy, not the frozen v2 package architecture in DR-0041.
