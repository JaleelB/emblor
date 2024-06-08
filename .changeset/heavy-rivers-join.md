---
'emblor': patch
---

🚀 Features:

- Tag Select Toggle (c90339a): Implemented a toggle functionality for selecting tags in the autocomplete component. Users can now click on a tag to either add it to or remove it from the selection.
- Dynamic Popover Positioning (6aa90c8): Refined the positioning of the popover content in the autocomplete component to dynamically adjust its position relative to the trigger container, ensuring a consistent 16px gap.
- Combobox with Button Trigger (a989aed): Refactored the autocomplete component's tag popover to utilize a button as the trigger, enhancing accessibility and user interaction.
- Button Trigger with Focus Management (1882c27): Updated the tag popover to use a button trigger with improved focus management, ensuring the popover remains open while the input is focused and closes appropriately when focus is lost.

🐞 Bug Fixes:

- Popover Focus Issue (98c11c8): Resolved an issue where the popover did not close upon outside clicks when autocomplete was enabled, improving UX by ensuring consistent popover behavior.
- Clearing Tags Logic (c316f20): Provided default logic to handle the clearing of tags if the onClearAll event isn't passed, preventing errors and enhancing functionality.
