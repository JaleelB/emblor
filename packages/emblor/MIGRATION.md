# Migrating from Emblor v1 to v2

Emblor v2 is a deliberate hard break. It is a headless compound primitive, not a compatibility layer for the v1 `TagInput` component. The v2 alpha is architecture-frozen but not semver-stable, so keep your v1 implementation available while you evaluate the new package.

## Install and import

Install the prerelease channel explicitly:

```bash
npm install emblor@next
# or
pnpm add emblor@next
```

All supported code comes from the package root:

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
```

The only supported metadata subpath is `emblor/package.json`. The following v1/provisional subpaths are not part of v2: `emblor/core`, `emblor/addons`, `emblor/sortable`, `emblor/utils`, `emblor/types`, and `emblor/testing`.

## Data model and state ownership

V1 values were objects and usually required caller-managed active-tag state:

```tsx
const [tags, setTags] = useState([{ id: 'react', text: 'react' }]);
const [activeTagIndex, setActiveTagIndex] = useState(-1);

<TagInput tags={tags} setTags={setTags} activeTagIndex={activeTagIndex} />;
```

V2 values are `string[]`. Root owns committed tags, the draft, mutation coordination, and private focus state:

```tsx
const [tags, setTags] = useState<string[]>(['react']);
const [draft, setDraft] = useState('');

<EmblorRoot value={tags} onValueChange={(next) => setTags(next)} inputValue={draft} onInputValueChange={setDraft}>
  <EmblorInput />
</EmblorRoot>;
```

For uncontrolled state, use `defaultValue` and, when needed, `defaultInputValue`:

```tsx
<EmblorRoot defaultValue={['react']} defaultInputValue="ty">
  <EmblorInput />
</EmblorRoot>
```

`EmblorInput` deliberately does not expose its own `value`, `defaultValue`, or `onValueChange` state API. Its normal DOM `onChange` and other native handlers remain available. Do not switch a Root between controlled and uncontrolled tag or draft state after mount. External `value` and `defaultValue` strings are authoritative: Emblor does not trim, transform, validate, deduplicate, truncate, or reject them when they enter from the owner.

## Compound markup

Replace the v1 all-in-one component with the parts that your markup needs. `EmblorRoot` requires exactly one `EmblorInput`; `EmblorTagList` is optional and may be static or use an item-render function:

```tsx
<EmblorRoot defaultValue={['react', 'typescript']} name="skills">
  <EmblorLabel>Skills</EmblorLabel>
  <EmblorTagList>
    {(tag, index) => (
      <EmblorTag key={`${tag}-${index}`} index={index}>
        <EmblorTagText />
        <EmblorTagRemove aria-label={`Remove ${tag}`} />
      </EmblorTag>
    )}
  </EmblorTagList>
  <EmblorInput placeholder="Add a skill" />
  <EmblorClear>Clear</EmblorClear>
</EmblorRoot>
```

`EmblorTag` receives a positional `index` into the current Root value. A Tag may be omitted for virtualization or a custom presentation; omitted values remain committed, count toward constraints, and are included in forms. Indexes must be finite, non-negative, in range, unique among mounted Tags, and current for the Root value.

## Identity and React keys

Emblor values are strings, and Emblor does not invent occurrence identity or React keys. Consumers own keys and any DOM IDs. If duplicates are enabled, maintain stable occurrence IDs alongside the `string[]` values:

```tsx
type TagEntry = { id: string; value: string };
const entries: TagEntry[] = [
  { id: 'first-react', value: 'react' },
  { id: 'second-react', value: 'react' },
];
const values = entries.map((entry) => entry.value);
```

Use the positional index only for the `EmblorTag index` contract; use your own occurrence ID for React keys and consumer-owned element IDs.

## Styling, DOM ownership, and polymorphism

V1 visual props and built-in styling are removed. Every v2 part forwards applicable native, ARIA, `data-*`, `className`, `style`, event, and ref props. Use `as` to select the rendered element or a compatible React component:

```tsx
<EmblorRoot as="section" className="field" data-kind="skills">
  <EmblorTagList as="ul">
    {(tag, index) => (
      <EmblorTag as="li" key={`${tag}-${index}`} index={index}>
        <EmblorTagText as="strong" />
        <EmblorTagRemove as="button" aria-label={`Remove ${tag}`} />
      </EmblorTag>
    )}
  </EmblorTagList>
  <EmblorInput />
