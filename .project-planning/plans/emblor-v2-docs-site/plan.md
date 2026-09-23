# Implementation Plan: Emblor v2 Documentation Site Rebuild

## Status

**Implementation underway.** This plan records the original Phase 6 requirements. Its Nextra-specific implementation choice was superseded by [DR-0044](../../decisions/0044-use-fumadocs-for-the-v2-documentation-site.md); the current website uses Fumadocs. Phase 5, beta readiness, and production cutover remain separate gates.

## Decision Traceability

- [Decision Manifest](./decision-manifest.md)
- [Decision Coverage](./coverage.md)
- [DR-0043 — Original Nextra proposal, superseded](../../decisions/0043-use-nextra-and-shadcn-for-the-v2-documentation-experience.md)
- [DR-0044 — Use Fumadocs for the v2 Documentation Site](../../decisions/0044-use-fumadocs-for-the-v2-documentation-site.md)

Status: Ready — all required obligations are covered.

## Feature Definition

Rebuild `website/` from its v1 all-in-one-component documentation into a modern Nextra documentation site, product homepage, shadcn registry, and installable example playground that consume the exact public npm prerelease as genuine external consumers. The result is a reviewed preview/deployment candidate, not the production v1-to-v2 cutover.

## Problem Statement

The current website still installs `emblor: latest`, imports the removed v1 `TagInput`, documents object tags and v1 styling/autocomplete/sort props, and embeds a duplicate v1 tag-input implementation. Its Contentlayer command emits a Node process error while returning success, metadata emits framework warnings, and the active navigation covers only seven v1-oriented pages.

Users need accurate runnable v2 guidance for the frozen compound API, state, validation, forms, accessibility, styling, composition, and migration. The site must also prove that advanced integrations remain consumer-owned and require no feature leakage into `packages/emblor`.

## Goals

- Consume exact public `emblor@2.0.0-alpha.1` from npm with machine-verifiable registry resolution.
- Remove all active v1 API examples and duplicate v1 runtime components.
- Upgrade the website to the latest stable mutually compatible Next.js, React, TypeScript, Tailwind CSS, Nextra, and shadcn releases supported by the repository's Node policy.
- Replace Contentlayer with Nextra and Nextra's docs theme while preserving App Router and Vercel deployment.
- Build `/`, `/docs/**`, and `/playground` as distinct product, learning, and exploration surfaces.
- Publish website-owned `@emblor/*` shadcn registry items that install styled compositions around the npm package without copying core.
- Build complete reference and runnable examples for all eight public parts and all major frozen behaviors.
- Provide practical controlled, uncontrolled, validation, paste, forms, accessibility, styling, polymorphism, and migration guidance.
- Demonstrate cmdk/Radix Popover, drag-and-drop, and form-library composition only in website code with direct website dependencies.
- Make examples typechecked and behavior-tested so documentation drift fails CI.
- Establish an intentional, distinctive Emblor visual direction with responsive and accessible behavior.
- Produce a stable preview deployment suitable for alpha feedback and later beta verification.
- Keep Phase 5 monitoring active and turn any discovered package defect into an issue-scoped finding.

## Non-Goals

- Changing `packages/emblor` public exports, props, types, ownership, or behavior.
- Adding autocomplete, suggestions, popovers, sorting, drag-and-drop, Tailwind, Shadcn, CVA, or form libraries to Emblor core.
- Publishing `alpha.2` or `beta.0`.
- Moving npm `latest` from v1.
- Replacing the production v1 documentation before the stable cutover plan.
- Building a v1 compatibility component.
- Upgrading package workspaces or adopting a new hosting platform merely because the website application is being modernized.
- Treating the temporary package playground as the permanent documentation experience.

## Current Architecture

- Next.js 14.2.3 App Router, React 18.3.1, Tailwind 3, local MDX content, Contentlayer, and Vercel.
- `website/package.json` declares `emblor: latest`, which is still v1 `1.4.8` on npm.
- `website/components/component-preview.tsx`, `form-demos.tsx`, and `components/tag/*` use or reproduce the removed v1 API.
- Active content consists of introduction, API, styling, variants, keyboard, React Hook Form, and Shadcn form pages.
- `pnpm -C website typecheck` and `lint` pass on the Phase 6 baseline.
- `pnpm -C website build` returns success but Contentlayer emits `ERR_INVALID_ARG_TYPE` and Next emits repeated `themeColor` metadata warnings. Phase 6 requires a clean build, not warning suppression.
- The v1 source line remains preserved on `1.x`; stale v1 website code does not need to remain active in the v2 preview.

