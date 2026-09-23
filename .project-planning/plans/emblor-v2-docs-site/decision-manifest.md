# Decision Manifest: Emblor v2 Docs Site Rebuild

## Required

| Decision        | Applicability                                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DR-0001         | Documentation must present Emblor as a headless tag-input primitive and keep optional integrations outside core.                                           |
| DR-0002         | All package examples install one `emblor` package and avoid removed feature packages/subpaths.                                                             |
| DR-0004         | Documentation and examples must reflect React 18 and React 19 support; compatibility evidence remains required.                                            |
| DR-0005         | Phase 6 owns the deferred website rebuild and polished integration examples after the package becomes suitable to consume.                                 |
| DR-0007         | Examples import supported components and types only from package root; only `emblor/package.json` remains an extra metadata export.                        |
| DR-0009         | Validation documentation must distinguish `transform` from `validate` and preserve evaluation order.                                                       |
| DR-0012         | Website consumes a published prerelease; v1 remains npm `latest` until stable gates pass.                                                                  |
| DR-0013         | CI is the authoritative website quality gate; local checks remain available.                                                                               |
| DR-0014         | Website tooling and CI must work under the repository Node 22/24 policy, with Node 24 primary.                                                             |
| DR-0015         | State guides put both committed and draft control on Root.                                                                                                 |
| DR-0016         | Styling/composition guides demonstrate DOM prop forwarding, consumer-owned CSS, polymorphism, and refs without a styling runtime.                          |
| DR-0017         | Anatomy/reference pages document TagList render functions and `EmblorTagText`.                                                                             |
| DR-0018         | Forms documentation demonstrates repeated native values, required semantics, reset, disabled, and read-only behavior.                                      |
| DR-0019         | Validation guides distinguish controlled persistent invalid state from transient rejection state and document structured `onReject`.                       |
| DR-0020         | Duplicate examples explain consumer-owned occurrence identity and stable React keys.                                                                       |
| DR-0022         | Mutation examples use the single metadata-rich `onValueChange` callback.                                                                                   |
| DR-0023         | Reference pages use native prop names and Emblor-specific Root props only.                                                                                 |
| DR-0024–DR-0026 | Constraint and paste guides preserve rejection, clear/minTags, and partial-paste semantics.                                                                |
| DR-0027         | Accessibility docs cover default/localized/suppressed live announcements.                                                                                  |
| DR-0028–DR-0030 | Keyboard docs cover IME, direction-aware arrows, Tab policy, and editable input at maxTags.                                                                |
| DR-0031–DR-0040 | Advanced behavior/reference material must preserve constraint, delimiter, structure, length, paste, blur, external-value, and focus-restoration contracts. |
| DR-0041         | Site work cannot redesign the frozen public contract; discovered package problems follow the decision/fix boundary.                                        |
| DR-0042         | Docs work uses a short-lived branch targeting v2 `main`; v1 remains preserved on `1.x` and npm `latest`.                                                   |
| DR-0043         | Website uses the latest compatible Next/React/TypeScript/Tailwind/Nextra/shadcn stack, required route hierarchy, hosted registry, and playground contract. |

## Related

- DR-0003: public values are `string[]`; covered through state, forms, and migration examples.
- DR-0008: `EmblorClear` naming is reflected in anatomy and API reference.
- DR-0010: delimiter text and keyboard commit controls are documented separately.
- DR-0011: focus documentation describes actual DOM focus rather than exposing internal index state.
- DR-0021: nested Tag parts inherit private context; surfaced only as public composition behavior.

## Not Applicable

- DR-0006 and DR-0033 are superseded and impose no requirements.
- Private implementation-file organization is outside website scope except where package-source imports must be rejected.

## Deferred

- `2.0.0-beta.0` publication and effective public API freeze: Phase 7.
- Production docs cutover, npm `latest` promotion, and v1 archive/maintenance messaging: Phase 9.
- New package capabilities requested only to simplify examples: prohibited unless separately decided.

## Conflicts or Uncertainty

None. DR-0043 supersedes the provisional plan choice to retain the old website stack and use plain `@next/mdx`; it does not supersede any frozen package decision. Exact current stable dependency versions are selected and recorded at implementation start.