</EmblorRoot>
```

Emblor-owned roles, IDs, form state, safety props, and handlers take precedence when a consumer prop would break the contract. Consumer handlers run first and can cancel the built-in action where the API documents cancellation. There is no `asChild`, styling runtime, `classNames`, CVA variant, Tailwind, or theme-token API.

## Renamed and removed props

| V1 or provisional API                                                       | V2 migration                                                                                                                             |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| `TagInput`                                                                  | Compose `EmblorRoot`, `EmblorInput`, `EmblorTagList`, `EmblorTag`, `EmblorTagText`, `EmblorTagRemove`, `EmblorLabel`, and `EmblorClear`. |
| `tags` / `setTags`                                                          | `value` / `onValueChange`, or `defaultValue` for uncontrolled tags.                                                                      |
| `{ id, text }[]`                                                            | `string[]`; keep application metadata and occurrence IDs in consumer state.                                                              |
| `activeTagIndex` and setter props                                           | Removed; focus and roving navigation are Root-owned.                                                                                     |
| Input `value` / `onValueChange`                                             | Root `inputValue` / `onInputValueChange`; use `defaultInputValue` for uncontrolled draft state.                                          |
| `validateTag`                                                               | `transform` for canonicalization, plus `validate` for the boolean custom check.                                                          |
| `delimiter` or regex-style splitting                                        | `delimiters`, an array of literal single-code-point separators.                                                                          |
| Tab commit switches with v1 names                                           | `addOnTab`; Enter always attempts a non-empty commit.                                                                                    |
| `inputBlurBehavior`                                                         | `blurBehavior: 'commit'                                                                                                                  | 'discard' | 'noop'`; the default is `'noop'` and it runs only when focus leaves the whole Root. |
| `EmblorClearTrigger` and other provisional clear names                      | `EmblorClear`.                                                                                                                           |
| `styleClasses`, `inlineTags`, `inputFieldPosition`, direction/style helpers | Consumer markup and ordinary DOM/CSS props.                                                                                              |
| Autocomplete, sorting, drag-and-drop, popovers, and addon props             | Consumer composition or a third-party integration outside the package.                                                                   |

There is no v1 compatibility component, alias package, or feature-subpath bridge. Do not add one to make a migration compile; that would change the frozen v2 package boundary.

## Callbacks, validation, and rejection handling

`onValueChange` receives the requested next `string[]` and one discriminated `details` object. The details identify `add`, `add-many`, `remove`, or `clear`, the values/index, and the source. `onReject` receives structured metadata:

```tsx
<EmblorRoot
  transform={(raw) => raw.toLowerCase()}
  validate={(value) => value.startsWith('#')}
  onReject={(rejection) => {
    console.log(rejection.reason, rejection.rawValue, rejection.value, rejection.source);
  }}
>
  <EmblorInput />
</EmblorRoot>
```

For built-in candidates, the order is `trim -> transform -> empty -> minLength/maxLength -> duplicate -> maxTags -> validate`. `transform` must return a string. Emblor rejects overlength tags rather than truncating them, counts length in Unicode code points, and keeps rejected drafts. Pasting evaluates the prospective draft at the current selection left to right, keeps valid candidates in order, reports each rejection, and emits one `add-many` transition for accepted candidates. A consumer `onPaste` can call `preventDefault()` to own parsing completely.

The controlled `invalid` prop is a consumer-owned persistent signal. Rejection metadata is transient and is exposed through `data-invalid`, `aria-invalid`, and `onReject`. Provide visible error text and `aria-describedby` in your markup when your form needs it.

## Forms and accessibility

`name` creates one ordered hidden native control per committed tag, so `FormData` receives repeated values. Names such as `skills[]` are preserved exactly. `required` means at least one committed tag; draft text does not satisfy it. Disabled fields are omitted, read-only values remain successful, and native reset restores uncontrolled tags and draft state.

The label, input, and tag-list parts coordinate automatic naming and association in connected DOM order. Every Root needs exactly one Input and allows at most one TagList. Use normal ARIA and DOM props for descriptions and custom error text. `getAnnouncement` can localize or suppress private polite live-region messages by returning an empty string.

Keyboard command behavior ignores IME composition, uses literal delimiters, and keeps Tab native unless `addOnTab` is enabled. Arrow navigation is direction-aware for physical Left/Right keys; Home and End use value order. After a successful removal, focus moves to the Tag at the resulting position, then the nearest lower mounted Tag, then Input. Clear restores Input after the requested controlled state is reflected.

## Removed integrations and package scope

These features are intentionally outside the v2 package:

- autocomplete, suggestions, cmdk, and popovers;
- sorting, drag-and-drop, and sortable package exports;
- Shadcn components, Tailwind classes, CVA variants, and a styling runtime;
- v1 direction/style helpers and visual layout props;
- `emblor/core`, `emblor/addons`, `emblor/sortable`, `emblor/utils`, `emblor/types`, and `emblor/testing`.

Compose integrations in your application or documentation site using the public root API and the integration's own dependency. Do not expect the v1 website to document v2 yet; it remains on the published v1 line until a later docs plan.

## Migration checklist

1. Install `emblor@next` and import only from `emblor`.
2. Convert object values to `string[]`; retain metadata and occurrence identity in your own state.
3. Replace the v1 component with the compound parts and render each Tag with its current positional `index`.
4. Move draft control to Root with `inputValue`, `defaultInputValue`, and `onInputValueChange`.
5. Move canonicalization to `transform`, custom acceptance to `validate`, and rejection reporting to `onReject`.
6. Replace visual and integration props with consumer-owned DOM/CSS and composition.
7. Verify native form behavior, labels, descriptions, keyboard/focus behavior, and React 18/19 builds in your application.
8. Read the generated [alpha changelog](./CHANGELOG.md) and report issues through the [alpha issue forms](https://github.com/JaleelB/emblor/issues/new/choose).