## Design Direction

Subject: a headless React tag-input primitive. Audience: React engineers evaluating, adopting, or migrating Emblor. Primary job: move a reader from install to a correctly composed, accessible tag field without hiding behavior behind a styled mega-component.

Direction: **direct product thesis plus compound workbench**.

- Homepage inspiration: follow Input OTP's useful pattern—an immediate product claim, interactive field, install command, and code above the fold—without copying its branding, layout, or prose. A working Emblor composition is the hero, not a decorative illustration.

- Signature element: one live “anatomy bench” that displays the composed field beside its eight public parts and updates visible state/DOM attributes as the user interacts.
- Layout: customize Nextra's docs shell for restrained navigation and wide demo stages. The separate playground uses a catalog pattern inspired by Coss UI particles: discoverable examples, live UI, source code, and direct installation.
- Typography: choose a characterful but highly legible display face for section anchors, a neutral reading face for long documentation, and a monospace face for API/state evidence. Fonts must be locally or framework managed with no layout shift.
- Color: derive a compact named token set from the existing Emblor identity, then verify contrast in light and dark themes. Do not default to generic cream/editorial, neon-on-black, or gradient-dashboard aesthetics.
- Motion: one deliberate anatomy/state transition system; no scattered decorative animation. Respect `prefers-reduced-motion`.
- Structural labels encode real concepts: Root, committed value, draft, focus, rejection, and form output. Avoid decorative numbering with no sequence meaning.

Before broad page implementation, capture the final palette, typography, spacing, signature interaction, and desktop/mobile wireframes in the implementation review or a linked design brief. Critique for generic template patterns before coding the shell.

Design and platform references:

