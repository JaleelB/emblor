# Implementation Review and Architecture Freeze: Emblor v2 Vertical Slice

## Review Status

Verified and architecture-frozen. Every Required obligation is `Verified`, all freeze gates passed, and DR-0041 records the accepted architecture boundary.

## Review Inputs

- [Implementation Plan](./plan.md)
- [Decision Manifest](./decision-manifest.md)
- [Decision Coverage](./coverage.md)
- Git commit(s) under review: working tree on `feat/emblor-v2-refactor`; no commit was created.
- Package tarball under review: `emblor-1.4.8.tgz` generated in `%TEMP%\emblor-v2-slice-artifacts` (not committed). The manifest baseline now matches DR-0012.
- Acceptance-lab build/URL: `http://localhost:5173/` via the T3 preview tab.

## Automated Evidence

| Gate                     | Command / artifact                                | Result                   | Evidence                                                                                                                                                          |
| ------------------------ | ------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Format                   | `pnpm prettier-check`                             | Pass                     | Root README and package sources are formatted; deferred website/planning corpus remains untouched.                                                                |
| Lint                     | `pnpm lint` and `pnpm -C packages/emblor lint`    | Pass                     | Package ESLint and deferred website `next lint` pass.                                                                                                             |
| Typecheck                | `pnpm -C packages/emblor typecheck`               | Pass                     | Public API fixture and package source typecheck.                                                                                                                  |
| Unit/integration         | `pnpm -C packages/emblor test`                    | Pass                     | 5 files, 51 tests passed without expected-error stderr or React `act(...)` warnings.                                                                              |
| Browser behavior         | T3 preview at `http://localhost:5173/`            | Pass for exercised slice | Controlled add, uncontrolled reset, paste, actual-focus clearing, LTR/RTL navigation, required FormData, polymorphic DOM, and narrow/wide layouts were exercised. |
| Production build         | `pnpm -C packages/emblor build`; playground build | Pass                     | Package and playground production builds pass. Workspace build is separately blocked by the deferred website.                                                     |
| Package contents/exports | `pnpm -C packages/emblor pack`; export tests      | Pass                     | Tarball contains only package metadata, README/LICENSE, and `dist`; export map is `.` plus `./package.json`.                                                      |
| React 18 consumer        | Current workspace React 18.3.1 tests/build        | Pass                     | Runtime and type fixture pass against the React 18 workspace.                                                                                                     |
| React 19 consumer        | Packed React 19.1.1 fixture                       | Pass                     | Isolated consumer compiled against packed declarations and mounted the tarball in a client DOM.                                                                   |
| Node 22                  | `node -v`                                         | Pass                     | Current runtime is Node v22.23.2.                                                                                                                                 |
| Node 24                  | Node v24.19.0 via NVM executable                  | Pass                     | Package typecheck, 51 tests, and production build passed without changing the active Node 22 shell.                                                               |
| Packed consumers         | `pnpm -C packages/emblor test:compat`             | Pass                     | Fresh React 18.3.1 and React 19.1.1 consumers install the tarball, compile its public API, and mount it in a client DOM.                                          |
| Documentation examples   | README/MIGRATION review and formatting            | Pass                     | Root/package README and migration guide match the root-only API; representative examples compile from the packed artifact.                                        |

## Visual Acceptance Evidence

Capture or link evidence for:

- [x] Canonical controlled composition and event inspector.
- [x] Uncontrolled add/remove/reset behavior.
- [x] Transform, partial paste, and capacity behavior; structured rejection was covered by automated tests.
- [x] LTR and RTL keyboard/focus behavior, including clearing stale Tag focus after leaving the component.
- [x] Required form, repeated FormData, invalid styling, and guarded controls; disabled/read-only submission semantics are covered by integration tests.
- [x] Polymorphic elements and consumer-owned styling/DOM props.
- [x] Narrow and wide viewport usability.
- [x] Keyboard-only core walkthrough through input and tag focus.

Evidence location: T3 preview tab `tab_1` at `http://localhost:5173/`; snapshots were captured during this review and are not committed product artifacts.

## Public Surface Review

