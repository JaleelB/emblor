# Implementation Plan: Emblor v2 Package

## Status

Ready — all 38 active decisions are consistent, and all 139 required obligations map to implementation tasks, files, and verification.

## Feature Definition

Finish Emblor v2 as a single, dependency-light, headless React tag-input package. Preserve the existing core behavior where it matches accepted decisions, remove abandoned package and feature experiments, finalize the public compound API, harden controlled/uncontrolled behavior and accessibility, establish reproducible CI, document the v1 migration, and publish an alpha before stable v2.

## Problem Statement

The current branch contains a promising headless core, but it also contains two competing package layouts, provisional public subpaths, redundant focus state, split draft-input ownership, misleading ARIA, incomplete announcements and tests, stale repository tooling, and a premature `2.0.0` version. A build succeeds, but its packed output exposes APIs that have now been rejected. The implementation needs subtraction and hardening rather than another redesign.

## Goals

- Ship one installable `emblor` package with one public code entry point.
- Provide the accepted `Emblor*` compound API and public TypeScript types from the package root.
- Make tag values and draft text reliable in controlled and uncontrolled modes.
- Provide predictable validation, transformation, delimiter, paste, blur, clear, and keyboard behavior.
- Provide correct labeling, focus behavior, and screen-reader announcements without autocomplete semantics.
- Verify React 18 and 19 on Node 22 and 24.
- Publish a testable v2 alpha without moving npm `latest` from v1.

## Non-Goals

- Autocomplete or a cmdk dependency.
- Drag-and-drop, sorting, or sortable exports.
- Addons, testing helpers, public utilities, or a compatibility `TagInput` component.
- Tailwind, CVA, Shadcn, Radix UI, or other styling/integration dependencies in the package.
- Rebuilding or migrating `website/` in this plan.
- Rewriting the store architecture when a focused correction satisfies the accepted behavior.

## Current Architecture and Baseline

- `packages/emblor/src/core/` contains the active compound implementation backed by a small external store and React context.
- Public tag state is already `string[]`; internal records attach DOM IDs.
- `packages/emblor/src/addons`, `sortable`, and `testing` still build and ship.
- Six abandoned `packages/@emblor-*`-style directories remain outside the workspace.
- Root, core, type, utility, addon, sortable, and testing entries currently produce 53 packed files.
- A frozen install succeeds on Node 22.23.2, with an expected warning from the stale Node engine.
- Existing behavior tests pass: 5 files, 10 tests.
- Production build succeeds.
- Typecheck fails because two tests rely on unconfigured Vitest globals.
- Lint cannot start because ESLint 9 has no flat configuration.
- No accepted decision conflicts or unresolved supersession relationships exist.

## Assumptions

- Functional visually-hidden styles for the internal live region are accessibility infrastructure, not a consumer styling layer.

The former assumptions have now been resolved explicitly: length rejection in DR-0024, `minTags` clear behavior in DR-0025, and partial ordered paste acceptance in DR-0026.

## Decision Manifest

### Required

- DR-0001 — Emblor v2 Is a Headless Tag Input and a Hard Break.
- DR-0002 — Use One Emblor Package and Remove Feature Subpackages.
- DR-0003 — Use String Arrays as the Public Value Model.
- DR-0004 — Support React 18 and 19 Without Rebasing the Refactor.
- DR-0005 — Defer the Website Until the Package API Is Stable.
- DR-0007 — Use a Root-Only Public API.
- DR-0008 — Name the Clear Primitive EmblorClear.
- DR-0009 — Separate Tag Transformation from Validation.
- DR-0010 — Separate Text Delimiters from Keyboard Commit Controls.
- DR-0011 — Use One Internal Actual-Focus Index.
- DR-0012 — Release v2 Through an Alpha Channel First.
- DR-0013 — Use CI-Only Quality Enforcement.
- DR-0014 — Use Node 24 Primary with Node 22 Compatibility.
- DR-0015 — Root Owns Draft Input State.
- DR-0016 — Guarantee DOM Prop Forwarding and Polymorphic Styling.
- DR-0017 — Render Root Values Through EmblorTagList and Add EmblorTagText.
- DR-0018 — Support Native Forms with Repeated Values.
- DR-0019 — Expose Controlled Invalid State and Structured Rejections.
- DR-0020 — Use Consumer-Owned Tag Identity.
- DR-0021 — Nested Tag Parts Inherit Private Tag Context.
- DR-0022 — Use One Metadata-Rich Value Change Callback.
- DR-0023 — Use Native Prop Names and Keep Only Emblor-Specific Root Props.
- DR-0024 — Reject Overlength Tags Without Truncation.
- DR-0025 — Make Clear All-or-Nothing Under minTags.
- DR-0026 — Partially Accept Valid Pasted Tags in Order.
- DR-0027 — Provide Customizable Accessible Announcements.
- DR-0028 — Ignore Tag Keyboard Behavior During IME Composition.
- DR-0029 — Use Direction-Aware Physical Arrow Navigation.
- DR-0030 — Keep Input Editable at maxTags.
- DR-0031 — Fail Fast on Invalid Constraints Without Retroactive Mutation.
- DR-0032 — Use Single-Code-Point Literal Delimiters.
- DR-0034 — Require One Input and Allow at Most One TagList.
- DR-0035 — Preserve Required Semantics Across Polymorphic Elements.
- DR-0036 — Count Length in Unicode Code Points.
- DR-0037 — Parse the Prospective Draft on Paste.
- DR-0038 — Apply Opt-In Blur Actions Only When Focus Leaves Root.
- DR-0039 — Trust External String Values and Enforce Rendered Index Integrity.
- DR-0040 — Restore Focus by Resulting Position After Removal.

### Related

- `project-status/HANDOFF.md` supplies historical context and the original locked scope. Its operational Git and npm facts have been superseded by the verified session record, not by a separate product decision.
- DR-0006 is historical and superseded by DR-0017. Its accepted `EmblorLabel` direction is retained, while its rejection of `EmblorTagText` is replaced.
- DR-0033 is historical and superseded by DR-0034. Its multiple-Label and singleton TagList directions are retained, while permission to omit Input is replaced.

### Not Applicable

- No additional plausible decisions are classified as Not Applicable; superseded DR-0006 and DR-0033 remain relevant history and are listed under Related.

### Deferred

- The v2 website rebuild is explicitly deferred by DR-0005. This plan only verifies that `website/` remains unchanged and continues to target published v1.

### Conflicts or Uncertainty

- No conflicts remain among active decisions.
- The handoff's npm baseline (`1.4.7`) is stale; live npm and `origin/main` both establish `1.4.8` as the correct baseline.
- The handoff's ahead-of-remote Git statement is stale; the feature branch was aligned with its remote when planning began.

## Decision Coverage

