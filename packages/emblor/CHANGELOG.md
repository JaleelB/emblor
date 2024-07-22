# emblor

## 1.4.1

### Patch Changes

- e68ae9d: 🚀 Features:

  - Added styling prop for clear all tags button that appears when clearAll prop is set to true

## 1.4.0

### Minor Changes

- 5958263: 🚀 Features:

  New Styling API: Introduced a styling API for the TagInput component and its subcomponents. This update allows developers to customize the appearance of each part of the component using a structured classNames prop. Each subcomponent, including TagList, Autocomplete, and TagPopover, can now be styled individually to match specific design requirements.

  Detailed Enhancements Include:

  - TagInput: Ability to apply custom classes to the main container and input elements.
  - TagList: Customization options for the list container and individual tags, including sortable lists.
  - Autocomplete: Extended styling capabilities for autocomplete triggers, content, command lists, and items.
  - TagPopover: Options to style the popover content and triggers separately.
  - Tag: Enhanced control over the tag container and close button styling.

## 1.3.6

### Patch Changes

- feae754: 🐞 Bug Fixes:

  Restored Default Outside Click Behavior for TagPopover: Updated the TagPopover component to close when clicking outside its bounds, restoring the default behavior that was unintentionally overridden in previous updates. This issue arose due to modifications intended to keep the popover open under specific circumstances, such as focusing within the popover's content. The fix involved adjusting event handling to ensure that the popover's native functionality provided by Radix UI is preserved, allowing it to close as expected when focus is lost or an outside click is detected.

## 1.3.5

### Patch Changes

- 2934d54: 🐞 Bug Fixes:

  Resolved an issue where custom className attributes were not being applied correctly to the TagInput component. The problem affected the ability to customize the background and other styles via the className property directly or through inputProps. The fix ensures that className values are now properly merged, maintaining both the component's functionality and the user-specified styles.

## 1.3.4

### Patch Changes

- 0e63476: - **Tag List Component Enhancements**

  - Extended the `Tag` component within the `TagList` to accept `direction` and `draggable` properties, allowing for enhanced customization and interactivity of the tags.
  - Enhanced input field flexibility to dynamically fit and adjust within the available space, wrapping only when necessary and maintaining a minimum width for usability.
  - **Additional Style Variants**

    - Included new border style variants for the `Tag` component, providing more visual customization options to better suit diverse UI design requirements.

  - **Tag Popover Adjustments**
    - Fixed the dynamic adjustment of the popover’s width to ensure it properly aligns with varying screen sizes and orientation changes, enhancing the responsiveness and consistency of UI elements.

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
