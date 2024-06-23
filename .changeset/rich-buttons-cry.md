---
'emblor': patch
---

🐞 Bug Fixes:

Restored Default Outside Click Behavior for TagPopover: Updated the TagPopover component to close when clicking outside its bounds, restoring the default behavior that was unintentionally overridden in previous updates. This issue arose due to modifications intended to keep the popover open under specific circumstances, such as focusing within the popover's content. The fix involved adjusting event handling to ensure that the popover's native functionality provided by Radix UI is preserved, allowing it to close as expected when focus is lost or an outside click is detected.
