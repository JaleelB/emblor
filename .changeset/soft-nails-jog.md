---
'emblor': patch
---

🚀 Features

- Autocomplete: Automatically clear the input field after selecting a tag from the autocomplete suggestions.
- Popover: Added `usePortal` prop to Popover to handle rendering in modal contexts better. This ensures that the Popover can render correctly in various z-index contexts and when used within modal dialogs.

🔄 Refactoring

- Autocomplete: Replaced traditional command components with custom divs and input for improved customization and performance.

🛠️ Fixes

- Tag Input: Cleaned up debugging logs from the tag input feature, reducing console clutter and potential performance hits during production use.
