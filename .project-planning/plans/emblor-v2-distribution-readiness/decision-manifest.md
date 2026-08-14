# Decision Manifest: Emblor v2 Package & Distribution Readiness

## Required

| Decision | Why it governs Phase 2 |
| --- | --- |
| DR-0001 | Requires a dependency-light headless tag-input package and excludes v1 compatibility, styling, autocomplete, and sortable functionality. |
| DR-0002 | Requires one published `emblor` package with no feature packages or feature subpaths. |
| DR-0004 | Requires explicit React 18 and React 19 package and consumer compatibility. |
| DR-0007 | Freezes the root-only code API plus the `./package.json` metadata export and keeps internals private. |
| DR-0012 | Keeps the development version at `1.4.8`, forbids stable publication, and reserves prerelease metadata/publication for the later alpha phase. |
| DR-0013 | Makes CI the authoritative quality boundary and requires reproducible package-content/export verification. |
| DR-0014 | Requires Node 24 as the release runtime and Node 22 as the compatibility runtime, without a published-package Node engine. |
| DR-0016 | Requires packed public declarations to preserve native props, polymorphic element types, styling props, events, and refs. |
| DR-0035 | Requires the supported polymorphic intrinsic/custom-element contracts and refs to remain expressible and usable by consumers. |
| DR-0041 | Freezes the complete v2 public and behavioral architecture while allowing packaging, verification, and release-automation hardening. |

## Related

| Decision | Relationship |
| --- | --- |
| DR-0003 | The public `string[]` model must remain visible in declarations, but Phase 2 does not alter it. |
| DR-0005 | Keeps `website/` on v1 and the package playground temporary; neither is a Phase 2 implementation surface. |
| DR-0018 | Native-form behavior is exercised through the preserved browser gate, not redesigned here. |
| DR-0020 | Consumer-owned occurrence identity informs representative packed examples but does not create distribution work. |

All other accepted behavioral decisions remain protected transitively by DR-0041 and the Phase 1 regression gates. Phase 2 does not reopen or separately reinterpret them.

## Not Applicable

- DR-0006 and DR-0033 are superseded and impose no active obligations.
- DR-0008 through DR-0011, DR-0015, DR-0017, DR-0019, and DR-0021 through DR-0040 govern runtime behavior already verified in Phase 1. They become direct Phase 2 inputs only if packaging evidence exposes a concrete artifact-only regression.
- No new product, component, state, keyboard, focus, validation, form, accessibility, or styling decision is required for this phase.

## Deferred

None. Alpha versioning, Changesets prerelease mode, release notes, npm publication, and website migration are later roadmap phases rather than deferred Phase 2 obligations.

## Conflicts or Uncertainty

None. The accepted decisions consistently require one public, root-only, React 18/19 package verified on Node 22/24. If a distribution fix appears to require changing a frozen export, type, public prop, semantic contract, package boundary, or excluded-feature rule, stop Phase 2 and create a superseding decision record before continuing.