| Obligation                                                                                                                      | Source  | Tasks            | Files                                                        | Verification        | Status  |
| ------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------- | ------------------------------------------------------------ | ------------------- | ------- |
| DR-0001/O-01: Package owns tag behavior and accessibility, not presentation or integrations                                     | DR-0001 | T-02, T-04, T-05 | `packages/emblor/src/**`, `packages/emblor/package.json`     | VT-02, VT-04, VT-05 | Planned |
| DR-0001/O-02: Do not ship v1 compatibility, styling, autocomplete, or sorting                                                   | DR-0001 | T-01, T-02       | orphan packages, package exports and sources                 | VT-01, VT-02        | Planned |
| DR-0001/O-03: Provide a hard-break migration guide                                                                              | DR-0001 | T-08             | `packages/emblor/MIGRATION.md`                               | VT-08               | Planned |
| DR-0002/O-01: Retain one `emblor` package and delete abandoned package layout                                                   | DR-0002 | T-01             | `packages/{core,addons,sortable,types,utils,playground}`     | VT-01               | Planned |
| DR-0002/O-02: Remove addon, sortable, and testing implementations/subpaths                                                      | DR-0002 | T-02             | package config and `src/{addons,sortable,testing}`           | VT-02               | Planned |
| DR-0002/O-03: Keep clear in core; reorder remains consumer-owned                                                                | DR-0002 | T-03             | core components and root exports                             | VT-03, VT-04        | Planned |
| DR-0003/O-01: Public value contract is controlled/uncontrolled `string[]`                                                       | DR-0003 | T-04             | root props, root behavior, tests                             | VT-03, VT-04        | Planned |
| DR-0003/O-02: DOM IDs remain internal with a deliberate customization point                                                     | DR-0003 | T-03, T-04       | types, Root, Tag                                             | VT-03, VT-05        | Planned |
| DR-0003/O-03: Consumers do not coordinate active-tag state                                                                      | DR-0003 | T-05             | types, context, Root, Input, Tag                             | VT-03, VT-05        | Planned |
| DR-0004/O-01: Peer range intentionally supports only React 18 and 19                                                            | DR-0004 | T-07             | `packages/emblor/package.json`                               | VT-07               | Planned |
| DR-0004/O-02: Verify types, behavior, build, and packed consumption on both majors                                              | DR-0004 | T-06, T-07       | tests, compatibility smoke tooling, workflows                | VT-06, VT-07, VT-09 | Planned |
| DR-0004/O-03: Do not rebase onto main                                                                                           | DR-0004 | T-01–T-09        | Git workflow                                                 | VT-06               | Planned |
| DR-0005/O-01: Leave `website/` on v1                                                                                            | DR-0005 | T-08             | `website/` (no modifications)                                | VT-08               | Planned |
| DR-0005/O-02: Keep only a temporary core smoke playground                                                                       | DR-0005 | T-08             | `packages/emblor/playground/**`                              | VT-08               | Planned |
| DR-0007/O-01: Export supported code only from `emblor` root                                                                     | DR-0007 | T-02             | package exports, tsup, tsconfig, root index                  | VT-02               | Planned |
| DR-0007/O-02: Re-export all supported public types from root                                                                    | DR-0007 | T-02, T-03       | `src/index.ts`, public types                                 | VT-02, VT-03        | Planned |
| DR-0007/O-03: Keep context, store, and utilities internal                                                                       | DR-0007 | T-02             | core index, source organization, declarations                | VT-02               | Planned |
| DR-0008/O-01: Export only `EmblorClear` / `EmblorClearProps`                                                                    | DR-0008 | T-03             | clear component, types, imports                              | VT-02, VT-03        | Planned |
| DR-0009/O-01: Expose separate `transform` and boolean `validate` props                                                          | DR-0009 | T-04             | types, Root, tests                                           | VT-03, VT-04        | Planned |
| DR-0009/O-02: Validate the trimmed, transformed canonical value                                                                 | DR-0009 | T-04             | Root commit pipeline                                         | VT-04               | Planned |
| DR-0009/O-03: Surface and announce rejection consistently                                                                       | DR-0009 | T-04, T-05       | store announcements, live region, data attributes            | VT-04, VT-05        | Planned |
| DR-0010/O-01: Use literal `delimiters[]` and opt-in `addOnTab`                                                                  | DR-0010 | T-04             | types, context, Root, Input                                  | VT-03, VT-04        | Planned |
| DR-0010/O-02: Enter is intrinsic; Tab preserves native behavior by default                                                      | DR-0010 | T-04             | Input keyboard handler                                       | VT-04, VT-05        | Planned |
| DR-0010/O-03: Multi-value paste is ordered and state-safe                                                                       | DR-0010 | T-04             | Root batch action, Input paste handler                       | VT-04               | Planned |
| DR-0011/O-01: Keep one internal `focusedIndex` and remove public index props                                                    | DR-0011 | T-05             | types, store, context, Root                                  | VT-03, VT-05        | Planned |
| DR-0011/O-02: Focus state tracks actual DOM focus only                                                                          | DR-0011 | T-05             | Input, Tag, TagRemove, Root                                  | VT-05               | Planned |
| DR-0011/O-03: Remove virtual active state and `data-active`                                                                     | DR-0011 | T-05             | Tag and Input ARIA/data attributes                           | VT-03, VT-05        | Planned |
| DR-0012/O-01: Restore package baseline to published `1.4.8`                                                                     | DR-0012 | T-02             | package manifest and lockfile                                | VT-02, VT-09        | Planned |
| DR-0012/O-02: Create a major changeset and publish under alpha/non-latest tag                                                   | DR-0012 | T-09             | `.changeset/**`, publish workflow                            | VT-09               | Planned |
| DR-0012/O-03: Require consumer, package, compatibility, docs, and a11y gates before stable                                      | DR-0012 | T-06–T-09        | tests, CI, docs, release checklist                           | VT-06–VT-09         | Planned |
| DR-0013/O-01: Remove Husky/lint-staged/tsc-files and root prepare hook                                                          | DR-0013 | T-01             | root manifest and lockfile                                   | VT-01, VT-06        | Planned |
| DR-0013/O-02: Enforce format, lint, types, tests, build, and package checks in CI                                               | DR-0013 | T-06, T-07       | ESLint config, scripts, workflows                            | VT-06, VT-07        | Planned |
| DR-0014/O-01: Use Node 24 primary and exact Node 22/24 root engine range                                                        | DR-0014 | T-07             | root manifest, version pin, contributor docs                 | VT-07               | Planned |
| DR-0014/O-02: Test Node 22 and 24; release on Node 24                                                                           | DR-0014 | T-07, T-09       | CI and publish workflows                                     | VT-07, VT-09        | Planned |
| DR-0014/O-03: Do not add a published-package Node engine without need                                                           | DR-0014 | T-02             | `packages/emblor/package.json`                               | VT-02               | Planned |
| DR-0015/O-01: Root exposes controlled/uncontrolled draft props                                                                  | DR-0015 | T-04             | types, Root, context                                         | VT-03, VT-04        | Planned |
| DR-0015/O-02: Input does not own a second custom value API                                                                      | DR-0015 | T-04             | Input props and component                                    | VT-03, VT-04        | Planned |
| DR-0015/O-03: All draft changes pass through the Root action and notify controlled owners                                       | DR-0015 | T-04             | Root action, Input handlers, tests                           | VT-04               | Planned |
| DR-0016/O-01: Forward applicable class, style, HTML, ARIA, data, and event props on every public part                           | DR-0016 | T-03             | public part implementations and types                        | VT-03, VT-05        | Planned |
| DR-0016/O-02: Make `as` props and refs adapt to the selected element or component                                               | DR-0016 | T-03             | polymorphic public types, internal helpers, all public parts | VT-03               | Planned |
| DR-0016/O-03: Preserve required semantics through documented prop precedence and event composition                              | DR-0016 | T-03, T-05, T-08 | public parts, tests, README                                  | VT-03, VT-05, VT-08 | Planned |
| DR-0016/O-04: Do not add `asChild` or a library styling, theme, or variant API                                                  | DR-0016 | T-03, T-08       | public exports, types, README                                | VT-02, VT-03, VT-08 | Planned |
| DR-0017/O-01: Render current Root values through the TagList item function in controlled and uncontrolled modes                 | DR-0017 | T-03, T-04       | TagList types/implementation, Root store, tests              | VT-03, VT-04        | Planned |
| DR-0017/O-02: Add polymorphic, prop-forwarding `EmblorTagText` backed by private tag context                                    | DR-0017 | T-03             | Tag, TagText, types, exports                                 | VT-03, VT-05        | Planned |
| DR-0017/O-03: Keep static TagList children and context/store internals private                                                  | DR-0017 | T-02, T-03       | exports, TagList, internal contexts                          | VT-02, VT-03        | Planned |
| DR-0017/O-04: Retain `EmblorLabel` and remove routine bespoke `labelId` plumbing                                                | DR-0017 | T-03, T-05, T-08 | Label, Root, Input, types, docs                              | VT-03, VT-05, VT-08 | Planned |
| DR-0018/O-01: Submit committed tags as repeated ordered values under the exact Root name                                        | DR-0018 | T-04             | Root form integration, internal controls                     | VT-04, VT-05        | Planned |
| DR-0018/O-02: Make required mean at least one committed tag and route invalid focus and accessibility to Input                  | DR-0018 | T-04, T-05       | Root, Input, form integration                                | VT-04, VT-05        | Planned |
| DR-0018/O-03: Exclude disabled values while submitting read-only values                                                         | DR-0018 | T-04             | Root form integration                                        | VT-04               | Planned |
| DR-0018/O-04: Native reset restores uncontrolled defaults without mutating controlled state                                     | DR-0018 | T-04             | controllable state, Root form listener, tests                | VT-04               | Planned |
| DR-0018/O-05: Keep form controls internal and document repeated-field semantics                                                 | DR-0018 | T-02, T-05, T-08 | exports, Root internals, accessibility, README               | VT-02, VT-05, VT-08 | Planned |
| DR-0019/O-01: Expose persistent controlled `invalid` and structured `onReject` with public types                                | DR-0019 | T-03, T-04       | public types, Root API, rejection pipeline                   | VT-03, VT-04        | Planned |
| DR-0019/O-02: Report raw/canonical values, stable reason, and commit source once per rejected candidate                         | DR-0019 | T-04             | commit pipeline, callbacks, tests                            | VT-04               | Planned |
| DR-0019/O-03: Combine persistent and transient invalid state on Root/Input and clear transient state on draft change or success | DR-0019 | T-04, T-05       | store, Root, Input                                           | VT-04, VT-05        | Planned |
| DR-0019/O-04: Ignore disabled/read-only attempts and use consumer-owned errors through standard `aria-describedby`              | DR-0019 | T-04, T-05, T-08 | commit guards, Input ARIA, README                            | VT-04, VT-05, VT-08 | Planned |
| DR-0020/O-01: Remove `generateTagId` and automatic tag DOM IDs                                                                  | DR-0020 | T-03, T-05       | public types, Root/context, Tag                              | VT-03, VT-05        | Planned |
| DR-0020/O-02: Preserve consumer-supplied Tag IDs and leave React keys to consumers                                              | DR-0020 | T-03, T-08       | Tag prop forwarding, examples, README                        | VT-03, VT-05, VT-08 | Planned |
| DR-0020/O-03: Use current indexes only as private positional behavior, not stable identity                                      | DR-0020 | T-04, T-05       | TagList, tag context, node registry, tests                   | VT-04, VT-05        | Planned |
| DR-0021/O-01: Keep index only on EmblorTag and provide current value/index through private tag context                          | DR-0021 | T-03             | Tag, private tag context, types                              | VT-03, VT-04        | Planned |
| DR-0021/O-02: Remove index from TagRemove and make TagText/TagRemove require nearest Tag                                        | DR-0021 | T-03, T-05       | TagText, TagRemove, missing-parent errors                    | VT-03, VT-05        | Planned |
| DR-0021/O-03: Keep tag-item context internal and verify isolation across list changes/nesting                                   | DR-0021 | T-02, T-04, T-05 | exports, context, tests                                      | VT-02, VT-04, VT-05 | Planned |
| DR-0022/O-01: Make onValueChange the sole mutation callback with exported discriminated details                                 | DR-0022 | T-03, T-04       | public types, Root actions                                   | VT-03, VT-04        | Planned |
| DR-0022/O-02: Emit exactly one detail-rich callback per accepted transition, including add-many paste                           | DR-0022 | T-04             | add/remove/clear/paste actions, tests                        | VT-04               | Planned |
| DR-0022/O-03: Remove add/remove/clear convenience callbacks and Root onTagClick                                                 | DR-0022 | T-03, T-08       | types, Root, Tag, docs/migration                             | VT-03, VT-08        | Planned |
| DR-0022/O-04: Route rejections only to onReject and keep controlled prop synchronization callback-silent                        | DR-0022 | T-04             | controllable state, rejection pipeline                       | VT-04               | Planned |
| DR-0023/O-01: Rename inputBlurBehavior to blurBehavior and retain the three accepted values                                     | DR-0023 | T-03, T-04       | public types, Root/context/Input                             | VT-03, VT-04        | Planned |
| DR-0023/O-02: Remove custom aliases for native keydown, ARIA description, and labels                                            | DR-0023 | T-03, T-05       | Root/Input/Remove/Clear props and handlers                   | VT-03, VT-05        | Planned |
| DR-0023/O-03: Put element-specific DOM props on their rendered parts with native React names and composition                    | DR-0023 | T-03, T-05, T-08 | public parts, fixtures, docs                                 | VT-03, VT-05, VT-08 | Planned |
| DR-0023/O-04: Retain named Emblor-specific constraint, duplicate, paste, Tab, and full-placeholder props                        | DR-0023 | T-03             | Root public types                                            | VT-03               | Planned |
| DR-0024/O-01: Apply min/max length after trim and transform and reject overlength candidates                                    | DR-0024 | T-04             | canonical commit pipeline                                    | VT-04               | Planned |
| DR-0024/O-02: Preserve draft and emit max-length rejection without value-change callback                                        | DR-0024 | T-04             | Root draft/rejection actions                                 | VT-04               | Planned |
| DR-0024/O-03: Make any truncation an explicit transform before length and duplicate validation                                  | DR-0024 | T-04, T-08       | pipeline, tests, README                                      | VT-04, VT-08        | Planned |
| DR-0025/O-01: Keep Clear as remove-all and disable it whenever minTags is positive                                              | DR-0025 | T-04             | Root clear action, Clear state                               | VT-04, VT-05        | Planned |
| DR-0025/O-02: Never partially preserve a subset or emit mutation callbacks from disabled Clear                                  | DR-0025 | T-04             | clear action, callback pipeline                              | VT-04               | Planned |
| DR-0025/O-03: Preserve individual removal boundary while keeping required as separate validation                                | DR-0025 | T-04, T-05, T-08 | remove/clear actions, form validity, docs                    | VT-04, VT-05, VT-08 | Planned |
| DR-0025/O-04: Allow consumer-controlled below-minimum props without built-in actions producing them                             | DR-0025 | T-04             | controlled synchronization and guards                        | VT-04               | Planned |
| DR-0026/O-01: Evaluate non-empty pasted candidates left-to-right against one accumulating array                                 | DR-0026 | T-04             | pure batch evaluator, paste handler                          | VT-04               | Planned |
| DR-0026/O-02: Accept valid candidates, reject invalid candidates individually, and enforce intra-batch duplicate/capacity rules | DR-0026 | T-04             | validation pipeline, rejection callback                      | VT-04               | Planned |
| DR-0026/O-03: Publish one add-many transition only when values are accepted                                                     | DR-0026 | T-04             | value-change callback pipeline                               | VT-04               | Planned |
| DR-0026/O-04: Clear draft on partial success, preserve it on total rejection, and ignore empty segments                         | DR-0026 | T-04, T-08       | draft action, tests, docs                                    | VT-04, VT-08        | Planned |
| DR-0027/O-01: Render a private polite atomic live region with default English messages                                          | DR-0027 | T-05             | Root, private live region, formatter                         | VT-05               | Planned |
| DR-0027/O-02: Expose public announcement types and getAnnouncement localization/suppression                                     | DR-0027 | T-03, T-05, T-08 | public types, Root API, README                               | VT-03, VT-05, VT-08 | Planned |
| DR-0027/O-03: Derive one mutation announcement and ordered rejection announcements from authoritative events                    | DR-0027 | T-04, T-05       | action/rejection pipeline, live region                       | VT-04, VT-05        | Planned |
| DR-0027/O-04: Keep guarded actions and controlled prop synchronization silent                                                   | DR-0027 | T-04, T-05       | guards, controlled sync, tests                               | VT-04, VT-05        | Planned |
| DR-0028/O-01: Bypass every Emblor commit, removal, and navigation key branch during active composition                          | DR-0028 | T-04, T-05       | Input/Tag keyboard handlers                                  | VT-04, VT-05        | Planned |
| DR-0028/O-02: Preserve native composing events and draft updates without validation or announcements                            | DR-0028 | T-04, T-05       | Input change/composition/event pipeline                      | VT-04, VT-05        | Planned |
| DR-0028/O-03: Resume ordinary behavior only on later non-composing keys and never commit on compositionend                      | DR-0028 | T-04             | Input composition tests                                      | VT-04               | Planned |
| DR-0029/O-01: Resolve Root direction explicitly or from inherited DOM direction with LTR fallback                               | DR-0029 | T-03, T-05       | Root props/direction resolver/context                        | VT-03, VT-05        | Planned |
| DR-0029/O-02: Map horizontal arrows to physical visual movement in LTR and RTL                                                  | DR-0029 | T-05             | Input/Tag navigation                                         | VT-05               | Planned |
| DR-0029/O-03: Keep Home/End tied to value order and deletion direction-independent                                              | DR-0029 | T-05             | Tag keyboard behavior                                        | VT-05               | Planned |
| DR-0029/O-04: Handle runtime direction changes without reordering values and document DOM-order responsibility                  | DR-0029 | T-05, T-08       | direction state, tests, README                               | VT-05, VT-08        | Planned |
| DR-0030/O-01: Keep Input enabled, focusable, and editable at capacity unless explicitly disabled or read-only                  | DR-0030 | T-04, T-05       | Root/Input state and interaction guards                      | VT-04, VT-05        | Planned |
| DR-0030/O-02: Expose `data-max-reached` on Root/Input without setting disabled, read-only, or aria-disabled implicitly          | DR-0030 | T-03, T-05       | public part props and rendered state attributes              | VT-03, VT-05        | Planned |
| DR-0030/O-03: Reject capacity commit attempts, preserve the draft, and keep value-change silent                                | DR-0030 | T-04             | canonical commit and rejection pipeline                      | VT-04               | Planned |
| DR-0030/O-04: Preserve the draft across removal below capacity and require a later explicit commit                             | DR-0030 | T-04, T-08       | remove/draft actions, tests, README                          | VT-04, VT-08        | Planned |
| DR-0031/O-01: Require every numeric constraint to be a finite non-negative integer and reject contradictory bound pairs        | DR-0031 | T-04             | Root constraint configuration validator                     | VT-04               | Planned |
| DR-0031/O-02: Validate configuration consistently on every render without environment-specific normalization                  | DR-0031 | T-04             | Root render/configuration path                               | VT-04               | Planned |
| DR-0031/O-03: Apply valid dynamic constraint changes prospectively without mutating values/drafts or emitting events           | DR-0031 | T-04             | controlled/uncontrolled state and action guards              | VT-04               | Planned |
| DR-0031/O-04: Recompute capacity and action availability immediately while allowing corrective additions or removals           | DR-0031 | T-04, T-05       | Root/Input/Clear/Tag derived state                           | VT-04, VT-05        | Planned |
| DR-0031/O-05: Document fail-fast configuration and temporarily out-of-bounds dynamic state                                     | DR-0031 | T-08             | README                                                       | VT-08               | Planned |
| DR-0032/O-01: Require each delimiter entry to contain exactly one Unicode code point and fail fast otherwise                   | DR-0032 | T-04             | Root delimiter configuration validator                      | VT-04               | Planned |
| DR-0032/O-02: Keep Enter/Tab behavior separate and match typing delimiters only by literal `KeyboardEvent.key` equality         | DR-0032 | T-04, T-05       | Input keyboard handler                                      | VT-04, VT-05        | Planned |
| DR-0032/O-03: Accept an empty delimiter array and treat enabled paste as one whole candidate                                   | DR-0032 | T-04             | Input paste and batch pipeline                              | VT-04               | Planned |
| DR-0032/O-04: Deduplicate valid delimiters and parse regex metacharacters as escaped literal text                              | DR-0032 | T-04             | delimiter normalization and paste parser                    | VT-04               | Planned |
| DR-0032/O-05: Document the single-code-point grammar and native onPaste escape hatch for compound parsing                     | DR-0032 | T-08             | README                                                       | VT-08               | Planned |
| DR-0034/O-01: Require exactly one concurrent Input and allow at most one TagList per Root                                      | DR-0034 | T-03, T-05       | Root context, Input, TagList                                | VT-03, VT-05        | Planned |
| DR-0034/O-02: Enforce structural registration after descendant refs with portal, Strict Mode, and replacement safety           | DR-0034 | T-03, T-05       | private structural registry                                | VT-05               | Planned |
| DR-0034/O-03: Keep TagList optional and route custom editors through polymorphic EmblorInput                                   | DR-0034 | T-03, T-08       | Input/TagList types and README                              | VT-03, VT-08        | Planned |
| DR-0034/O-04: Support multiple Labels with automatic association and deterministic accessible-name registration               | DR-0034 | T-03, T-05       | Root context, Label, Input                                  | VT-03, VT-05        | Planned |
| DR-0034/O-05: Preserve native naming overrides and allow repeated non-structural parts                                         | DR-0034 | T-03, T-05, T-08 | public parts, tests, README                                 | VT-03, VT-05, VT-08 | Planned |
| DR-0035/O-01: Preserve Root, TagList, Tag, and TagText semantics across polymorphic rendering                                  | DR-0035 | T-03, T-05       | public parts and polymorphic helpers                        | VT-03, VT-05        | Planned |
| DR-0035/O-02: Preserve automatic naming and click-to-focus behavior for polymorphic Label                                      | DR-0035 | T-03, T-05       | Label registration and activation                          | VT-03, VT-05        | Planned |
| DR-0035/O-03: Give non-button Remove/Clear complete button semantics with exactly-once guarded activation                      | DR-0035 | T-03, T-05       | TagRemove, Clear, activation helper                         | VT-03, VT-05        | Planned |
| DR-0035/O-04: Restrict intrinsic Input to input/textarea and validate custom input-like ref contracts                           | DR-0035 | T-03, T-05       | Input polymorphic types and runtime ref guard               | VT-03, VT-05        | Planned |
| DR-0035/O-05: Protect required props while defining and testing consumer-first event cancellation                              | DR-0035 | T-03, T-05, T-08 | prop merge/event composition, README                        | VT-03, VT-05, VT-08 | Planned |
| DR-0036/O-01: Count post-transform min/max length in Unicode code points rather than UTF-16 units                              | DR-0036 | T-04             | canonical validation pipeline                              | VT-04               | Planned |
| DR-0036/O-02: Keep zero bounds consistent with the independent empty-candidate rule                                            | DR-0036 | T-04             | validation reason ordering                                 | VT-04               | Planned |
| DR-0036/O-03: Document code-point behavior, grapheme limitations, and custom-validate escape hatch                            | DR-0036 | T-08             | README                                                       | VT-08               | Planned |
| DR-0037/O-01: Default addOnPaste true and leave paste native when disabled or consumer-cancelled                              | DR-0037 | T-03, T-04       | Root defaults, Input paste event composition               | VT-03, VT-04        | Planned |
| DR-0037/O-02: Build and parse the prospective draft from current selection with deterministic offset fallback                  | DR-0037 | T-04             | Input selection and paste parser                           | VT-04               | Planned |
| DR-0037/O-03: Apply ordered partial acceptance to the prospective draft and clear only on accepted candidates                 | DR-0037 | T-04             | batch evaluator and draft action                           | VT-04               | Planned |
| DR-0037/O-04: Preserve the original draft and safely restore selection after total rejection                                  | DR-0037 | T-04, T-05       | draft state and post-render selection restoration           | VT-04, VT-05        | Planned |
| DR-0037/O-05: Document native-insertion semantics, default behavior, and custom onPaste cancellation                          | DR-0037 | T-08             | README                                                       | VT-08               | Planned |
| DR-0038/O-01: Default blurBehavior to noop and apply configured actions only on whole-Root focus exit                         | DR-0038 | T-03, T-04, T-05 | Root default and focus-boundary coordinator                 | VT-03, VT-04, VT-05 | Planned |
| DR-0038/O-02: Treat registered portal descendants and internal pointer transitions as internal without action races            | DR-0038 | T-05             | focus registry and deferred destination resolver            | VT-05               | Planned |
| DR-0038/O-03: Define commit, discard, and noop effects with consumer-first cancellation and deterministic callbacks            | DR-0038 | T-04, T-05       | Input blur composition and draft/commit actions             | VT-04, VT-05        | Planned |
| DR-0038/O-04: Keep disabled, read-only, and unmount paths silent while preserving controlled/uncontrolled parity               | DR-0038 | T-04, T-05       | action guards and lifecycle cleanup                         | VT-04, VT-05        | Planned |
| DR-0038/O-05: Document noop default, Root-boundary semantics, cancellation, and opt-in behaviors                               | DR-0038 | T-08             | README                                                       | VT-08               | Planned |
| DR-0039/O-01: Validate external value/defaultValue as string arrays while preserving every valid string verbatim               | DR-0039 | T-04             | Root state initialization and controlled sync               | VT-04               | Planned |
| DR-0039/O-02: Keep external sync silent and apply constraints only to later built-in actions                                   | DR-0039 | T-04             | state/constraint action boundary                            | VT-04               | Planned |
| DR-0039/O-03: Fix tag-state ownership mode at first render and reject controlled/uncontrolled switching                        | DR-0039 | T-04             | controllable-state helper and Root                          | VT-04               | Planned |
| DR-0039/O-04: Enforce finite in-range unique mounted Tag indexes with portal and Strict Mode safety                            | DR-0039 | T-03, T-05       | private Tag node registry                                   | VT-03, VT-05        | Planned |
| DR-0039/O-05: Permit omitted Tags while retaining full constraint/form state and sparse index-order navigation                 | DR-0039 | T-04, T-05       | TagList, form integration, navigation registry              | VT-04, VT-05        | Planned |
| DR-0039/O-06: Render exact external strings and document positional identity and omission consequences                         | DR-0039 | T-03, T-08       | TagText, README                                              | VT-03, VT-08        | Planned |
| DR-0040/O-01: Restore individual-removal focus to resulting same-index, lower-index, or Input fallback                         | DR-0040 | T-04, T-05       | removal action and sparse focus registry                    | VT-04, VT-05        | Planned |
| DR-0040/O-02: Delay controlled restoration until exact requested state is applied and cancel on refusal/divergence             | DR-0040 | T-04, T-05       | pending focus intent and controlled reconciliation           | VT-04, VT-05        | Planned |
| DR-0040/O-03: Preserve deliberate consumer focus and keep guarded/cancelled/external-sync paths focus-silent                    | DR-0040 | T-05             | focus ownership guard                                      | VT-05               | Planned |
| DR-0040/O-04: Focus Input after acknowledged Clear under the same safeguards                                                   | DR-0040 | T-04, T-05       | Clear action and focus reconciliation                       | VT-04, VT-05        | Planned |
| DR-0040/O-05: Document post-removal and Clear focus behavior for sparse and controlled cases                                   | DR-0040 | T-08             | README                                                       | VT-08               | Planned |

