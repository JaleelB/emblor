# Emblor

Emblor v2 is a headless tag-input primitive. It owns tag and draft state, keyboard behavior, validation, focus coordination, native forms, and accessible announcements. Consumers own markup and styling.

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
</EmblorRoot>;
```

Import all supported parts from the package root. The compound API requires exactly one `EmblorInput`; `EmblorTagList` is optional. Use `value`/`onValueChange` or `defaultValue` for `string[]` tags. Draft control, when needed, lives on Root through `inputValue`, `defaultInputValue`, and `onInputValueChange`.

Enter commits, literal `delimiters` default to `[',']`, `addOnTab` opts into Tab commits, `addOnPaste` defaults to `true`, and `blurBehavior` defaults to `'noop'`. `transform` runs before length, duplicate, capacity, and boolean `validate` checks. `onReject` receives structured rejection details; pasted values are evaluated left-to-right and accepted in one batch transition.

With `name`, committed tags submit as ordered repeated native form values. `required` means at least one committed tag. Labels associate automatically, actions remain accessible under `as` polymorphism, and every part forwards applicable DOM/ARIA/data/style/event props. Consumers own React keys and optional tag IDs. The example uses the value as its key because duplicates are disabled; consumers enabling duplicates should maintain stable occurrence IDs alongside their `string[]`.

The package intentionally excludes autocomplete, cmdk, popovers, sorting, drag-and-drop, Tailwind, CVA, and styling runtimes. See [packages/emblor/README.md](packages/emblor/README.md) for the full contract and [packages/emblor/MIGRATION.md](packages/emblor/MIGRATION.md) for v1 migration.