- [x] Only `emblor` and `emblor/package.json` are exported.
- [x] Exactly eight supported component exports are present.
- [x] Supported public types are exported from the root.
- [x] No context, store, utilities, identity helper, provisional alias, or feature API leaks.
- [x] Canonical controlled and uncontrolled examples compile from the packed artifact in React 18 and React 19 consumers.
- [x] `placeholderWhenFull` is on Root, not Input.
- [x] Production examples do not recommend unstable compound keys.

## Decision Coverage Review

Coverage is synchronized: all 64 Required obligations are `Verified`.

Use the following meanings for the statuses in `coverage.md`:

- `Implemented` while code exists but verification is incomplete.
- `Verified` when implementation and evidence satisfy the obligation.
- `Partially Covered` when a material gap remains.
- `Violated` when implementation contradicts the accepted decision.

No Required obligation is deferred, partially covered, implemented-only, or violated.

## Resolved Review Findings

- Tag focus state now clears on actual Tag blur and ignores focus bubbling from nested actions.
- Controlled remove/Clear focus intents survive unchanged renders, wait for exact acknowledgement, cancel on divergence, and respect consumer-directed focus even after the origin disconnects.
- Clear and TagRemove inspect their rendered DOM node, so custom components resolving to native buttons receive `type="button"`/`disabled` and avoid synthetic keyboard activation.
- Live-region output now drains a timed queue, preserving every partial-paste rejection followed by the `add-many` announcement.
- `EmblorInput` publicly accepts native `onChange`, matching its runtime behavior and DR-0015.
- README/playground examples use stable value keys under the default no-duplicates contract, the focus inspector observes focus events, default remove labels include the tag value, and selection restoration uses `ownerDocument`.
- The package development version is restored to the published `1.4.8` baseline required by DR-0012.

## Deviations

| ID    | Planned contract                                      | Observed implementation                                                                                                                            | Classification            | Resolution                                                                                                |
| ----- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| D-001 | Workspace-wide build includes the deferred v1 website | The package and playground build, while the untouched v1 website retains its existing `ScrollArea` JSX type error.                                 | Resolved scope boundary   | DR-0005 explicitly excludes website migration; package/playground gates are authoritative for this slice. |
| D-002 | Full compatibility and browser matrix                 | React 18/19, Node 22/24, LTR/RTL, portals/Strict Mode, packed consumers, selection, blur, sparse indexes, and ownership transitions are exercised. | Resolved verification gap | Closed by the hardening suite and compatibility fixtures.                                                 |

D-001 is resolved as an explicit scope boundary rather than an implementation exception: DR-0005 requires the v1 website to remain unchanged, and the package/playground-only build is the authoritative vertical-slice gate.

Classify each deviation as:

- Code defect: change implementation to match the decision.
- Plan gap: add tasks and verification, then resync coverage.
- Architecture change: create a new accepted decision that supersedes the old one, then resync this plan.

## Risks Rechecked

- [x] Delayed acknowledgement, refusal, divergence, and deliberate consumer focus are covered.
- [x] Portals and Strict Mode preserve singleton, boundary, label, action, and Tag registration.
- [x] Native form behavior is exercised in the browser; selection and restoration edge cases pass automated coverage.
- [x] Acceptance-lab styling has not leaked into package source or API.
- [x] External values remain authoritative and callback-silent; tag and draft ownership switching throw.
- [x] Consumer event cancellation cannot disable required safety behavior in the covered paste path.
- [x] Removed subpaths are absent from the package export map and packed artifact.

## Architecture Freeze Gate

The architecture may be proposed for freeze only when:

1. Every Required obligation is `Verified`.
2. All automated and visual gates pass with linked evidence.
3. The packed artifact succeeds in representative React 18 and 19 consumers.
4. Documentation and the acceptance lab agree with exported types and runtime behavior.
5. Every deviation is resolved or captured in a superseding decision.
6. Jaleel explicitly approves the reviewed API and behavior.

All six gates passed. Jaleel conditionally authorized the freeze after complete verification on 2026-08-12; DR-0041 records exactly what is frozen and what remains changeable during alpha.

## Final Recommendation

**Freeze the architecture.** The evidence supports the accepted v2 vertical-slice contracts with no unresolved Required obligation or deviation. Future changes to the frozen boundary require an explicit superseding decision and coverage resynchronization.