- [Input OTP](https://input-otp.rodz.dev/) — homepage communication pattern only.
- [Coss UI particles](https://coss.com/ui/particles) — playground discovery and example interaction pattern only.
- [Nextra docs theme](https://nextra.site/docs/docs-theme/start) — documentation foundation.
- [shadcn registry documentation](https://ui.shadcn.com/docs/registry/getting-started) — namespaced registry contract and CLI validation.

## Implementation Strategy

Work in one Phase 6 branch, but keep commits reviewable by concern:

```text
docs/v2-site
  1. external package and modern Nextra foundation
  2. homepage, docs shell, and reusable demo harness
  3. core reference and behavior guides
  4. accessibility/forms/styling guides
  5. shadcn registry and playground catalog
  6. external integrations, migration, automation, and evidence
```

Open a PR early for a stable Vercel preview. Do not merge or promote the preview to the production v1 site without a later explicit release/cutover decision.

## Files to Modify

Expected areas:

- `website/package.json`
- `pnpm-lock.yaml`
- `website/next.config.*`
- `website/theme.config.*`, `website/mdx-components.*`, and Nextra configuration
- `website/app/**`
- `website/components/**`
- `website/content/**` or Nextra page-map/route-local MDX files
- `website/config/**`
- `website/registry/**`, `website/registry.json`, and generated public registry artifacts
- `website/public/**`
- `website/tests/**` (new)
- `.github/workflows/ci.yml` and/or `code-check.yml`
- root scripts only where needed to expose website gates
- `.project-planning/plans/emblor-v2-docs-site/**`
- `.project-planning/roadmaps/emblor-v2-to-stable.md`
- `.project-planning/README.md`

Package source under `packages/emblor/src/**` is outside planned scope. A discovered defect stops the affected docs task and opens a Phase 5 finding rather than being fixed opportunistically in the docs PR.

## Implementation Tasks

### T-00 — Confirm Phase 5 docs-entry boundary

Decisions: DR-0005, DR-0012, DR-0041.

Obligations: DS/O-01.

- Use the recorded checkpoint as the entry gate.
- Recheck npm `next`, exact alpha.1 availability, open alpha-labeled findings, and current CI before implementation begins.
- Record any new critical/high finding and pause only affected work.

Verification: VT-00.

### T-01 — Make website a provable external npm consumer

Decisions: DR-0002, DR-0004, DR-0005, DR-0007, DR-0012.

Obligations: DS/O-02.

- Replace `emblor: latest` with exact `2.0.0-alpha.1` registry dependency.
- Regenerate lockfile without workspace linking.
- Add a resolver assertion that the website's installed package version is exact, has registry integrity, and resolves outside `packages/emblor`.
- Reject `workspace:`, `file:`, `link:`, Git, local tarball, `latest`, and semver-range substitutions.
- Run the website build in an isolated clean-install job that cannot resolve workspace source accidentally.
- Update the exact version deliberately when Phase 7 later provides beta.

Verification: VT-01, VT-12.

### T-02 — Upgrade the website platform and establish Nextra

Decisions: DR-0001, DR-0005, DR-0013, DR-0014, DR-0041, DR-0043.

Obligations: DS/O-03, DS/O-04, DS/O-17.

- Resolve the latest stable mutually compatible Next.js, React, React DOM, TypeScript, Tailwind CSS, Nextra, `nextra-theme-docs`, and shadcn versions at implementation start; record exact choices and migration notes.
- Keep Node 24 primary and Node 22 as the compatibility lane. Do not expand the repository Node policy merely to chase a newer runtime.
- Upgrade the website application to that version set, including Tailwind's current configuration model and the current ESLint/typecheck/build commands.
- Preserve Next App Router and current Vercel ownership for this phase.
- Replace Contentlayer with Nextra and `nextra-theme-docs`; configure MDX components, page maps, navigation, search, table of contents, metadata, and syntax highlighting through maintained APIs.
- Use shadcn for website-owned interface components and demos. Keep Tailwind, shadcn, Nextra, and all theme code out of `packages/emblor`.
- Remove Contentlayer-generated imports/config/dependencies after equivalent Nextra routing/navigation metadata works.
- Fix `themeColor` by using the supported viewport metadata contract.
- Delete or archive active v1-only preview/runtime code: `components/tag/*`, v1 `ComponentPreview`, and v1 form demos.
- Keep historical source reachable through `1.x` and migration links; do not carry dead v1 runtime into the active v2 build.
- Require clean Node 22 and Node 24 installs, typechecks, lints, and builds with no swallowed content-generation error or unsupported-framework warning.

Verification: VT-02, VT-12.

### T-03 — Finalize information architecture and visual brief

Decisions: DR-0001, DR-0005, DR-0016, DR-0043.

Obligations: DS/O-05, DS/O-18.

Create this final route and navigation contract:

```text
/
/docs
├── /docs/introduction
├── /docs/installation
├── /docs/anatomy
├── /docs/guides
│   ├── /styling
│   ├── /state-management
│   ├── /validation
│   ├── /constraints-and-interactions
│   ├── /forms
│   ├── /accessibility
│   ├── /keyboard-and-focus
│   ├── /composition-and-polymorphism
│   ├── /integrations
│   └── /migration
├── /docs/reference
│   ├── /api
│   ├── /troubleshooting
│   └── /examples
/playground
└── /playground/[slug] (optional deep links)
```

- Nextra navigation groups `/docs/**` into Getting Started, Guides, and Reference. `/docs` redirects to or renders the introduction without creating duplicate content.
- Installation covers the exact npm prerelease, npm/pnpm/yarn/bun commands as appropriate, peer requirements, framework notes, and shadcn registry configuration and install commands.
- Anatomy introduces all eight public parts before behavior-heavy guides.
- Examples may be indexed in Reference while their full interactive catalog remains the top-level `/playground` experience.

Produce design tokens and wireframes following the compound-workbench direction. Validate navigation labels against user tasks rather than internal file names.

Verification: VT-03.

### T-04 — Build homepage, documentation shell, and reusable demo harness

Decisions: DR-0005, DR-0016, DR-0041, DR-0043.

Obligations: DS/O-05, DS/O-14, DS/O-18.

- Build an original homepage inspired by Input OTP's directness: sharp product thesis, live accessible tag-input hero, visible install command, concise code sample, and clear Docs/Playground actions above the fold.
- Implement a customized Nextra responsive header, sidebar, page outline, previous/next navigation, search, footer, code copy, and theme handling.
- Build a typed v2 demo harness with preview/code tabs, reset support, visible event/form output, and isolated example state.
- Build the live anatomy bench as the signature interaction.
- Make examples keyboard-operable, screen-reader coherent, responsive, and reduced-motion safe.
- Use shadcn components where they improve website interaction, but restyle them into a coherent Emblor system rather than exposing a generic Nextra/shadcn starter.
- Avoid generic demo chrome that obscures consumer-owned markup and CSS.

Verification: VT-03, VT-04, VT-09, VT-12.

### T-05 — Document anatomy and complete public API

Decisions: DR-0007, DR-0017, DR-0021, DR-0023, DR-0034, DR-0041.

Obligations: DS/O-06, DS/O-13.

- Document Root, Label, TagList, Tag, TagText, Input, TagRemove, and Clear.
- For each part, include purpose, default element, `as`, ref, forwarded props, inherited context, required structure, state attributes, and behavioral precedence.
- Generate or validate public prop/type tables against published declarations rather than handwritten memory.
- Demonstrate static and render-function TagList forms and index integrity.
- Add compile fixtures for every displayed code sample.

Verification: VT-05, VT-11.

### T-06 — Document state ownership and mutation contracts

Decisions: DR-0003, DR-0015, DR-0020, DR-0022, DR-0039, DR-0041.

Obligations: DS/O-07.

- Provide minimal uncontrolled and fully controlled examples.
- Explain committed values, draft ownership, controlled refusal/divergence, external-value authority, ownership switching prohibition, and form reset behavior.
- Document mutation detail variants for add, add-many, remove, and clear.
- Demonstrate consumer-owned stable occurrence IDs when duplicates are enabled.

Verification: VT-06.

### T-07 — Document validation, constraints, paste, and blur

Decisions: DR-0009, DR-0010, DR-0019, DR-0024–DR-0026, DR-0030–DR-0032, DR-0036–DR-0038.

Obligations: DS/O-08.

- Explain exact candidate evaluation order and Unicode code-point length.
- Demonstrate `transform`, `validate`, structured `onReject`, controlled `invalid`, duplicate policy, min/max length, min/max tags, and all-or-nothing Clear.
- Demonstrate partial paste acceptance, prospective-draft selection behavior, literal delimiters, Enter/Tab policy, maxTags editability, and root-leaving blur behavior.
- Show visible error text and ARIA description wiring owned by consumer markup.

Verification: VT-07.

### T-08 — Document forms and accessibility contracts

Decisions: DR-0018, DR-0027–DR-0029, DR-0034–DR-0035, DR-0040.

Obligations: DS/O-09, DS/O-14.

- Provide native form examples for repeated values, required, reset, disabled, read-only, invalid focus, and bracketed names.
- Document label association, multiple labels, input/list structure, default removal labels, announcements, localization, suppression, and consumer descriptions/errors.
- Provide keyboard matrix covering Enter, optional Tab, Backspace/Delete, arrows, Home/End, Escape where applicable, IME composition, physical RTL behavior, and focus restoration.
- Add automated browser coverage and screen-reader-oriented manual acceptance notes.

Verification: VT-08, VT-12.

### T-09 — Document styling, polymorphism, and external integrations

Decisions: DR-0001, DR-0016, DR-0020, DR-0021, DR-0035, DR-0041.

Obligations: DS/O-10, DS/O-11, DS/O-14.

- Show plain CSS or CSS Modules as baseline consumer styling; Tailwind may style website examples but must be labeled consumer-owned.
- Demonstrate `className`, `style`, ARIA, `data-*`, native events, custom components, refs, and polymorphic native semantics.
- Build cmdk + Radix Popover suggestion composition without Emblor autocomplete props.
- Build drag-and-drop/reordering as consumer-controlled `string[]` updates without Emblor sortable exports.
- Keep React Hook Form example only if it adds value beyond native forms; show adapter state honestly.
- List every third-party dependency as website-only and scan package exports/dependencies for leakage.

Verification: VT-09, VT-11, VT-12.

### T-10 — Build the shadcn registry and playground catalog

Decisions: DR-0001, DR-0002, DR-0005, DR-0016, DR-0041, DR-0043.

Obligations: DS/O-11, DS/O-13, DS/O-19, DS/O-20.

- Define a public `@emblor` shadcn registry hosted by the website, with schema-valid index and item JSON artifacts generated from reviewable source.
- Make every registry item a consumer-owned styled composition that imports the published `emblor` package. Do not duplicate primitive internals, publish a compatibility component, or add registry code to package exports.
- Start with a coherent set of useful items: basic, controlled, validation, native form, accessibility/error, and at least one clearly labeled external-integration composition.
- Give each item a stable slug and install command such as `pnpm dlx shadcn@latest add @emblor/tag-input-basic`.
- Build `/playground` as a searchable/filterable catalog inspired by the interaction model of Coss UI particles, with live previews, source visibility, responsive preview widths, and stable deep links where useful.
- Each example's Install button opens a shadcn Sheet with package-manager-aware registry and package commands, registry configuration when required, copy actions, and manual-install fallback.
- Keep `/docs/reference/examples` as a curated index into the playground rather than maintaining a second divergent example implementation.
- Validate registry list/view/add behavior in clean temporary consumers and prove installed examples compile against exact public alpha.1.

Verification: VT-10, VT-11, VT-12.

### T-11 — Complete migration and content-integrity coverage

Decisions: DR-0001, DR-0002, DR-0005, DR-0007, DR-0041, DR-0042.

Obligations: DS/O-03, DS/O-06, DS/O-11, DS/O-12, DS/O-13.

- Expand package migration guidance into a navigable site migration path.
- Map v1 object values, active index, styling props, autocomplete, sorting, Shadcn/Tailwind coupling, subpaths, forms, and callbacks to v2 outcomes.
- Distinguish replaced behavior, consumer composition, and intentionally removed scope.
- Link a clearly labeled v1 historical source/docs location without making v1 code active in v2 navigation.
- Add broken-link, missing-page, duplicate-route, code-sample typecheck, and stale-symbol scans (`TagInput`, object `Tag`, v1 props, removed subpaths).

Verification: VT-11.

### T-12 — Add authoritative docs CI and acceptance gates

Decisions: DR-0004, DR-0013, DR-0014, DR-0016, DR-0041.

Obligations: DS/O-02, DS/O-04, DS/O-13, DS/O-14, DS/O-15, DS/O-17, DS/O-19, DS/O-20.

- Add website format, lint, typecheck, clean production build, exact-package resolution, code-sample compilation, link/content validation, registry validation, clean registry-consumer installation, and browser acceptance to CI.
- Run Node 22 and Node 24 for deterministic tooling/build compatibility; Node 24 remains primary.
- Test narrow/wide layouts, keyboard navigation, visible focus, reduced motion, light/dark contrast, forms, RTL, and representative integrations.
- Capture bundle/page-size baselines and reject accidental large regressions rather than inventing arbitrary targets.
- Require Vercel preview success and verify deployment consumes exact npm package.
- Ensure production v1 deployment does not cut over merely because preview succeeds.

Verification: VT-12.

### T-13 — Continue Phase 5 feedback during docs implementation

Decisions: DR-0012, DR-0041, DR-0042.

Obligations: DS/O-01, DS/O-16.

- Maintain a Phase 5 findings log for issues discovered through real docs examples.
- Reproduce historical issues against exact alpha.1 only when relevant to documented v2 behavior.
- Handle package defects through issue-scoped plans and separate package PRs.
- Do not hide package fixes inside the docs branch.
- Publish no alpha unless substantive fixes justify it.

Verification: VT-13.

### T-14 — Close Phase 6 and assess beta readiness

Decisions: DR-0005, DR-0012, DR-0041, DR-0042.

Obligations: DS/O-15, DS/O-16.

- Create `implementation-review.md` with obligation evidence, screenshots, preview URL, exact dependency proof, CI/browser/a11y results, content inventory, and known findings.
- Mark every coverage row Verified or record a blocking finding.
- Keep the v2 docs preview separate from production v1 until stable cutover approval.
- Repeat Phase 5 threshold review against latest alpha and completed docs preview.
- Recommend one outcome: create Phase 7 beta plan, continue Phase 5 with issue-scoped work, or publish another alpha for substantive fixes.
- Synchronize roadmap and planning index.

Verification: VT-14.

## Verification Tasks

### VT-00 — Docs-entry checkpoint

Confirm exact alpha.1 remains public/verified, no new critical/high v2 alpha defect blocks documentation, and Phase 5 monitoring remains active.

### VT-01 — External dependency identity

From clean install and CI, prove website resolves registry `emblor@2.0.0-alpha.1` with integrity and realpath outside workspace source. Fail on `latest`, ranges, workspace/file/link/Git sources, or version drift.

### VT-02 — Clean content pipeline

Run content generation, typecheck, lint, and production build on Node 22/24. No Contentlayer process error, swallowed failure, stale generated content, or unsupported metadata warning may remain.

### VT-03 — Information architecture and design acceptance

Review navigation completeness, content findability, visual tokens, typography, signature anatomy bench, desktop/mobile wireframes, contrast, focus, and reduced motion. Reject generic template choices not grounded in Emblor's compound model.

### VT-04 — Homepage, Nextra shell, and demo harness

Browser-test the homepage's live hero and install/code actions, Nextra navigation/search/table of contents, light/dark themes, mobile shell, preview/code/reset behavior, and anatomy bench. Confirm the result is original, Emblor-specific, and does not ship stock theme presentation unchanged.

### VT-05 — API/reference accuracy

Compare all documented exports, prop names, types, defaults, structure, refs, and examples against exact published declarations and frozen tests. Compile every displayed API example.

### VT-06 — State/mutation behavior

Browser-test controlled/uncontrolled examples, mutation details, occurrence identity, reset, and owner-controlled divergence. Compare results with frozen contracts.

### VT-07 — Validation/interaction behavior

Browser-test transformation, rejection reasons, lengths, duplicates, limits, partial paste, delimiter, selection, Tab, and blur examples with visible event output.

### VT-08 — Forms/accessibility behavior

Test native FormData order, reset, required/invalid focus, disabled/read-only, labels, descriptions, announcements, keyboard, IME safety, RTL, and focus restoration. Record screen-reader-oriented manual checks without claiming automated tests replace assistive-technology review.

### VT-09 — Styling/composition/integration boundary

Test forwarded DOM props, custom refs, polymorphism, responsive styles, cmdk/Popover suggestions, and drag-and-drop. Scan `packages/emblor` to prove no integration dependency/export/source change.

### VT-10 — Registry and playground acceptance

Validate registry schemas and hosted URLs, then run shadcn list/view/add flows in clean consumers. Compile installed examples against exact public alpha.1. Browser-test playground discovery, preview/code behavior, deep links, Install Sheet, copy actions, responsive widths, keyboard operation, and accessible dialog focus management.

### VT-11 — Migration/content integrity

Run link, route, stale-symbol, removed-subpath, migration mapping, and code-sample checks. Confirm no active v1 example is presented as v2.

### VT-12 — Full CI and preview acceptance

Require Node 22/24 website gates, package CI, browser acceptance, responsive screenshots, Vercel preview, exact npm resolution, and no production v1 cutover.

### VT-13 — Phase 5 findings control

Every docs-discovered package concern must have reproduction, severity, decision impact, owner, and disposition. No package behavior is silently changed by docs work.

### VT-14 — Phase 6 closure

Require all coverage Verified, a complete preview, synchronized planning, no hidden blocker, and an evidence-based next-phase recommendation.

## Data / State Changes

- Website dependency changes from v1 `latest` to exact public v2 alpha.1.
- Website platform moves to the selected latest stable Next.js/React/TypeScript/Tailwind/Nextra/shadcn set under the Node 22/24 policy.
- Active content/navigation changes from v1 API to v2 compound API.
- V1 duplicate runtime/demo code leaves active website build.
- Website gains hosted `@emblor` shadcn registry artifacts and a top-level playground catalog.
- Website gains durable tests, preview evidence, and exact registry-resolution assertions.
- npm dist-tags and package versions do not change.

## API / Contract Changes

None planned. Website examples consume the frozen contract. Any required package-contract change blocks the affected task and requires the DR-0041 supersession process.

## UI / UX Changes

- Original Input OTP-inspired product homepage with immediate live usage and installation.
- Customized Nextra documentation shell under the compound-workbench direction.
- Responsive `/playground` catalog with runnable preview/code examples and installation Sheets.
- Clear separation between Emblor core behavior and consumer-owned integrations.
- Production v1 site remains the cutover fallback until Phase 9.

## Migration Steps

1. Pin exact alpha.1 and prove npm registry resolution.
2. Resolve and lock the latest compatible website stack; migrate Next, React, TypeScript, Tailwind, Nextra, and shadcn under Node 22/24.
3. Establish Nextra content/navigation and remove Contentlayer.
4. Replace active v1 shell/demos/content incrementally with the homepage, docs routes, and v2 examples.
5. Build and validate the `@emblor` shadcn registry and `/playground` catalog.
6. Preserve migration/history links before deleting dead active v1 code.
7. Add automated content/example/registry/browser gates before declaring pages complete.
8. Produce preview and closure evidence without production cutover.

## Rollback Plan

- Keep production v1 docs unchanged during Phase 6; Vercel preview is primary acceptance surface.
- Revert docs commits independently by concern if content foundation or shell proves unsuitable.
- Restore previous website build from Git without changing npm or package source.
- If exact alpha.1 exposes a package defect, pause affected page, keep preview scoped, and use a separate Phase 5 fix plan.
- Never restore v1 code into `packages/emblor` as a docs rollback.

## Dependencies

- Public `emblor@2.0.0-alpha.1` and npm availability.
- Node 22 and Node 24.
- Latest stable mutually compatible Next.js, React, React DOM, TypeScript, Tailwind CSS, Nextra, Nextra docs theme, and shadcn releases selected at implementation start.
- Next.js App Router, Vercel preview, Nextra's supported MDX pipeline, and selected maintained syntax-highlighting plugins.
- Website-only integration libraries for selected examples.
- Phase 5 issue/feedback monitoring.

## Open Questions

None blocking plan execution. Exact dependency versions must be resolved and recorded at implementation start because “latest” is time-sensitive; they must be mutually compatible and pass Node 22/24 rather than being independently upgraded without proof. Production v1 archive URL and stable cutover mechanics remain Phase 9 decisions.

## Commit / PR Boundaries

Recommended coherent commits:

1. `build(website): consume exact v2 alpha and upgrade docs platform`
2. `feat(website): establish Nextra shell and product homepage`
3. `docs(website): document v2 primitives and behavior`
4. `docs(website): add forms accessibility and composition guides`
5. `feat(website): add shadcn registry and example playground`
6. `docs(website): add consumer-owned integration examples`
7. `test(website): add documentation registry and browser gates`
8. `docs(planning): close v2 docs rebuild`

Open one Phase 6 PR against `main`; preserve commits rather than squashing unrelated concerns into one giant commit. Do not merge or deploy to production without review of preview and cutover state.

## To-Dos

- [ ] T-00 — Confirm Phase 5 docs-entry boundary.
- [ ] T-01 — Make website a provable external npm consumer.
- [ ] T-02 — Upgrade the website platform and establish Nextra.
- [ ] T-03 — Finalize information architecture and visual brief.
- [ ] T-04 — Build homepage, documentation shell, and reusable demo harness.
- [ ] T-05 — Document anatomy and complete public API.
- [ ] T-06 — Document state ownership and mutation contracts.
- [ ] T-07 — Document validation, constraints, paste, and blur.
- [ ] T-08 — Document forms and accessibility contracts.
- [ ] T-09 — Document styling, polymorphism, and external integrations.
- [ ] T-10 — Build the shadcn registry and playground catalog.
- [ ] T-11 — Complete migration and content-integrity coverage.
- [ ] T-12 — Add authoritative docs CI and acceptance gates.
- [ ] T-13 — Continue Phase 5 feedback during docs implementation.
- [ ] T-14 — Close Phase 6 and assess beta readiness.

## Completion Gate

Phase 6 completes only when every coverage row is Verified; the modernized Nextra site builds on Node 22/24 from exact public v2 prerelease; `/`, the required `/docs/**` routes, and `/playground` are complete; `@emblor` registry items install into clean consumers; all core parts and major behaviors have accurate runnable examples; integrations remain website-only; accessibility/responsive/browser/content gates pass; migration guidance is complete; production v1 remains safely available; and the closure review gives an evidence-based beta or continued-alpha recommendation.
