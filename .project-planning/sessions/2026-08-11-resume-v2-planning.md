# Planning Session — Resume Emblor v2

## Date

2026-08-11

## Intake

Resume the Emblor v2 refactor from `project-status/HANDOFF.md`. Preserve the existing headless core, remove abandoned package and feature experiments, settle the remaining public API, harden behavior and accessibility, document migration, and prepare a deliberate v2 release. This is guided planning; implementation should not begin until the remaining API decisions and a traceable plan are accepted.

## Desired Outcome

A small, dependency-light, headless tag-input package with a stable compound-component API, verified React 18 and 19 support, strong behavior and accessibility tests, and a clear v1-to-v2 migration path.

## Affected Users

- Existing Emblor v1 consumers migrating to v2.
- New consumers who want an unstyled React tag-input primitive.
- Maintainers working in this repository.

## Verified Repository Facts

- Current branch: `feat/emblor-v2-refactor`.
- `HEAD` and `origin/feat/emblor-v2-refactor` both point to `b3fc18d`; the branch is not currently ahead of its remote.
- The historical WIP commit `4a338d2` is still present, but its work is represented at `HEAD` by focused commits.
- The working tree was clean before creating these planning artifacts.
- No prior `.project-planning`, `.decisions`, `.plans`, or ADR corpus existed.
- `pnpm-workspace.yaml` already includes only `packages/emblor`, its playground, and `website`.
- Orphan `packages/{core,addons,sortable,types,utils,playground}` directories still exist outside the workspace.
- Generated `.js`, `.d.ts`, and `.map` files under the Emblor playground source are no longer tracked or present.
- `.husky` is absent, while root `package.json` still declares a `prepare: husky` script and Husky dependency.
- `packages/emblor` still exposes and builds `addons`, `sortable`, and `testing` subpaths.
- `@radix-ui/react-context` remains declared and no source import was found.
- The package version is already `2.0.0`; release prerelease strategy remains unsettled.
- The local dependency install is absent. Typecheck, tests, and build could not start because `tsc`, `vitest`, and `tsup` were unavailable.
- The current runtime is Node 22, while the root package declares `>=18 <20`; dependency installation and validation need an intentional Node-version choice.
- A frozen dependency install subsequently completed under Node 22.23.2 without tracked-file changes.
- Baseline tests pass: 5 files and 10 tests.
- Baseline production build succeeds, but produces every provisional subpath and 53 packed files.
- Baseline typecheck fails because two test files use Vitest globals without imports or configured global types.
- Baseline lint cannot start because ESLint 9 has no flat configuration in the repository.
- `npm pack --dry-run` confirms that addons, sortable, testing, types, and utils artifacts would currently ship.

## Confirmed Decisions

- DR-0001: v2 is a headless tag input and a hard break.
- DR-0002: publish one `emblor` package and remove feature subpackages/subpaths.
- DR-0003: use `string[]` as the public value model.
- DR-0004: support React 18 and 19 without rebasing the branch.
- DR-0005: defer the website until the package API is stable.
- DR-0006: superseded by DR-0017; it originally added `EmblorLabel` but omitted `EmblorTagText`.
- DR-0007: expose supported code only from the `emblor` root and keep implementation hooks/utilities internal.
- DR-0008: name the clear-all primitive `EmblorClear` and provide no `EmblorClearTrigger` alias.
- DR-0009: replace overloaded `validateTag` with separate `transform` and boolean `validate` props.
- DR-0010: use literal `delimiters[]`, make Enter intrinsic, and make Tab commit explicit through `addOnTab`.
- DR-0011: use one internal focus index tied only to actual DOM focus and expose no index-control props.
- DR-0012: restore the published `1.4.8` baseline and release v2 through an alpha channel before stable promotion.
- DR-0013: remove the dead Husky/lint-staged toolchain and enforce package quality in CI.
- DR-0014: use Node 24 as primary and verify compatibility on Node 22.
- DR-0015: make Root the sole owner of controlled/uncontrolled draft input state.
- DR-0016: guarantee applicable DOM-prop forwarding and type-safe `as` polymorphism on every public part.
- DR-0017: render Root-owned values through the `EmblorTagList` item function and add `EmblorTagText`.

## Important Findings for the Plan

- Paste commits currently call `commitTag` repeatedly against the same rendered `tagValues` closure, so multi-segment paste behavior needs explicit verification and likely state-update hardening.
- `clearTags` can clear below `minTags`; the clear trigger's disabled condition alone does not enforce the invariant for every caller.
- `focusedIndex` and `activeIndex` are written together throughout the current core and appear behaviorally redundant.
- `EmblorInput` emits combobox-style ARIA despite there being no autocomplete/listbox.
- `lastAction` is stored but no live region consumes it.
- `validationError` is only the literal string `invalid`, even though validation may reject for several reasons and `validateTag` may rewrite a value.
- Public utilities and internal store shapes are currently exportable and require an intentional surface review.
- Controlled draft text is owned by `EmblorInput`, while commit and clear behavior is owned by `EmblorRoot`. Root can clear its store but cannot update an input controlled through the child component's `value`, creating split state ownership and stale visible text after commits.

## Open Decisions

The post-plan API audit reopened planning. Unresolved areas are tracked in `.project-planning/plans/emblor-v2-package.md` under Open Questions. The uncontrolled rendering contract is now resolved by DR-0017; form participation is the next decision.

## Next Step

Resolve the reopened API questions one at a time, resync decision coverage, and only then return the implementation plan to Ready.
