# Emblor

Emblor is a headless tag-input primitive. It owns tag and draft state, keyboard behavior, validation, focus coordination, native forms, and accessible announcements. Consumers own the rendered markup and styling.

> [!WARNING]
>
> `2.0.0-alpha.0` is an early v2 prerelease. It is installable for evaluation, but it is not semver-stable. The v2 architecture is frozen for this alpha; contract-restoring fixes and explicitly approved contract changes may still land before stable v2. npm `latest` remains the v1 line (`1.4.8`).

## Install the alpha

Install the public prerelease channel explicitly:

```bash
npm install emblor@next
```

```bash
pnpm add emblor@next
```

The package supports React 18 and React 19. The package does not impose a Node engine; repository and release verification use Node 24 with Node 22 compatibility coverage. For v1 consumers, start with the [v1-to-v2 migration guide](./MIGRATION.md). Release context and known limitations are in the [alpha release notes](https://github.com/JaleelB/emblor/releases/tag/emblor%402.0.0-alpha.0). Please report findings through the [alpha issue forms](https://github.com/JaleelB/emblor/issues/new/choose), including the exact package version and a minimal reproduction when applicable.

## Quick start

```tsx
import {
  EmblorClear,
  EmblorInput,
  EmblorLabel,
  EmblorRoot,
  EmblorTag,
  EmblorTagList,
  EmblorTagRemove,
  EmblorTagText,
} from 'emblor';

export function TagsField() {
  return (
    <EmblorRoot defaultValue={['react']} name="skills">
      <EmblorLabel>Skills</EmblorLabel>
      <EmblorTagList>
        {(tag, index) => (
          <EmblorTag key={tag} index={index}>
            <EmblorTagText />
            <EmblorTagRemove />
          </EmblorTag>
        )}
      </EmblorTagList>
      <EmblorInput placeholder="Add a skill" />
      <EmblorClear>Clear</EmblorClear>
    </EmblorRoot>
  );
}
```

`EmblorRoot` requires exactly one `EmblorInput`. `EmblorTagList` is optional and may be rendered with a static child tree or an item-render function. The function receives the current Root-owned string and positional index in both controlled and uncontrolled mode.

## State and mutations

Use `value` and `onValueChange` for controlled tags, or `defaultValue` for uncontrolled tags. The callback receives the requested next `string[]` and one discriminated details object for each accepted transition:

```tsx
import * as React from 'react';
import { EmblorInput, EmblorRoot } from 'emblor';

export function ControlledTagsField() {
  const [tags, setTags] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState('');
  return (
    <EmblorRoot value={tags} onValueChange={(next) => setTags(next)} inputValue={draft} onInputValueChange={setDraft}>
      <EmblorInput />
    </EmblorRoot>
  );
}
```

Draft state is Root-owned. `EmblorInput` does not accept its own `value` or `onValueChange` API. Enter always attempts a commit; literal `delimiters` default to `[',']`; `addOnTab` opts into Tab commits; `addOnPaste` defaults to `true`; and `blurBehavior` defaults to `'noop'`.

`transform` runs after trimming and before length, duplicate, capacity, and `validate` checks. Rejected candidates remain in the draft and are reported through `onReject` with their raw value, canonical value, reason, and source. Paste evaluates candidates left to right, keeps valid candidates, and emits one `add-many` transition.

## Behavioral contract

### Candidate validation and invalid state

For a non-empty keyboard, blur, or paste candidate, Emblor applies this order:

`trim → transform → empty → minLength/maxLength → duplicate → maxTags → validate`

The transform receives the trimmed value and must return a string. A whitespace-only raw candidate can therefore become valid when the transform supplies a value. A genuinely empty Enter or blur draft is a silent no-op. In a paste batch, truly empty delimiter segments are ignored; non-empty whitespace segments use the normal pipeline.

Length limits count Unicode code points in the canonical value, not UTF-16 units or grapheme clusters. Combining sequences, flags, emoji modifiers, and ZWJ sequences may count as multiple code points. `minLength={0}` is valid, while an empty canonical value is still rejected; `maxLength={0}` rejects every non-empty candidate. Emblor never truncates implicitly.

`invalid` is a persistent consumer-controlled signal. A rejection is transient and is exposed through `data-invalid`, `aria-invalid`, and `onReject` as structured metadata. Transient invalid state clears when the draft changes or a tag is successfully added. Removing a tag, synchronizing an external value, or changing a valid constraint does not clear an unrelated rejection. Consumers provide error text and associate it with the visible input using ordinary `aria-describedby`.

### Paste, delimiters, and selection

When `addOnPaste` is enabled, the consumer’s `onPaste` handler runs first. `preventDefault()` leaves the event entirely to the consumer. Otherwise Emblor parses the prospective draft made by inserting clipboard text at the current selection. It splits with literal, single-code-point `delimiters`; regex metacharacters are not special. With `delimiters={[]}`, the complete prospective draft is one candidate.

Candidates are evaluated left to right against the accumulating batch. Valid candidates are retained, rejected candidates each produce one `onReject`, and one `add-many` callback contains all accepted canonical values. Any accepted candidate clears the draft. If every non-empty candidate rejects, the original draft and selection are preserved. Selection restoration is cancelled by later caret or range changes, pointer or keyboard intent, edits, focus changes, another paste, input replacement, or unmount.

### Keyboard, blur, and focus

Enter commits a non-empty draft. Literal delimiter keys commit while typing. Tab remains native unless `addOnTab` is true. All Emblor command keys are ignored while an IME composition is active, and the first ordinary command after composition behaves normally.

Arrow navigation follows physical direction: in LTR, Left enters from the start and Right from the end; in RTL those physical directions reverse. Home and End use first/last value order regardless of direction. Navigation skips omitted Tag indexes and uses actual DOM focus, with one private focused-index state and roving `tabIndex`; a committed tag does not become virtually focused while Input remains active.

`blurBehavior` defaults to `'noop'`. Opt-in commit or discard runs only after focus leaves the entire Root, including registered portal parts. Consumer cancellation, disabled/read-only state, guarded actions, unmount, and focus returning inside the Root are silent. After an accepted individual removal, focus moves to the mounted Tag at the resulting position, then the nearest lower mounted Tag, then Input. Clear restores Input under the same controlled-acknowledgement and consumer-focus safeguards.

### Forms, structure, and external values

`name` creates one ordered hidden native control per committed tag, so `FormData` receives repeated values. Names such as `skills[]` are preserved exactly. `required` means at least one committed tag; draft text does not satisfy it, and native invalid focus is routed to the visible Input. Disabled fields are omitted, read-only fields remain successful, and native reset restores only uncontrolled `value` and draft state.

`minTags` guards individual removal and disables Clear whenever it is greater than zero. `required` is independent, so a required field may be cleared and then become natively invalid. Externally controlled strings are authoritative: Emblor does not trim, transform, validate, deduplicate, or callback for them. Omitted Tag renderings still count toward constraints and forms. Rendered Tag indexes must be valid, unique, and currently mounted; TagText displays the exact current string.

Every Root requires exactly one Input and permits at most one TagList. Labels and action parts may be repeated, rendered through portals, and used under Strict Mode. Automatically associated labels name Root, Input, and TagList in connected DOM order. Explicit `htmlFor`, `aria-label`, and `aria-labelledby` overrides are not added to that automatic list.

### Polymorphism and event precedence

All parts forward applicable native, ARIA, `data-*`, style, class, ref, and event props. `as` changes the element while preserving required behavior. Emblor-owned roles, IDs, form state, safety props, and handlers take precedence over conflicting consumer values. Consumer handlers run first.

| Part            | Consumer cancellation                                                                              | Protected behavior                                                                   |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Input           | `onPaste` cancellation skips built-in paste parsing; keydown cancellation skips the Emblor command | Root-owned draft, input-like validation, role, ID, required/disabled/read-only state |
| Label           | `preventDefault()` skips custom click-to-focus                                                     | automatic naming and association                                                     |
| Tag             | `preventDefault()` skips click focus                                                               | listitem role, roving focus, keyboard navigation                                     |
| TagRemove/Clear | `preventDefault()` skips the action; disabled guards always block mutation                         | button semantics, `type="button"`, `aria-disabled`, exactly-once activation          |

Non-button TagRemove and Clear parts supply button role, keyboard focusability, Enter/Space activation, and Space-scroll prevention. Native buttons retain their native activation path.

## Forms and accessibility

When `name` is present, committed tags become ordered repeated native form values. `required` means at least one committed tag; draft text does not satisfy it. Disabled values are omitted, read-only values remain successful form values, and uncontrolled tags/drafts return to their defaults on native form reset.

`EmblorLabel` associates automatically with the one input. Every part forwards applicable DOM, ARIA, `data-*`, style, class, and event props. `as` is polymorphic and keeps the required roles and behavior. Use `getAnnouncement` to localize or suppress private polite live-region messages by returning an empty string.

Consumers own React keys and optional tag DOM IDs. The example uses `tag` because duplicates are disabled. Consumers enabling duplicates should maintain stable occurrence IDs alongside their `string[]`; Emblor does not generate occurrence identity or tag IDs.

## Scope

The package is intentionally headless. It does not ship autocomplete, cmdk, popovers, sorting, drag-and-drop, Tailwind, CVA, or a styling runtime. The package playground is a temporary acceptance lab; its CSS is not part of the library contract. The existing website remains on the v1 documentation until a later v2 documentation plan.

The public package is intentionally limited to the root import and `emblor/package.json` metadata. There are no supported `emblor/core`, `emblor/addons`, `emblor/sortable`, `emblor/utils`, `emblor/types`, or `emblor/testing` code subpaths. See [`CHANGELOG.md`](./CHANGELOG.md) for generated release history and [`MIGRATION.md`](./MIGRATION.md) for conversion details.

## Local quality gate

Run the complete local distribution gate from the repository root:

```text
pnpm distribution
```

It uses the committed frozen workspace lockfile, builds the package, runs formatting, lint, types, unit tests, and verifies one packed artifact through the React 18/19 consumer and package-sanity checks. Each isolated consumer resolves a temporary lockfile, installs from that frozen lockfile, and must match its reviewed dependency-graph fingerprint. CI runs the same named checks after its frozen install with `pnpm run distribution -- --skip-install`.

The package’s non-browser gate is:

```text
pnpm prettier-check
pnpm run build --filter "./packages/*"
pnpm -C packages/emblor lint
pnpm -C packages/emblor typecheck
pnpm -C packages/emblor test
pnpm -C packages/emblor test:compat
```

The repeatable Chromium gate is `pnpm test:browser`. Install its browser once with `pnpm -C packages/emblor exec playwright install chromium`; CI installs Chromium with system dependencies in the Node 24 lane. Browser traces and screenshots are retained only when a test fails.
