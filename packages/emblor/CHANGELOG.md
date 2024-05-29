# emblor

## 1.2.0

### Minor Changes

- 79b539d: 🚀 Features

  - Added a popover to display the autocomplete list with dynamic width, ensuring the list options do not take up too much screen space, especially beneficial for mobile devices.
  - Added a checkbox indicator to visually show selected items in the autocomplete list.
  - Set a maximum height for the command list to improve usability and prevent overflow issues.

## 1.1.2

### Patch Changes

- 0c5691f: 🐞 Bug Fixes

  - Applied a width of `fit-content` to the input component when `includeTagsInInput` is enabled.
  - Addressed an issue where the input was taking the full width of the container, causing tags to stack on top of the input.
  - Ensured that the input and tags are displayed inline, improving the user experience and layout consistency.

## 1.1.1

### Patch Changes

- 69b6dfb: updated input styling when tags are rendered inline

## 1.1.0

### Minor Changes

- 4d808e2: 🚀 Features

  - Introduced includeTagsInInput prop to allow tags to be rendered inside the input field.
  - Adjusted TagList to support inline rendering of tags within the input field.

## 1.0.3

### Patch Changes

- 6a58922: corrected 'stroke-linejoin' dom property to 'strokeLinejoin' to resolve console warning

## 1.0.1

### Patch Changes

- f69e771: removed the unused toast notification feature

## 1.0.0

### Major Changes

- dabc37d: release v1.0.0: launch of the emblor package. This version introduces the major functionality of the tag input component

## 0.0.1

### Patch Changes

- 94f783b: package init
