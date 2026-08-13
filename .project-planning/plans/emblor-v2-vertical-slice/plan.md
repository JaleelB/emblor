# Implementation Plan: Emblor v2 Vertical Slice

## Status

Complete and architecture-frozen. All 64 Required obligations are Verified, the final evidence review passed, and DR-0041 records the accepted freeze boundary.

## Feature Definition

Build one complete, production-shaped Emblor v2 tag-input slice using the accepted compound API:

```tsx
<EmblorRoot>
  <EmblorLabel />
  <EmblorTagList>
    {(tag, index) => (
      <EmblorTag index={index}>
        <EmblorTagText />
        <EmblorTagRemove />
      </EmblorTag>
    )}
  </EmblorTagList>
  <EmblorInput />
  <EmblorClear />
</EmblorRoot>
```

The slice includes package cleanup, the public API and type surface, controlled and uncontrolled state, tag mutation and validation, keyboard/focus behavior, native forms, accessibility, polymorphism, automated verification, and a temporary visual acceptance lab.

## Problem Statement

The repository contains a promising provisional core, but it does not implement the accepted architecture. The source still exposes obsolete subpaths and callbacks, uses two focus indexes, places draft control on Input, lacks Label and TagText, has incomplete form and announcement behavior, and retains abandoned packages and demos.

The accepted decisions are durable but not yet represented by one executable slice that can be inspected as a whole. Implementing isolated pieces without an acceptance surface would make it difficult to judge whether the architecture feels coherent before freezing it.

## Goals

- Make the accepted root-only `emblor` API compile and work end to end.
- Give controlled and uncontrolled consumers the same compound rendering model.
- Implement the complete mutation, validation, rejection, paste, blur, focus, form, and accessibility contracts.
- Guarantee headless styling through native prop forwarding and type-safe `as` polymorphism.
- Remove obsolete package layouts, exports, dependencies, and integration demos.
- Prove the contract through runtime, browser, type, export, and compatibility tests.
- Provide a visual acceptance lab that exposes state and event behavior while exercising the real package.
- Create an explicit review gate before declaring the architecture frozen.

## Non-Goals

- No autocomplete, cmdk, popover, drag-and-drop, sorting, Shadcn, Tailwind, CVA, or styling runtime in the package.
- No v1 compatibility component.
- No public context, store, utility, testing, addon, sortable, or core subpath.
- No v2 website rebuild in `website/`.
- No npm publication or stable-v2 promotion in this plan.
- No permanent product-storybook commitment; the acceptance lab remains a temporary package-development tool.
- No visual styling API inferred from the acceptance lab's CSS.

## Current Architecture

- `packages/emblor/src/core/` contains the provisional compound implementation.
- Root currently stores `{id, value}` records internally, exposes legacy callbacks and focus controls, and only partially forwards DOM props.
- Input currently owns an independent controlled draft API and uses obsolete delimiter and autocomplete ARIA behavior.
- TagList does not render Root-owned values; Label and TagText do not exist.
- TagRemove repeats `index`; Clear is still named `EmblorClearTrigger`.
- `packages/emblor/package.json` and `tsup.config.ts` still expose multiple obsolete subpaths.
- Six abandoned `packages/*` package directories remain tracked.
- The playground still demonstrates addons, sortable, cmdk, and Radix compositions against the provisional API.
- Existing tests cover only a small subset of the accepted behavior.

## Target Architecture

```text
emblor (single public package root)
└── EmblorRoot — state, constraints, forms, announcements, coordination
    ├── EmblorLabel* — automatic naming and input focus
    ├── EmblorTagList? — one renderer over Root-owned string[]
    │   └── EmblorTag[index]* — positional/focus boundary
    │       ├── EmblorTagText* — exact current string
    │       └── EmblorTagRemove* — inherits private tag context
    ├── EmblorInput! — exactly one draft editor and focus target
    └── EmblorClear* — all-or-nothing clear action

! exactly one     ? zero or one     * repeatable where context permits
```

State and event flow:

```text
native input/paste/blur/action
        ↓ consumer handler runs first
canonical candidate: trim → transform → built-in constraints → validate
        ├── rejected → transient invalid + onReject + live announcement
        └── accepted → one next string[] + onValueChange(details)
                                  ↓
                    uncontrolled commit or controlled request
                                  ↓
                 render → form values → focus restoration
```

## Decision Traceability

- [Decision Manifest](./decision-manifest.md)
- [Decision Coverage](./coverage.md)
- [Implementation Review and Architecture Freeze](./implementation-review.md)

