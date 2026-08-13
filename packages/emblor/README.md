# Emblor

Emblor is a headless tag-input primitive. It owns tag and draft state, keyboard behavior, validation, focus coordination, native forms, and accessible announcements. Consumers own the rendered markup and styling.

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
<EmblorRoot
  value={tags}
  onValueChange={(next, details) => setTags(next)}
  inputValue={draft}
  onInputValueChange={setDraft}
/>
```

Draft state is Root-owned. `EmblorInput` does not accept its own `value` or `onValueChange` API. Enter always attempts a commit; literal `delimiters` default to `[',']`; `addOnTab` opts into Tab commits; `addOnPaste` defaults to `true`; and `blurBehavior` defaults to `'noop'`.

`transform` runs after trimming and before length, duplicate, capacity, and `validate` checks. Rejected candidates remain in the draft and are reported through `onReject` with their raw value, canonical value, reason, and source. Paste evaluates candidates left to right, keeps valid candidates, and emits one `add-many` transition.

## Forms and accessibility

When `name` is present, committed tags become ordered repeated native form values. `required` means at least one committed tag; draft text does not satisfy it. Disabled values are omitted, read-only values remain successful form values, and uncontrolled tags/drafts return to their defaults on native form reset.

`EmblorLabel` associates automatically with the one input. Every part forwards applicable DOM, ARIA, `data-*`, style, class, and event props. `as` is polymorphic and keeps the required roles and behavior. Use `getAnnouncement` to localize or suppress private polite live-region messages by returning an empty string.

Consumers own React keys and optional tag DOM IDs. The example uses `tag` because duplicates are disabled. Consumers enabling duplicates should maintain stable occurrence IDs alongside their `string[]`; Emblor does not generate occurrence identity or tag IDs.

## Scope

The package is intentionally headless. It does not ship autocomplete, cmdk, popovers, sorting, drag-and-drop, Tailwind, CVA, or a styling runtime. The package playground is a temporary acceptance lab; its CSS is not part of the library contract. The existing website remains on the v1 documentation until a later v2 documentation plan.
