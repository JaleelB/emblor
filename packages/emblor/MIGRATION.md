# Migrating from Emblor v1

Emblor v2 is a hard break. Import the compound primitives from the package root:

```tsx
import { EmblorRoot, EmblorInput, EmblorTagList, EmblorTag, EmblorTagText, EmblorTagRemove } from 'emblor';
```

The old `TagInput` component and object values (`{ id, text }`) are replaced by `string[]` values. `tags`/`setTags` become `value`/`onValueChange`, and `activeTagIndex` state is removed. Render tags through `EmblorTagList`'s item function and give each occurrence a consumer-owned React key.

The v2 package has no `emblor/core`, `emblor/addons`, `emblor/sortable`, `emblor/utils`, `emblor/types`, or `emblor/testing` subpaths. `EmblorClear` replaces the provisional clear names. `EmblorTagRemove` inherits its index from the containing `EmblorTag`; `EmblorTagText` reads that tag's exact string.

Behavioral names are also final: `transform` and boolean `validate` replace `validateTag`; `delimiters` contains literal single-code-point separators; `addOnTab` controls Tab commits; `blurBehavior` replaces `inputBlurBehavior`; and draft control moves to Root via `inputValue`, `defaultInputValue`, and `onInputValueChange`.

Autocomplete, drag-and-drop, sorting, popovers, truncation, `styleClasses`, CVA variants, `inlineTags`, `inputFieldPosition`, and v1 direction/style APIs are not package features. Compose those behaviors with your own markup and third-party libraries around the headless primitives.
