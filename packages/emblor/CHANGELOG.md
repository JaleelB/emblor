# emblor

## 1.3.3

### Patch Changes

- e09d618: 🐞 Bug Fixes:

  Dynamic Values Calculation Safety: Fixed an issue where the some state variable could be undefined when initialized

## 1.3.2

### Patch Changes

- 4ca4478: 🚀 Features:

  - Tag Select Toggle (c90339a): Implemented a toggle functionality for selecting tags in the autocomplete component. Users can now click on a tag to either add it to or remove it from the selection.
  - Dynamic Popover Positioning (6aa90c8): Refined the positioning of the popover content in the autocomplete component to dynamically adjust its position relative to the trigger container, ensuring a consistent 16px gap.
  - Combobox with Button Trigger (a989aed): Refactored the autocomplete component's tag popover to utilize a button as the trigger, enhancing accessibility and user interaction.
  - Button Trigger with Focus Management (1882c27): Updated the tag popover to use a button trigger with improved focus management, ensuring the popover remains open while the input is focused and closes appropriately when focus is lost.

  🐞 Bug Fixes:

  - Popover Focus Issue (98c11c8): Resolved an issue where the popover did not close upon outside clicks when autocomplete was enabled, improving UX by ensuring consistent popover behavior.
  - Clearing Tags Logic (c316f20): Provided default logic to handle the clearing of tags if the onClearAll event isn't passed, preventing errors and enhancing functionality.

## 1.3.1

### Patch Changes

- 28aec5a: 🛠️ Changes

  - Refactored inputFieldPosition prop: Removed the inline option from inputFieldPosition.
  - Renamed includeTagsInInput prop to inlineTags for better clarity and consistency.

## 1.3.0

### Minor Changes

- 36b0af1: 🚀 Features

  - Added state management for active tag index
  - Implemented keyboard navigation for tag input
  - Integrated keyboard navigation support with custom tags
  - Changed default rendering style of taglist container to be inline. Tags are now displayed in the input by default
  - Improved focus management to enhance accessibility
  - Added visual indicators for active tags

## 1.2.1

### Patch Changes

- d1ba01e: 🐞 Bug Fixes

  - Added dynamic width calculation for the tag popover to fix and issue where the popover was taking the full width of the site body
  - Ensured the input field within the popover remains editable when the popover is open.

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
