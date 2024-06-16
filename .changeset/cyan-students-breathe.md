---
'emblor': patch
---

🐞 Bug Fixes:

Resolved an issue where custom className attributes were not being applied correctly to the TagInput component. The problem affected the ability to customize the background and other styles via the className property directly or through inputProps. The fix ensures that className values are now properly merged, maintaining both the component's functionality and the user-specified styles.