Traceability status: **Complete — coverage is synchronized at 64/64 Verified, and DR-0041 freezes the reviewed architecture.**

## Implementation Strategy

Implement from the outside inward:

1. Remove competing package layouts and define one root export boundary.
2. Establish final public types and polymorphic contracts before behavior changes.
3. Replace provisional store/state ownership with the accepted Root authority and private registrations.
4. Build rendering parts and private tag context around Root-owned `string[]` values.
5. Add a pure candidate/batch evaluation pipeline, then route all mutation sources through it.
6. Add focus, keyboard, form, label, invalid, and announcement behavior around the same authoritative actions.
7. Build the acceptance lab from root imports only and use it to inspect the integrated behavior.
8. Complete automated compatibility, packaging, and browser verification.
9. Review the implementation against every obligation before recording any architecture-freeze decision.

Each step should leave tests green. Avoid a second compatibility layer for the provisional v2 API; it has not been published.

## Files to Modify

Expected areas (exact internal filenames may be refined without changing the public contract):

- `packages/emblor/src/index.ts`
- `packages/emblor/src/core/`
- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/utils/index.ts`
- `packages/emblor/tests/`
- `packages/emblor/package.json`
- `packages/emblor/tsup.config.ts`
- `packages/emblor/tsconfig.json`
- `packages/emblor/playground/`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `.gitignore`
- `.node-version`
- `.github/workflows/`
- `packages/emblor/README.md`
- `packages/emblor/MIGRATION.md`

Directories planned for removal:

- `packages/core`
- `packages/addons`
- `packages/sortable`
- `packages/types`
- `packages/utils`
- `packages/playground`
- `packages/emblor/src/addons`
- `packages/emblor/src/sortable`
- `packages/emblor/src/testing`

## Implementation Tasks

### T-01 — Consolidate the package and toolchain

Decisions: DR-0001, DR-0002, DR-0005, DR-0007, DR-0013, DR-0014.

Work:

- Delete abandoned package directories and obsolete Emblor feature modules.
- Reduce package exports and build entries to `emblor` plus `emblor/package.json`.
- Remove unused Radix context and obsolete playground integration dependencies.
- remove committed generated playground artifacts and ensure build outputs are ignored.
- Remove the unused Husky/lint-staged toolchain and keep quality commands available locally and in CI.
- Set the root Node engine/version policy to Node 24 primary with Node 22 compatibility.
- Leave `website/` unchanged.

Verification: VT-01, VT-10, VT-11.

### T-02 — Define the final public API and polymorphic types

Decisions: DR-0003, DR-0007, DR-0008, DR-0015, DR-0016, DR-0017, DR-0019, DR-0022, DR-0023, DR-0034, DR-0035.

Work:

- Export only the eight public parts and their supported public types from `emblor`.
- Add discriminated types for value-change details, rejections, and announcements.
- Put tag and draft controlled/uncontrolled props on Root.
- Remove provisional aliases, callbacks, public focus state, identity helpers, and context/store exports.
- Implement element-sensitive `as` props and refs; constrain Input to `input`, `textarea`, or a compatible custom component.
- Define protected semantic/behavioral props and consumer-first event composition.

Verification: VT-02, VT-10.

### T-03 — Rebuild Root state and structural coordination

Decisions: DR-0003, DR-0011, DR-0015, DR-0031, DR-0034, DR-0039.

Work:

- Store authoritative public values as `string[]` and draft as a separate Root-owned string.
- Implement controlled/uncontrolled ownership checks and native-reset baselines.
- Replace dual focus state with one internal actual-focus index.
- Add Strict-Mode-safe registrations for exactly one Input, zero-or-one TagList, labels, portals/focus boundaries, and sparse indexed Tag nodes.
- Validate external runtime value shape and constraint configuration without normalizing external strings.
- Expose derived state attributes from current authoritative state.

Verification: VT-03, VT-06, VT-09.

### T-04 — Implement Root-owned rendering and tag context

Decisions: DR-0017, DR-0020, DR-0021, DR-0039.

Work:

- Make TagList accept either static children or `(tag, index) => ReactNode` and render current Root values in both state modes.
- Add private per-Tag context; TagText and TagRemove require it.
- Make TagText render the exact current string by default while allowing explicit children.
- Keep `index` only on Tag, validate range and duplicate registrations, and permit sparse rendered indexes.
- Stop generating Tag DOM IDs; forward consumer-provided IDs and leave React occurrence keys to consumers.

Verification: VT-03, VT-04, VT-09.

### T-05 — Implement the canonical candidate and batch pipeline

Decisions: DR-0009, DR-0010, DR-0019, DR-0024, DR-0026, DR-0030, DR-0031, DR-0032, DR-0036, DR-0037.

Work:

- Centralize trim, transform, emptiness, code-point length, duplicate, capacity, and custom validation in a pure ordered evaluator.
- Preserve raw and canonical values for structured rejection details.
- Reject overlength candidates without truncation and preserve rejected drafts.
- Validate and deduplicate literal single-code-point delimiters.
- Evaluate paste candidates left-to-right against one accumulating next array and emit at most one add-many transition.
- Construct paste input from the prospective native draft and preserve draft/selection on total rejection.
- Keep Input editable at capacity while exposing `data-max-reached`.

Verification: VT-05, VT-08.

### T-06 — Route input interactions through Root actions

Decisions: DR-0010, DR-0015, DR-0022, DR-0023, DR-0026, DR-0028, DR-0032, DR-0037, DR-0038.

Work:

- Route typing, Enter, literal delimiters, optional Tab, paste, blur commit/discard/noop, and successful draft clearing through Root-owned actions.
- Run consumer native handlers first and honor the accepted cancellation boundaries.
- Ignore Emblor keyboard commands during IME composition.
- Apply blur behavior only after focus leaves the entire Root, including registered portal descendants.
- Remove misleading autocomplete/listbox ARIA.

Verification: VT-05, VT-06, VT-08.

### T-07 — Implement navigation, removal, and focus restoration

Decisions: DR-0011, DR-0028, DR-0029, DR-0039, DR-0040.

Work:

- Implement caret-boundary entry into the sparse mounted Tag registry.
- Use physical ArrowLeft/ArrowRight with `dir`-aware predecessor/successor meaning; keep Home/End positional.
- Guard all tag commands during composition.
- Restore focus by resulting position only after an accepted removal/clear is reflected.
- In controlled mode, acknowledge only the exact requested next array and never override deliberate consumer focus movement.

Verification: VT-06, VT-09.

### T-08 — Implement forms, labels, invalid state, and announcements

Decisions: DR-0018, DR-0019, DR-0027, DR-0034, DR-0035.

Work:

- Submit committed strings as ordered repeated values under the exact Root `name`.
- Implement required validity, disabled exclusion, read-only submission, reset behavior, and invalid-focus routing to Input.
- Add repeatable Label with automatic association, multiple-label ordering, explicit native overrides, and click-to-focus under polymorphism.
- Combine persistent `invalid` and transient rejection state into stable Root/Input attributes.
- Add the private polite atomic live region with default and customizable announcements.

Verification: VT-07, VT-08, VT-09.

### T-09 — Complete action-part and polymorphic semantics

Decisions: DR-0008, DR-0016, DR-0021, DR-0023, DR-0025, DR-0035.

Work:

- Rename Clear with no provisional alias.
- Make TagRemove inherit its target from Tag context.
- Make Clear all-or-nothing and unavailable whenever `minTags > 0`, as well as for empty, disabled, or read-only state.
- Preserve button semantics, focusability, Enter/Space activation, disabled guards, and exactly-once behavior when action parts render as non-buttons.
- Forward native, ARIA, data, style, class, ref, and supported event props without permitting contract-breaking overrides.

Verification: VT-02, VT-04, VT-09.

### T-10 — Build the visual acceptance lab

Decisions: DR-0001, DR-0005, DR-0007, and all behavior decisions demonstrated by the lab.

Work:

- Replace the current integration-story playground with a focused package acceptance lab importing only from `emblor`.
- Include these live views:
  - **Canonical controlled slice:** the approved API with stable consumer-owned occurrence keys.
  - **Uncontrolled slice:** proves `defaultValue`, Root-owned draft, render-function updates, and native reset.
  - **Validation and paste lab:** transform, rejection reasons, partial paste, max capacity, and preserved drafts.
  - **Keyboard and focus lab:** LTR/RTL navigation, sparse rendering, removal restoration, IME notes, and visible focused state.
  - **Forms and accessibility lab:** repeated `FormData`, required/invalid state, labels, disabled/read-only behavior, and announcement text.
  - **Polymorphism and styling lab:** alternate elements, custom components, `className`, inline style, `data-*`, and native events.
- Add a compact inspector beside each view showing current tags, draft, last value-change details, last rejection, focused element, submitted FormData, and relevant `data-*` state.
- Provide deterministic reset buttons and scenario presets so review does not depend on manual setup.
- Keep lab CSS explicitly consumer-owned and outside the library build.

Verification: VT-12.

### T-11 — Expand automated runtime and type verification

Decisions: all Required decisions.

Work:

- Organize tests by state, rendering, validation, interactions, focus, forms/a11y, polymorphism, and exports.
- Add compile-time fixtures for every public component's default and polymorphic props/ref types and for removed API failures.
- Add real-browser coverage where jsdom cannot prove focus, selection, native forms, constraint validation, directionality, or portal behavior.
- Test controlled and uncontrolled parity and React Strict Mode registration behavior.

Verification: VT-02 through VT-10.

### T-12 — Strengthen compatibility and CI verification

Decisions: DR-0004, DR-0013, DR-0014.

Work:

- Constrain React peers to React 18 and 19 intentionally.
- Verify package types and runtime against both React majors.
- Run contributor/package checks on Node 22 and 24, with Node 24 primary.
- Add CI jobs for format, lint, typecheck, unit/integration/browser tests, build, package contents, exports, and clean consumer installs.

Verification: VT-10, VT-11.

### T-13 — Document the implemented contract

Decisions: DR-0001, DR-0003, DR-0007, DR-0012 and every public API decision.

Work:

- Rewrite the package README around the canonical root import and corrected vertical slice (`placeholderWhenFull` on Root).
- Document defaults, state ownership, native forms, styling, accessibility, identity/key tradeoffs, and event cancellation.
- Add a v1-to-v2 migration guide covering the hard break and removed features.
- Clearly mark the acceptance lab as temporary and non-normative for styling.
- Prepare but do not publish release metadata; alpha release execution remains a later plan/gate.

Verification: VT-10, VT-13.

### T-14 — Review the slice and freeze architecture deliberately

Decisions: all Required decisions.

Work:

- Complete the companion implementation review with evidence for every obligation.
- Walk through the acceptance lab and capture representative screenshots for the canonical, invalid, capacity, RTL/focus, and form states.
- Compare the implemented public exports and type signatures with the canonical slice.
- Record deviations as code defects or new/superseding decisions; do not silently edit history.
- Freeze the architecture only after all Required obligations are Verified and the user explicitly accepts the review. Capture that acceptance in a new decision record at that time.

Verification: VT-12, VT-13, VT-14.

## Verification Tasks

### VT-01 — Repository and package cleanup

Confirm one workspace package source, no tracked orphan/generated source artifacts, no obsolete modules/dependencies, and no website changes.

### VT-02 — Public TypeScript contract

Compile positive fixtures for every part, intrinsic/custom `as`, refs, native props, render children, controlled/uncontrolled Root, and public event types. Compile negative fixtures for removed subpaths/props, duplicate state APIs, TagRemove `index`, and incompatible Input elements.

### VT-03 — State and rendering contract

Verify controlled/uncontrolled values and drafts, ownership-switch errors, Root-driven TagList rendering, static children, exact TagText output, external value trust, shape errors, and reset baselines.

### VT-04 — Compound-part contract

Verify missing parent errors, nested context isolation, Tag index validation, duplicate/sparse registration, custom IDs, consumer keys, repeated Labels/actions, required Input, and TagList cardinality.

### VT-05 — Candidate and mutation contract

Verify ordered trim/transform/constraints/validate behavior, every rejection reason/source, code-point bounds, duplicate/capacity checks, callback detail payloads, callback counts, draft preservation/clearing, and no retroactive mutation.

### VT-06 — Keyboard, IME, blur, and focus contract

Verify Enter/Tab/delimiters, caret boundaries, LTR/RTL arrows, Home/End, sparse nodes, composition suppression, Root-boundary blur including portals, removal/clear restoration, controlled acknowledgement, and consumer focus preservation.

### VT-07 — Native form contract

In a real browser, verify ordered repeated values, exact names, required semantics, invalid focus routing, disabled omission, read-only submission, controlled/uncontrolled reset behavior, and form ownership.

### VT-08 — Rejection and announcement contract

Verify persistent plus transient invalid state, clearing rules, default/localized/suppressed announcements, partial-paste event order, guarded-action silence, and accessible attributes.

### VT-09 — DOM, accessibility, and polymorphism contract

Verify roles, label naming/order, click-to-focus, forwarded HTML/ARIA/data/style/events, protected prop precedence, native and non-native button activation, Input compatibility errors, refs, and exactly-once actions.

### VT-10 — Build, exports, and package contents

Run format, lint, typecheck, unit/integration tests, production build, package tarball inspection, ESM/CJS/type import smoke tests, removed-subpath failures, and tree-shaking/side-effect checks.

### VT-11 — Compatibility matrix

Run the relevant package gates on Node 22 and 24 and against React 18 and 19 in clean consumer fixtures.

### VT-12 — Visual acceptance

Build and exercise the package playground in a real browser. Confirm every planned view uses only public root imports, inspectors match actual events/state, keyboard-only operation works, narrow/wide layouts remain usable, and consumer CSS is visibly separate from package behavior.

### VT-13 — Documentation review

Compile documentation examples, compare documented defaults and signatures to exported types, and verify the migration guide lists every intentionally removed v1 capability.

### VT-14 — Architecture-freeze gate

Require all Required coverage rows to be `Verified`, attach test/build/browser evidence to the implementation review, resolve every deviation, and obtain explicit user acceptance before creating an architecture-freeze decision.

## Visual Acceptance Design

The lab is the primary way to see what was built. It should show behavior and internal outcomes without exposing internal library APIs:

```text
┌ Scenario navigation ───────┬ Live Emblor field ─────────────────┐
│ Canonical                  │ Label                               │
│ Uncontrolled               │ [tag ×] [tag ×] [draft________]    │
│ Validation & paste         │ [Clear]                            │
│ Keyboard & focus           ├ Inspector ─────────────────────────┤
│ Forms & accessibility      │ tags       ["react", "typescript"]│
│ Polymorphism & styling     │ draft      ""                      │
│                            │ last change add-many / paste        │
│ [Reset scenario]           │ rejection   —                      │
│                            │ focus        input                  │
│                            │ form data    skills=react ×2        │
└────────────────────────────┴────────────────────────────────────┘
```

The inspector is application state derived from public callbacks, native DOM inspection, and form submission. It must not use a public or private Emblor context hook.

## Data / State Changes

- Public tag state becomes authoritative `string[]` with no public tag object identity.
- Root owns both tag and draft controlled/uncontrolled boundaries.
- Focus, registration, invalid/rejection, pending focus restoration, label association, and announcements remain private implementation state.
- No persistence or server data migration is involved.

## API / Contract Changes

- One package root export containing eight compound parts and public types.
- Root gains final state, constraint, form, rejection, announcement, and behavioral props.
- TagList gains the item render function.
- Label and TagText are added; Clear is renamed; TagRemove loses `index`.
- All provisional callbacks, focus controls, aliases, ID generation, public context/store, and feature subpaths are removed.
- All parts support native prop forwarding and the accepted polymorphic contract.

## UI / UX Changes

The package remains unstyled. User-visible behavior includes predictable commit/rejection, paste, keyboard navigation, focus restoration, required validation, and announcements. Visual treatment exists only in the consumer-owned acceptance lab.

## Migration Steps

1. Consolidate repository/package layout before touching behavior.
2. Change source/tests/playground together to root imports and final names.
3. Introduce final public types and internal state/actions without compatibility aliases.
4. Replace provisional examples with the acceptance lab.
5. Update README and migration guide after exported signatures stabilize.
6. Do not alter the v1 website or publish v2 as part of this plan.

## Rollback Plan

- Implement in reviewable commits grouped by the tasks above.
- Before the architecture-freeze decision, revert individual task commits if a contract proves unworkable.
- Preserve all decision history; architecture changes require a superseding decision and plan resync.
- The package-layout deletion remains recoverable from Git until merged; do not retain duplicate code as a rollback mechanism.
- The acceptance lab is disposable and can be replaced without affecting the public package contract.

## Dependencies

- React 18 and 19.
- Existing React/testing/build stack, updated as required for dual-major and browser verification.
- A real-browser test runner may be added if the repository has no adequate existing mechanism; it must remain development-only.
- No runtime dependency should be added unless a required behavior cannot be implemented safely with React and the platform and the addition is separately reviewed.

## Assumptions

- The accepted decisions through DR-0040 define the implementation contracts; DR-0041 freezes their reviewed architecture boundary.
- `placeholderWhenFull` is a Root behavior prop; `placeholder` remains an Input native prop.
- The canonical controlled lab owns stable occurrence keys outside Emblor. The uncontrolled lab may use a documented demo-only positional key because the public `string[]` model intentionally provides no occurrence identity.
- Browser evidence and screenshots are review artifacts, not committed product documentation unless chosen during review.

## Open Questions

None blocking implementation. Any newly discovered public-contract ambiguity pauses the affected task and becomes a decision interview before code establishes precedent.

## To-Dos

- [x] Execute T-01 through T-13.
- [x] Keep the coverage matrix synchronized as work lands.
- [x] Complete T-14 and record the architecture freeze in DR-0041.
- [ ] Create a separate release plan for alpha publication after architecture acceptance.