## Implementation Strategy

Work in reversible slices. First remove duplicate package trees and dead tooling so only authoritative code remains. Then narrow the build/export boundary before changing behavior. Reshape public API parts and state ownership together, because partial compatibility is not a goal. Harden behavior and accessibility against the final contracts, expand tests, then update tooling, examples, and documentation. Only after the packed artifact passes consumer smoke tests should prerelease metadata be generated and the alpha published.

Avoid touching `website/`, rebasing, or adding integration dependencies. Keep internal helpers internal even if tests need refactoring; test public behavior through root imports wherever possible.

## Files to Modify

### Repository and tooling

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml` only if compatibility fixtures require an explicit workspace pattern
- `.node-version` (new)
- `eslint.config.mjs` (new)
- `.github/workflows/ci.yml`
- `.github/workflows/code-check.yml`
- `.github/workflows/publish.yml`
- `CONTRIBUTING.md`
- Delete `packages/core/`, `packages/addons/`, `packages/sortable/`, `packages/types/`, `packages/utils/`, and `packages/playground/`

### Package boundary

- `packages/emblor/package.json`
- `packages/emblor/tsup.config.ts`
- `packages/emblor/tsconfig.json`
- `packages/emblor/src/index.ts`
- `packages/emblor/src/core/index.ts`
- Delete `packages/emblor/src/addons/`
- Delete `packages/emblor/src/sortable/`
- Delete `packages/emblor/src/testing/`

### Core API and behavior

- `packages/emblor/src/types/index.ts`
- `packages/emblor/src/utils/index.ts`
- `packages/emblor/src/core/tags-input-context.tsx`
- `packages/emblor/src/core/components/tags-input-root.tsx`
- `packages/emblor/src/core/components/tags-input-input.tsx`
- `packages/emblor/src/core/components/tags-input-label.tsx` (new)
- `packages/emblor/src/core/components/tags-input-tag-list.tsx`
- `packages/emblor/src/core/components/tags-input-tag.tsx`
- `packages/emblor/src/core/components/tags-input-tag-remove.tsx`
- Rename `packages/emblor/src/core/components/tags-input-clear-trigger.tsx` to `tags-input-clear.tsx`
- Add a private live-region component or colocated implementation under `src/core/components/`
- Add a private form-control implementation colocated under `src/core/`

### Verification and documentation

- `packages/emblor/vitest.config.ts`
- `packages/emblor/tests/setup-vitest.ts`
- `packages/emblor/tests/core/**`
- `packages/emblor/tests/compat/**` or a package-smoke script (new)
- `packages/emblor/playground/package.json`
- `packages/emblor/playground/src/**`
- `packages/emblor/README.md`
- `packages/emblor/MIGRATION.md` (new)
- `.changeset/<generated-major-change>.md`
- `.changeset/pre.json` while prerelease mode is active

## Implementation Tasks

### T-01 — Consolidate the repository and remove dead hook tooling

Decisions:

- DR-0001, DR-0002, DR-0013

Obligations:

- DR-0001/O-02
- DR-0002/O-01
- DR-0013/O-01

Work:

- Delete the six abandoned package directories after verifying their resolved paths are under repository `packages/` and are not workspace members.
- Remove Husky, lint-staged, `tsc-files`, root `prepare`, and lint-staged configuration.
- Refresh the frozen lockfile without changing unrelated dependency versions.
- Preserve the already-correct workspace entries for the authoritative package, temporary playground, and website.

Verification:

- VT-01, VT-06

### T-02 — Narrow the package build and public export surface

Decisions:

- DR-0001, DR-0002, DR-0004, DR-0007, DR-0012, DR-0014

Obligations:

- DR-0001/O-01
- DR-0002/O-02
- DR-0004/O-01
- DR-0007/O-01 through O-03
- DR-0012/O-01
- DR-0014/O-03

Work:

- Delete addon, sortable, and testing source modules.
- Reduce tsup to the root entry and package exports to `.` plus `./package.json`.
- Remove obsolete TypeScript path aliases.
- Re-export supported components and public types from `src/index.ts`; stop exporting utilities and context/store types.
- Remove `@radix-ui/react-context` and ensure the runtime dependency set is empty unless implementation proves otherwise.
- Set React/ReactDOM peers to an explicit React 18-or-19 range and restore package version `1.4.8` before prerelease versioning.
- Restore/preserve correct package metadata (`description`, license, repository, publish access, files) and do not add a Node engine.
- Add automated packed-file and positive/negative export checks.

Verification:

- VT-02, VT-03, VT-07

### T-03 — Finalize compound parts and public types

Decisions:

- DR-0002, DR-0003, DR-0007, DR-0008, DR-0016, DR-0017, DR-0020, DR-0021, DR-0022, DR-0023, DR-0027, DR-0029, DR-0030, DR-0034, DR-0035, DR-0037, DR-0038, DR-0039

Obligations:

- DR-0002/O-03
- DR-0003/O-01 and O-02
- DR-0007/O-02
- DR-0008/O-01
- DR-0016/O-01 through O-04
- DR-0017/O-01 through O-04
- DR-0020/O-01 and O-02
- DR-0021/O-01 through O-03
- DR-0022/O-01 and O-03
- DR-0023/O-01 through O-04
- DR-0027/O-02
- DR-0029/O-01
- DR-0030/O-02
- DR-0034/O-01 through O-05
- DR-0035/O-01 through O-05
- DR-0037/O-01
- DR-0038/O-01
- DR-0039/O-04 and O-06

Work:

- Add polymorphic `EmblorLabel`, defaulting to a semantic `<label>`, with automatic input association and group accessible naming.
- Add the `EmblorTagList` item-render function over current Root values while retaining static children.
- Add private per-tag context and public polymorphic `EmblorTagText`, defaulting to `span` and rendering the current tag value when children are omitted.
- Require finite in-range unique Tag index registration while allowing missing indexes and rendering external strings exactly.
- Remove `index` from `EmblorTagRemove`; make TagText and TagRemove require and consume the nearest private EmblorTag context.
- Throw clear development errors for nested tag parts rendered outside EmblorTag and keep the context/hook unexported.
- Remove bespoke `labelId` from the normal public contract; preserve standard `id`, `htmlFor`, and ARIA escape hatches through element props.
- Rename the clear component and props to `EmblorClear` / `EmblorClearProps`; provide no alias.
- Keep store/context internals private; the TagList item function and TagText provide the supported rendering surface.
- Remove `generateTagId` and all automatic Tag ID assignment; preserve ordinary consumer-supplied `id` through prop forwarding.
- Document React key ownership and avoid presenting value-plus-index keys as universally stable identity.
- Ensure public prop types reflect the actual forwarded DOM attributes and accepted Root state API.
- Set the documented `addOnPaste` default to true without changing its public boolean shape.
- Set `blurBehavior` to the non-destructive `'noop'` default.
- Export `EmblorValueChangeDetails`, update `onValueChange` to receive details, and remove `onTagAdd`, `onTagRemove`, `onClearAll`, and Root `onTagClick`.
- Export `EmblorAnnouncement`, add Root `getAnnouncement`, and keep the live-region implementation private.
- Add private registration that requires exactly one Input, allows at most one TagList, and throws for missing/duplicate structural parts after descendant refs register.
- Replace singular Label registration with ordered multiple-label association while preserving explicit native naming and association overrides.
- Rename `inputBlurBehavior` to `blurBehavior`; remove `onInputKeydown`, `ariaDescribedBy`, and `ariaLabel` aliases while retaining the accepted Emblor-specific props.
- Type Root `dir` for LTR/RTL behavior while retaining its native forwarded DOM effect.
- Introduce internal polymorphic helper types so each part's `as` prop, element-specific attributes, and ref type follow the selected intrinsic element or custom React component.
- Restrict Input intrinsic polymorphism to `input` and `textarea`; require custom Inputs to forward a ref exposing focus, string-value/change, and selection APIs, with a descriptive runtime guard.
- Forward applicable remaining props on every part, including Root, and define precedence so required IDs, semantics, state attributes, and behavior cannot be accidentally replaced.
- Compose supported consumer event handlers with internal handlers consistently and document how `preventDefault` affects internal behavior.
- Preserve group/list/listitem semantics, polymorphic Label naming/focus behavior, and button semantics for non-button Remove/Clear elements without duplicating native-button activation.
- Add compile-time public API fixtures that import only from `emblor`.

Verification:

- VT-02, VT-03, VT-05

### T-04 — Centralize state and harden commit behavior

Decisions:

- DR-0003, DR-0009, DR-0010, DR-0015, DR-0018, DR-0019, DR-0020, DR-0021, DR-0022, DR-0023, DR-0024, DR-0025, DR-0026, DR-0027, DR-0028, DR-0030, DR-0031, DR-0032, DR-0036, DR-0037, DR-0038, DR-0039, DR-0040

Obligations:

- DR-0003/O-01
- DR-0009/O-01 through O-03
- DR-0010/O-01 through O-03
- DR-0015/O-01 through O-03
- DR-0018/O-01 through O-04
- DR-0019/O-01 through O-04
- DR-0020/O-03
- DR-0021/O-01 and O-03
- DR-0022/O-01 through O-04
- DR-0023/O-01
- DR-0024/O-01 through O-03
- DR-0025/O-01 through O-04
- DR-0026/O-01 through O-04
- DR-0027/O-03 and O-04
- DR-0028/O-01 through O-03
- DR-0030/O-01, O-03, and O-04
- DR-0031/O-01 through O-04
- DR-0032/O-01 through O-04
- DR-0036/O-01 and O-02
- DR-0037/O-01 through O-04
- DR-0038/O-01, O-03, and O-04
- DR-0039/O-01 through O-03 and O-05
- DR-0040/O-01, O-02, and O-04

Work:

- Move `inputValue`, `defaultInputValue`, and `onInputValueChange` to Root and route every draft mutation through one controllable-state action.
- Validate tag value props as string arrays, record initial controlled ownership, reject mode switching, and preserve external strings without applying commit policies.
- Use `blurBehavior` consistently through public types, context, and Input behavior.
- Remove the custom Input `value` / `onValueChange` boundary while composing native event handlers intentionally.
- Implement a canonical pipeline: trim, transform, reject empty, enforce min/max length, duplicate and capacity constraints, invoke validate, then commit.
- Count length constraints by Unicode code-point iteration after trim and transform; keep empty rejection ahead of the otherwise-valid zero minimum.
- Return structured rejection results from the canonical pipeline and invoke `onReject` exactly once per rejected candidate with raw value, canonical value, reason, and source.
- Combine externally controlled `invalid` with transient rejection state; clear only the transient source on draft change or successful commit.
- Reject overlength values instead of truncating them.
- Preserve an overlength draft and leave intentional truncation exclusively to a consumer `transform`; run duplicate validation against the transformed result.
- Keep draft editing active at `maxTags`; reject commits for capacity without clearing the draft or publishing a value change.
- Preserve that draft when a tag is removed and require a later explicit commit rather than auto-committing it.
- Validate numeric constraints on every render and throw consistently for non-finite, negative, fractional, or contradictory bounds.
- Apply valid dynamic constraint changes only to later actions; preserve existing values/drafts, keep prop-change callbacks and announcements silent, and immediately recompute action availability.
- Validate delimiters as single Unicode code points, deduplicate them, and compare typed delimiters as literal keys without reviving magic Enter/Tab aliases.
- Handle an empty delimiter array without constructing an empty regex; when paste committing is enabled, evaluate the whole clipboard text as one candidate.
- Escape all delimiters for literal paste splitting and preserve consumer cancellation through native `onPaste` for specialized compound parsing.
- Build paste input from the current draft plus clipboard insertion at the selected range, using draft-end offsets when selection APIs are unavailable.
- Replace repeated stale-closure paste commits with an ordered batch evaluator and one tag-state publication.
- Evaluate paste candidates against the accumulating next array, emit individual rejections for non-empty failures, retain ordered successes, and publish exactly one `add-many` transition when any succeed.
- Clear draft on partial/complete paste success, preserve it when every candidate rejects, and ignore empty split segments without rejection.
- After total paste rejection, restore the original draft selection safely after render without overwriting later user selection changes.
- Use literal `delimiters`, intrinsic Enter, and opt-in `addOnTab`; preserve native Tab when disabled.
- Make all three blur behaviors work for controlled and uncontrolled drafts.
- Evaluate blur behavior at the whole-Root focus boundary, run consumer Input `onBlur` first, and keep internal transitions, disabled/read-only state, and unmount silent.
- Enforce `minTags` inside remove and clear actions, not only through button disabled state; disable clear whenever clearing all would violate the minimum.
- Treat Clear as strictly remove-all: disable it whenever `minTags > 0`, never retain an arbitrary subset, and emit no change from guarded activation.
- Keep `required` independent from the mutation guard so required-only fields can be cleared into an invalid empty state.
- Emit exactly one `onValueChange(nextValue, details)` for each accepted add, add-many, remove, or clear transition using canonical values and deterministic metadata.
- Record pending focus intent for accepted remove/Clear requests and reconcile it only after the exact requested next value renders.
- Feed accepted mutation and rejection events into the announcement pipeline in deterministic order without announcing guarded actions or controlled prop synchronization.
- Keep rejected candidates on `onReject` only, and do not emit changes when controlled props synchronize from their owner.
- Check active IME composition before every Emblor key command; allow native composing events and draft changes without tag actions until a later ordinary key event.
- Add internal native form participation that submits one ordered entry per committed tag, excludes disabled values, preserves read-only values, and does not expose implementation controls.
- Enforce required against committed tags only and route native invalid focus/state to the visible Input.
- Subscribe uncontrolled Root state to its owning form's native reset event and restore both uncontrolled defaults; leave controlled state unchanged.
- Ignore disabled/read-only commit attempts without rejection callbacks.

Verification:

- VT-03, VT-04

### T-05 — Align focus and accessibility with actual semantics

Decisions:

- DR-0001, DR-0003, DR-0009, DR-0010, DR-0011, DR-0016, DR-0017, DR-0018, DR-0019, DR-0020, DR-0021, DR-0023, DR-0025, DR-0027, DR-0028, DR-0029, DR-0030, DR-0031, DR-0032, DR-0034, DR-0035, DR-0037, DR-0038, DR-0039, DR-0040

Obligations:

- DR-0001/O-01
- DR-0003/O-03
- DR-0009/O-03
- DR-0010/O-02
- DR-0011/O-01 through O-03
- DR-0016/O-03
- DR-0017/O-04
- DR-0018/O-02 and O-05
- DR-0019/O-03 and O-04
- DR-0020/O-01 through O-03
- DR-0021/O-02 and O-03
- DR-0023/O-02 and O-03
- DR-0025/O-01 and O-03
- DR-0027/O-01 through O-04
- DR-0028/O-01 and O-02
- DR-0029/O-01 through O-04
- DR-0030/O-01 and O-02
- DR-0031/O-04
- DR-0032/O-02
- DR-0034/O-01, O-02, O-04, and O-05
- DR-0035/O-01 through O-05
- DR-0037/O-04
- DR-0038/O-01 through O-04
- DR-0039/O-04 and O-05
- DR-0040/O-01 through O-04

Work:

- Remove `activeIndex`, its setters, public focus props, `data-active`, and virtual-focus ARIA.
- Keep one internal `focusedIndex` synchronized with real tag focus; committing leaves focus in the input and the index null.
- Keep current-index node registration private and ephemeral; do not use indexes to claim stable DOM identity.
- Navigate the sparse mounted-node registry in ascending current value-index order and fail fast on invalid or duplicate registered indexes.
- Correct click, arrow, Home/End, Backspace/Delete, removal, and input-return focus behavior.
- After acknowledged removal, focus the mounted Tag at the resulting removed index, then the nearest lower mounted index, then Input; after acknowledged Clear, focus Input.
- Preserve consumer-directed focus, keep guarded/cancelled/external-sync paths silent, and cancel controlled pending intent when the owner refuses or diverges from the requested array.
- Suspend commit, deletion, and focus-navigation interpretation during active IME composition without preventing native composing keys.
- Resolve explicit/inherited effective direction and map horizontal arrows to physical movement; keep Home/End in value order and deletion direction-independent.
- Apply runtime direction changes to later events without reordering values, and treat arbitrary CSS visual reordering as consumer responsibility.
- Expose `data-max-reached` on Root and Input while retaining native input focus/editability and avoiding implicit disabled, read-only, or `aria-disabled` state.
- Recompute capacity, Clear, and Remove state immediately after valid dynamic constraint changes while preserving corrective actions toward the configured range.
- Keep one required Input and at most one TagList registration across portals, Strict Mode, and atomic conditional replacement; aggregate automatically associated Labels in deterministic DOM order.
- Classify keyboard versus pointer activation consistently for remove and clear metadata; keep ordinary Tag `onClick` consumer-owned.
- Verify context-derived TagRemove always targets its containing Tag after list changes and nested contexts remain isolated.
- Remove `aria-autocomplete`, `aria-expanded`, `aria-activedescendant`, and any unnecessary explicit textbox role.
- Connect Label, Input, Root group, and optional descriptions with valid native/ARIA associations.
- Compose native `onKeyDown` on Input and native activation handlers on Remove/Clear according to the documented event-precedence contract; preserve native `aria-describedby` and `aria-label` props.
- Give polymorphic non-button Remove/Clear elements role, focus, Enter/Space, disabled, scroll-prevention, and exactly-once behavior while leaving native button activation native.
- Validate the required input-like DOM contract after Input ref registration and preserve Label click-to-focus across non-label renderers.
- Restore a totally rejected paste's original selection only while the same draft/focus operation remains current.
- Resolve focus exit after the event sequence, treating registered portals and internal pointer targets as inside Root so blur actions cannot race Remove/Clear activation.
- Reflect committed-tag required validity on the visible Input and ensure native invalid handling cannot strand focus on an internal control.
- Render a private polite, atomic, visually hidden live region from Root and announce add, remove, clear, and rejection outcomes without exposing store internals.
- Format every announcement through default English messages or consumer `getAnnouncement`; suppress only when the formatter returns an empty string.
- Ensure repeat announcements are observable and partial paste uses documented rejection-then-add-many ordering.
- Expose combined invalid state through Root/Input `data-invalid` and visible-input `aria-invalid`; preserve consumer `aria-describedby` for external messages.
- Ensure disabled/read-only/min/max states use native attributes where available and stable data attributes for styling.
- Expose Clear's `minTags` guard through native disabled and `data-disabled`; do not add partial-clear or hidden semantics.

Verification:

- VT-05

### T-06 — Expand tests and establish a green local quality gate

Decisions:

- DR-0001, DR-0004, DR-0012, DR-0013

Obligations:

- DR-0004/O-02
- DR-0012/O-03
- DR-0013/O-02

Work:

- Fix baseline test typechecking by importing Vitest globals consistently or configuring them intentionally.
- Add ESLint 9 flat configuration scoped to TypeScript/React source, tests, scripts, and playground.
- Add behavior tests for controlled/uncontrolled values and drafts; transforms; validation; transformed duplicates; length and tag bounds; all blur modes; delimiters; Enter/Tab; paste batches; callbacks; read-only/disabled; and clear invariants.
- Add focus and accessible-name/announcement tests for Label, navigation, deletion, and corrected ARIA.
- Add a single local `check` command covering format check, lint, typecheck, tests, build, and package verification.

Verification:

- VT-04, VT-05, VT-06

### T-07 — Modernize Node, React compatibility, and CI

Decisions:

- DR-0004, DR-0013, DR-0014

Obligations:

- DR-0004/O-01 and O-02
- DR-0013/O-02
- DR-0014/O-01 and O-02

Work:

- Set root engines to `>=22 <23 || >=24 <25`, add `.node-version` for Node 24, and update contributor documentation.
- Replace obsolete Node 18 and Actions v3 workflow setup with maintained versions.
- Consolidate duplicate CI responsibilities where practical: one required package-quality workflow for pushes/PRs, plus publish workflow.
- Run the full package gate on Node 24 and compatibility checks on Node 22.
- Verify React 18 and React 19 using isolated consumers installed from the packed tarball so peer resolution, ESM/CJS, declarations, rendering, and basic interaction exercise the artifact users receive.
- Publish only from a successful Node 24 workflow using a frozen lockfile.

Verification:

- VT-07

### T-08 — Slim the playground and document v2 migration

Decisions:

- DR-0001, DR-0005, DR-0008, DR-0015, DR-0016, DR-0017, DR-0018, DR-0019, DR-0020, DR-0021, DR-0022, DR-0023, DR-0024, DR-0025, DR-0026, DR-0027, DR-0029, DR-0030, DR-0031, DR-0032, DR-0034, DR-0035, DR-0036, DR-0037, DR-0038, DR-0039, DR-0040

Obligations:

- DR-0001/O-03
- DR-0005/O-01 and O-02
- DR-0008/O-01
- DR-0015/O-01 and O-02
- DR-0016/O-03 and O-04
- DR-0017/O-01, O-02, and O-04
- DR-0018/O-05
- DR-0019/O-04
- DR-0020/O-02
- DR-0021/O-02
- DR-0022/O-03
- DR-0023/O-03
- DR-0024/O-03
- DR-0025/O-03
- DR-0026/O-04
- DR-0027/O-02
- DR-0029/O-04
- DR-0030/O-04
- DR-0031/O-05
- DR-0032/O-05
- DR-0034/O-03 and O-05
- DR-0035/O-05
- DR-0036/O-03
- DR-0037/O-05
- DR-0038/O-05
- DR-0039/O-06
- DR-0040/O-05

Work:

- Remove addon, sortable, cmdk, and Radix Popover playground stories and dependencies.
- Keep a minimal core smoke harness demonstrating controlled and uncontrolled TagList rendering, Root-controlled draft, Label, TagText, remove, clear, validation/transform, and keyboard behavior through root imports.
- Use canonical nested composition with `index` only on EmblorTag and context-derived TagText/TagRemove.
- Rewrite the package README against the final v2 API and installation/import contract.
- Document styling through classes, inline styles, standard/data attributes, state selectors, and `as`, including the absence of built-in CSS, `asChild`, theme, and variant APIs.
- Document native form submission as repeated values, bracket-name pass-through, required semantics, disabled/read-only behavior, and controlled versus uncontrolled reset ownership.
- Document `invalid`, every rejection reason/source, transient clearing, `onReject`, and consumer-owned error messages connected with `aria-describedby`.
- Document that consumers own React keys and optional Tag DOM IDs, including duplicate and reorder considerations.
- Add `MIGRATION.md` with v1-to-v2 before/after examples, `Tag[]` to `string[]`, prop mappings, removed features, and consumer-composition guidance.
- Document the discriminated value-change details and migration from convenience callbacks to `onValueChange` or Tag's native `onClick`.
- Document `blurBehavior` and native part-level `onKeyDown`, `aria-describedby`, and `aria-label`, including migration from removed aliases.
- Document that `maxLength` rejects and show explicit truncation through `transform` when desired.
- Document Clear's all-or-nothing `minTags` behavior and its distinction from native `required` validation.
- Document partial ordered paste acceptance, individual rejection events, one add-many transition, and draft clearing rules.
- Document default English announcements, `getAnnouncement` localization/customization, empty-string suppression, and the private live-region semantics.
- Document explicit/inherited `dir`, physical arrow behavior, value-order Home/End, and the requirement that custom visual order match DOM order.
- Include migration documentation in the published package if package-size verification remains reasonable.
- Verify there is no `website/` diff.

Verification:

- VT-08

### T-09 — Prepare and validate the v2 alpha release

Decisions:

- DR-0004, DR-0012, DR-0014

Obligations:

- DR-0004/O-02
- DR-0012/O-01 through O-03
- DR-0014/O-02

Work:

- Add a major Changeset entry describing the hard break.
- Enter Changesets alpha prerelease mode only after all prior verification passes.
- Confirm the generated version derives from `1.4.8` and produces `2.0.0-alpha.*`.
- Inspect the final tarball and install it in clean React 18 and React 19 consumers.
- Publish under a non-`latest` tag such as `next`; verify npm metadata and installation by exact version/tag.
- Record alpha feedback and resolve breaking changes through new decisions before stable promotion.

Verification:

- VT-09

## Verification Tasks

### VT-01 — Repository consolidation verification

- `git status` shows only intended changes.
- `pnpm-workspace.yaml` resolves only the authoritative package, its temporary playground/approved fixtures, and website.
- No abandoned package directory or Husky/lint-staged configuration remains.
- A frozen install succeeds on a supported Node version.

### VT-02 — Package boundary and artifact verification

- Build produces only root ESM, CJS, declaration, and sourcemap artifacts needed by the export map.
- `npm pack --dry-run --json` contains only approved files and no addon/sortable/testing/core/types/utils subpath artifacts.
- Clean consumers can import and require the package root.
- Attempts to import removed subpaths fail with `ERR_PACKAGE_PATH_NOT_EXPORTED` or equivalent resolver failure.
- Packed runtime dependencies contain no Radix, cmdk, sorting, Tailwind, CVA, or internal helper exposure.

### VT-03 — Public API type verification

- TypeScript fixtures compile all supported components and prop types from `emblor` root.
- Removed names, subpaths, labelId, index-control props, overloaded validation, singular delimiter, and Input-owned custom value API fail typechecking in negative fixtures where practical.
- Negative fixtures reject `inputBlurBehavior`, `onInputKeydown`, `ariaDescribedBy`, and `ariaLabel`; positive fixtures use their accepted native replacements.
- Declarations contain `EmblorLabel`, `EmblorClear`, Root draft props, `transform`, `validate`, `delimiters`, and `addOnTab`.
- Compile-time fixtures verify that every part accepts applicable `className`, `style`, ARIA, custom `data-*`, and selected-element attributes.
- Polymorphic fixtures verify intrinsic elements, typed custom components, invalid prop rejection, and correctly typed refs through `as`.
- Input fixtures accept intrinsic input/textarea and compatible ref-forwarding components while rejecting incompatible intrinsic elements; runtime tests reject incompatible custom refs.
- Public API fixtures reject `generateTagId`, while runtime tests verify no automatic Tag ID and preservation of a supplied `id`.
- Public API fixtures reject `index` on TagRemove and runtime tests verify missing-parent errors for TagText/TagRemove.

### VT-04 — State and behavior verification

- Vitest covers controlled/uncontrolled tags and drafts, commit clearing, canonical transformation/validation order, bounds, duplicates, clear minimums, blur modes, delimiter/Enter/Tab behavior, ordered paste batching, and callback values/order.
- Blur tests cover the noop default, commit/discard effects, external versus internal and portal focus movement, pointer races, consumer cancellation, rejection, disabled/read-only silence, unmount, and callback ordering.
- IME tests cover composing Enter, delimiters, Tab, removal/navigation keys, draft changes, composition end, and the first subsequent ordinary commit.
- Rejection tests cover every reason and source, raw/canonical values, exactly-once emission, controlled invalid precedence, transient clearing, and disabled/read-only silence.
- Length tests verify post-transform evaluation, unchanged overlength draft, callback silence, explicit truncation transforms, and duplicate validation after transformation.
- Unicode length tests cover BMP text, supplementary-plane emoji, combining sequences, flags/ZWJ sequences, post-transform values, and zero minimum/maximum bounds.
- Capacity tests verify editable/focusable Input behavior, preserved controlled/uncontrolled drafts, `max-tags` rejection across commit sources, callback silence, and explicit disabled/read-only precedence.
- Constraint-configuration tests cover negative, fractional, `NaN`, infinite, and contradictory bounds with identical fail-fast behavior across render and dynamic updates.
- Dynamic-constraint tests verify preserved controlled/uncontrolled values and drafts, prospective enforcement, corrective actions, recomputed capacity/action state, and callback/announcement silence.
- Delimiter tests cover code-point validation, empty and duplicate arrays, punctuation, whitespace, newline/tab paste separators, surrogate-pair emoji, regex metacharacters, whole-text paste, native cancellation, and rejected compound strings.
- Compound-cardinality tests cover missing/duplicate Input and duplicate TagList errors in ordinary, portal, and Strict Mode trees; atomic replacement; optional TagList; custom/read-only/disabled Inputs; multiple ordered Labels; explicit association overrides; and repeated Clear controls.
- Minimum tests verify Clear at zero/positive/dynamic `minTags`, required-only clearing, individual removal boundaries, callback silence, and consumer-controlled below-minimum values.
- Mutation callback tests cover exactly-once emission, every detail variant/source, canonical values, controlled/uncontrolled parity, paste batching, guarded actions, and controlled prop synchronization silence.
- Form tests cover ordered repeated `FormData`, exact and bracketed names, empty values, disabled omission, read-only submission, committed-only required validity, invalid focus routing, and controlled/uncontrolled native reset.
- No multi-segment paste loses earlier accepted values.
- Paste tests cover mixed validity, transformed intra-batch duplicates, capacity exhaustion, empty segments, total rejection, draft clearing/preservation, rejection-before-change callback order, and controlled/uncontrolled parity.
- Prospective-paste tests cover prefix/suffix/middle insertion, selection replacement, missing selection offsets, whole-draft parsing, empty clipboard/delimiters, native-disabled behavior, consumer cancellation, and guarded selection restoration.
- Controlled state never displays a stale committed draft.
- External-state tests cover runtime shape errors, verbatim empty/whitespace/duplicate/out-of-bounds strings, initial precedence, mode-switch errors, and callback/announcement silence.
- Render-index tests cover invalid/out-of-range/duplicate indexes, portals, Strict Mode, atomic replacement, exact TagText, omitted nodes, sparse navigation, form/count preservation, and array reorder updates.

### VT-05 — Focus and accessibility verification

- Tests assert accessible names from `EmblorLabel`, label click/input association, standard description escape hatches, and no combobox/listbox ARIA.
- Tests cover multiple automatic Labels, deterministic Root naming, explicit native naming/association precedence, required/duplicate Input failures, and optional/duplicate TagList behavior.
- Actual focus and `data-focused` agree through input/tag navigation, clicking, and deletion.
- Navigation tests cover explicit/inherited/dynamic LTR and RTL, physical arrows, input caret boundaries, value-order Home/End, and direction-independent deletion.
- Focus navigation remains correct after controlled insertion, removal, and reorder-like updates despite the absence of generated IDs.
- Removal-focus tests cover first/middle/last and sparse targets, Tag keys, pointer/keyboard Remove, controlled acceptance/refusal/divergence, consumer focus movement, guards/cancellation, external sync, Clear, and exactly-once restoration.
- Context-derived TagRemove targets its containing Tag after updates; private tag contexts remain isolated.
- Screen-reader live region announces add, remove, clear, and rejection outcomes.
- Tests cover every default announcement, custom/localized formatters, empty suppression, repeat messages, partial-paste ordering, polite/atomic semantics, and silence for guarded or controlled-sync actions.
- Disabled and read-only behavior prevents mutation while preserving appropriate navigation semantics.
- Runtime tests verify forwarded styling, ARIA, and data props plus consumer event composition without loss of required internal behavior.
- Polymorphic semantic tests cover required roles, Label naming/focus, non-button Enter/Space/pointer activation, disabled guards, Space scroll prevention, native-button non-duplication, and protected prop precedence.
- Tests verify native event cancellation/composition and preservation of consumer `aria-describedby`/`aria-label` without custom alias precedence.
- Internal form controls remain absent from the accessibility surface, and required/invalid state is exposed through the visible input.
- Root/Input expose combined invalid styling state, visible input exposes `aria-invalid`, and consumer `aria-describedby` is preserved.
- Root/Input expose `data-max-reached` at capacity without implicit disabled, read-only, or `aria-disabled`; focus and draft editing remain available.

### VT-06 — Full local quality gate

- Frozen install succeeds.
- Prettier check succeeds.
- ESLint succeeds.
- Package and fixture typechecks succeed.
- All Vitest suites succeed.
- Package and temporary playground builds succeed.
- Package verification succeeds.
- No rebase or unrelated website changes appear in the diff.

### VT-07 — Runtime compatibility and CI verification

- Required CI passes on Node 22 and 24 as planned.
- Packed consumers pass with React/ReactDOM 18 and 19 without peer warnings.
- Type declarations compile against React 18 and 19 type packages.
- Publish workflow uses Node 24 and runs only after the full quality gate.

### VT-08 — Documentation and playground verification

- Playground uses only `emblor` root imports and has no cmdk, Radix Popover, addon, or sortable dependencies/stories.
- README examples compile against the packed API.
- Migration guide covers every removed v1 capability and the required state/markup conversions.
- `git diff -- website` is empty.

### VT-09 — Alpha release verification

- Changesets computes `2.0.0-alpha.*` from the `1.4.8` baseline.
- Final tarball passes VT-02, React 18/19 clean-consumer smoke tests, and README example compilation.
- Published alpha is reachable through its exact version and prerelease tag.
- npm `latest` remains on v1 until stable promotion is separately approved.

## Data / State Changes

- Public tags remain `string[]`.
- External tag arrays remain authoritative verbatim strings; only built-in mutation candidates pass through transform and validation.
- Root gains controlled/uncontrolled draft state and becomes its sole owner.
- Internal store removes `activeIndex` and retains only actual tag focus.
- Announcement state expands enough to represent additions, removals, clearing, and rejection, including paste outcomes.
- No persistence or migration of stored user data is involved.

## API / Contract Changes

- Root-only import path: `emblor`.
- Add `EmblorLabel`, `EmblorLabelProps`, `EmblorTagText`, and `EmblorTagTextProps`.
- Rename `EmblorClearTrigger` to `EmblorClear`; no alias.
- Add the `EmblorTagList` item-render function as the supported controlled/uncontrolled rendering contract while retaining static children.
- Remove `index` from `EmblorTagRemove`; nested TagText/TagRemove derive current tag data from EmblorTag.
- Replace `validateTag` with `transform` and `validate`.
- Make `minLength`/`maxLength` rejection-only constraints; implicit truncation is removed.
- Define `minLength`/`maxLength` in Unicode code points rather than UTF-16 units or grapheme clusters.
- Keep Input editable at `maxTags`; capacity rejects commits and preserves the draft rather than implicitly disabling the input.
- Require finite non-negative integer bounds with ordered min/max pairs; fail fast on invalid configuration and never retroactively reconcile state after valid dynamic changes.
- Require single-code-point literal delimiters; accept an empty array, deduplicate entries, and leave compound paste parsing to native `onPaste` interception.
- Require exactly one Input and permit at most one optional TagList per Root; allow multiple native Labels and repeated action/presentation parts.
- Add Root `invalid` and structured `onReject` with exported rejection types.
- Add Root `getAnnouncement` with exported announcement types and default localizable English formatting.
- Replace `delimiter` magic-key array with literal `delimiters` and `addOnTab`.
- Rename `inputBlurBehavior` to `blurBehavior`; use native part-level DOM prop names instead of custom aliases.
- Add Root `inputValue`, `defaultInputValue`, and `onInputValueChange`.
- Add Root `name` and `required` with repeated-value native form participation.
- Change `onValueChange` to include discriminated mutation details; remove `onTagAdd`, `onTagRemove`, `onClearAll`, and Root `onTagClick`.
- Remove Input's custom `value` / `onValueChange` state boundary.
- Remove public focus/active index props and setters.
- Remove `generateTagId`; React keys and optional Tag DOM IDs are consumer-owned.
- Stop exporting context, store types, and utilities.
- Remove addon, sortable, testing, core, types, and utils subpaths.
- Guarantee applicable DOM-prop forwarding and type-safe `as` polymorphism on every public part; do not add `asChild` or a library styling API.
- Preserve required semantics across `as`; Input accepts input/textarea or a compatible ref-forwarding custom editor, and non-button action parts receive button-equivalent behavior.

## UI / UX Changes

- Label association becomes automatic through `EmblorLabel`.
- Input no longer claims autocomplete/listbox semantics.
- Tag focus styling reflects actual DOM focus only.
- Successful individual removal restores focus by resulting mounted position; successful Clear returns focus to Input after the requested value is reflected.
- Active IME composition owns its keyboard events and never triggers Emblor tag commands.
- Horizontal arrows follow effective LTR/RTL physical direction; Home/End remain value-order operations.
- Enter commits by default; Tab commits only when opted in.
- Blur preserves the draft by default; opt-in commit or discard runs only when focus leaves the complete Root boundary.
- Rejections and mutations are announced through an internal live region.
- Consumer-controlled and transient rejection state share stable invalid styling and ARIA hooks while visible error content remains consumer-owned.
- Internal announcements are polite, atomic, accessible by default, and customizable or suppressible through plain-text formatting.
- Native required validity reflects committed tags, and invalid submission directs focus to the visible Input.
- Clear remains remove-all, is disabled whenever `minTags > 0`, and is independent from required-only invalid state.
- Paste partially accepts valid ordered candidates and emits one `add-many` value change for the accepted batch.
- Paste-to-add defaults on and tokenizes the complete browser-equivalent prospective draft rather than clipboard text in isolation.
- Clear is unavailable when clearing all would violate `minTags`.

## Migration Steps

1. Consolidate the repository and build surface without altering core behavior.
2. Land the final public API and state ownership changes as one coherent breaking slice.
3. Harden behavior/accessibility and expand tests against that final API.
4. Update tooling, compatibility checks, playground, README, and migration guide.
5. Restore the `1.4.8` baseline, generate prerelease metadata, pack, smoke-test, and publish alpha.

Consumer migration is documented separately in `packages/emblor/MIGRATION.md` during T-08.

## Rollback Plan

- Keep implementation work in small commits aligned to T-01 through T-09 so individual slices can be reverted without `git reset` or destructive history edits.
- Deleted source and orphan packages remain recoverable from Git history.
- Before publication, rollback is a normal revert plus plan/decision resync.
- After alpha publication, do not unpublish as the normal recovery path. Publish a corrected alpha or deprecate the affected prerelease version/tag.
- Because alpha never owns npm `latest`, v1 consumers remain unaffected during rollback.
- No data migration rollback is required.

## Dependencies

- Node 24 primary, Node 22 compatibility.
- pnpm 9 per repository package-manager metadata unless separately upgraded.
- React and ReactDOM peer ranges covering 18 and 19 only.
- Existing Vitest, Testing Library, TypeScript, tsup, Prettier, Changesets, and Turbo tooling, upgraded only where required for supported Node/React compatibility.
- ESLint 9 flat configuration and the minimal TypeScript/React plugins required to make lint meaningful.

## Open Questions

None.

## To-Dos

- Begin T-01 when implementation is authorized.

- [ ] T-01 — Consolidate repository and remove dead hook tooling.
- [ ] T-02 — Narrow package build and exports.
- [ ] T-03 — Finalize compound parts and public types.
- [ ] T-04 — Centralize state and harden commit behavior.
- [ ] T-05 — Align focus and accessibility.
- [ ] T-06 — Expand tests and establish local gate.
- [ ] T-07 — Modernize Node/React compatibility and CI.
- [ ] T-08 — Slim playground and write documentation.
- [ ] T-09 — Prepare and validate alpha release.
