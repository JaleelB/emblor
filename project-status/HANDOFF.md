# Emblor v2 — Handoff

**Last updated:** 2026-08-11
**Branch:** `feat/emblor-v2-refactor`
**WIP snapshot commit:** `4a338d2 wip: preserve emblor v2 headless refactor` (local only, not pushed)

---

## 1. The vision

Emblor v2 is a **headless tag input**. Nothing more.

Add tags, remove tags, keyboard navigation, validation, and full control over the DOM you render. It is a primitive, not a product suite.

Reference point for quality and scope: [`@diceui/tags-input`](https://diceui.com/docs/components/radix/tags-input) and the compound-component style of `cmdk`.

### What changed philosophically

v1 was a Shadcn-branded mega component. `TagInput` was one file with ~773 lines and ~40 props, vendored copies of Shadcn `button`/`input`/`command`/`dialog`/`popover`, and hard dependencies on Radix, cmdk, `react-easy-sort`, CVA, clsx, and tailwind-merge. It claimed to be "unstyled" in `package.json` while shipping Tailwind classes and CVA variants. Users effectively needed a Shadcn + Tailwind app.

v2 inverts that. The library owns **tag state and behavior**. The consumer owns **markup, styling, and integrations**.

### Non-goals (do not reopen without an explicit decision from Jaleel)

- No built-in autocomplete, no cmdk dependency
- No drag and drop, no sortable export
- No `emblor/addons` public subpath
- No compat `<TagInput />` shim — v2 is a hard break with a migration guide
- No CVA / Tailwind / Shadcn styling layer inside the package
- No docs-site work until the package itself is solid

Integrations (cmdk, Radix Popover, dnd libraries) are shown as **demos on the future docs site**, not as package exports.

---

## 2. Decisions locked

| Topic | Decision |
|---|---|
| Release | Emblor **v2**, hard break from v1.4.7 |
| Package | One npm name `emblor`, everything under `packages/emblor`, subpath exports |
| Naming | `Emblor*` flat namespace — `EmblorRoot`, `EmblorInput`, `EmblorTagList`, `EmblorTag`, `EmblorTagRemove`, `EmblorClear` (not `TagsInput.*`) |
| Clear | Lives in **core**, not addons |
| Tag count | Skip, or a trivial core part — do not build an addons package for it |
| Sortable | Cut from v2 entirely (consumer reorders the `string[]` and calls `onValueChange`) |
| React | Support 18 **and** 19 via peer range bump on this branch |
| Rebase onto `main` | Not required — bump peers locally instead. Cherry-pick from `main` only if something specific is needed |
| Docs site | Rebuilt later, after the package works. It becomes the playground |
| In-repo playground | Temporary smoke harness only, not a long-term deliverable |

### Data model break

v1: `Tag { id: string; text: string }[]` plus caller-managed `activeTagIndex` / `setActiveTagIndex`.
v2: plain `string[]` via `value` / `defaultValue` / `onValueChange`. Ids are generated internally for DOM purposes (`generateTagId`).

---

## 3. Where we are right now

### Git state

- All previously uncommitted v2 work is now committed as `4a338d2` on `feat/emblor-v2-refactor`.
- The branch is **1 commit ahead** of `origin/feat/emblor-v2-refactor`. Nothing has been pushed.
- `origin/main` is 4 commits ahead of the branch point (React 19 peer support, version bumps). We are deliberately **not** rebasing.
- `.husky/pre-commit` was deleted in the WIP; `.husky/pre-commit.bak` is left untracked on disk. Husky needs to be restored or removed intentionally.

### What exists and works

`packages/emblor/src/core/` — the good part of this rewrite:

- `EmblorRoot`, `EmblorInput`, `EmblorTagList`, `EmblorTag`, `EmblorTagRemove`, `EmblorClearTrigger`, `useEmblorContext`
- Store-backed context in `tags-input-context.tsx` (`createStore` + `useStoreSelector`)
- Controlled/uncontrolled `string[]` state, delimiters (default `[',', 'Enter']`), `addOnPaste` (default `true`), `inputBlurBehavior: 'commit' | 'discard' | 'noop'`, `validateTag` returning `boolean | string`, min/max length, `maxTags` / `minTags`, `allowDuplicates`, `readOnly` / `disabled`
- `as` polymorphism on every part
- Roving tabindex across tags, arrow/Home/End navigation, backspace-into-list

Supporting code:

- `src/utils/` — `createStore`, `useStoreSelector`, `useControllableState`, `mergeRefs`, `composeEventHandlers`, `useStableCallback`
- `src/types/` — full public prop types
- `packages/emblor/tests/core/` — 5 vitest files covering render, delimiter commit, remove, backspace focus, clear, `minTags` guard, `readOnly` guard
- `packages/emblor/playground/` — Vite app with core, addons, cmdk, and Radix popover examples

### What is in the tree but should not survive

- `packages/core`, `packages/addons`, `packages/sortable`, `packages/types`, `packages/utils`, `packages/playground` — the abandoned `@emblor/*` multi-package layout. Not in `pnpm-workspace.yaml`, drifted from `packages/emblor`, pure confusion.
- `packages/emblor/src/addons/` (`TagCount`, `ClearButton`) — fold `ClearButton` into core, drop the subpath.
- `packages/emblor/src/sortable/` (`reorderArray`, `useKeyboardSortable`) — cut.
- `packages/emblor/src/testing/` — an empty `export {}` stub behind a public subpath.
- Build artifacts committed alongside source in `packages/emblor/playground/src/` (`.js`, `.d.ts`, `.map`).
- `@radix-ui/react-context` is a declared dependency but unused in source.

### Known gaps in core

- The store writes `lastAction` but nothing renders a screen-reader live region.
- `EmblorInput` sets `aria-autocomplete="list"` and `aria-expanded={false}` without a real listbox — misleading ARIA that should be removed given autocomplete is out of scope.
- Root `src/index.ts` does not re-export types.
- No `EmblorLabel`. Dice has `TagsInputLabel`; we currently rely on a `labelId` prop. Decide whether to add the part.
- Dual `focusedIndex` / `activeIndex` concepts — worth simplifying to one if the second is not earning its place.

### Website

`website/` is entirely on the v1 API (`TagInput`, `Tag`) and depends on `"emblor": "latest"` from npm. It even keeps its own copy at `website/components/tag/tag-input.tsx`. **Leave it alone for now.** It stays pointed at published v1 until v2 is real.

---

## 4. Remaining steps

Step 1 (protect the WIP) is **done**. Everything below is open.

### Step 2 — Packaging cleanup

Goal: exactly one answer to "how do I install this."

- Delete `packages/{core,addons,sortable,types,utils,playground}`
- Confirm `pnpm-workspace.yaml` covers `packages/emblor`, `packages/emblor/playground`, and `website`
- Remove committed build artifacts from `packages/emblor/playground/src/`; make sure they are gitignored
- Restore `packages/emblor/.gitignore` (it was deleted in the WIP) or fold its rules into the root ignore
- Drop `@radix-ui/react-context` if it stays unused
- Decide on husky: restore `.husky/pre-commit` from the `.bak`, or delete both and drop the hook

### Step 3 — API reshape

- Remove `addons`, `sortable`, and `testing` from `package.json` exports and `tsup.config.ts` entries; delete their `src/` folders
- Move clear into core as `EmblorClear` (rename from `EmblorClearTrigger`, or keep the old name as a deprecated alias for one release — pick one and be consistent)
- Re-export public types from `src/index.ts`
- Delete the misleading autocomplete ARIA attributes on `EmblorInput`
- Decide on `EmblorLabel` and on `EmblorTagText` (Dice's `TagsInputItemText`); add them if they make composition cleaner
- Final pass on prop names before anything is published — `validateTag` vs `validate`, `delimiter` as array vs string. This is the last cheap moment to change them

### Step 4 — React 18 + 19 peers

- Widen `peerDependencies` to `^18 || ^19` (Dice uses a broad range including 16/17; match or narrow deliberately)
- Update dev `@types/react` / `@types/react-dom` and verify the build and tests under both major versions
- No rebase onto `main`

### Step 5 — Harden

- Add the live region component that consumes `lastAction`, and render it from `EmblorRoot`
- Fill test gaps: paste splitting, all three blur behaviors, validation failure and rewrite, duplicate rejection, `maxTags` boundary, keyboard navigation, a11y attributes
- Slim the playground to core smoke coverage; delete the addons and sortable examples along with those modules
- Run typecheck, lint, build, and tests green

### Step 6 — Migration guide

A markdown file in the repo, not a website page yet. It should cover:

- `TagInput` single component to `Emblor*` compounds, with a before/after snippet
- `Tag[]` (`{ id, text }`) to `string[]`
- `tags` / `setTags` to `value` / `onValueChange`
- Removal of `activeTagIndex` / `setActiveTagIndex` as required props
- Features that no longer ship: autocomplete, drag and drop, popover-for-tags, truncate, sort, `styleClasses`, CVA variants, `inlineTags` / `inputFieldPosition` / `direction`
- Where those now live: your own markup, or a third-party library

### Step 7 — Release

- Changeset for a major bump to `2.0.0`
- Consider `2.0.0-alpha` first to shake out the API in public
- Update `packages/emblor/README.md` to the real v2 API (it currently documents a half-imagined version)
- Push the branch and open the PR

### Step 8 — Docs site (later)

Rebuild `website/` against v2. This is where the interactive playground lives, along with demos for wiring Emblor into cmdk, Radix Popover, and a drag-and-drop library. Possibly a Shadcn registry entry for a styled preset. **Do not start this until the package is stable.**

---

## 5. Notes for whoever picks this up

- The core is genuinely good. Do not rewrite it. The work here is subtraction, renaming, and finishing — not redesign.
- The biggest risk is scope creep back toward v1's feature list. Every time a feature feels missing, the answer is almost always "the consumer composes it" or "the docs site demonstrates it."
- The second biggest risk is leaving two package layouts on disk. Kill the orphans early in step 2 so nobody reads the wrong file.
- v1 source is still recoverable for reference: `git show 4bca063:packages/emblor/src/tag/tag-input.tsx` and siblings under `src/tag/` and `src/ui/`.
