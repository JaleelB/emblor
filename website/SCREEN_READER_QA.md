# Screen-reader release check

Run this check against the production build whenever Emblor behavior, the documentation shell, search, playground dialogs, or live-region copy changes. Record the browser, screen reader, versions, date, tester, and result in `QA_REPORT.md`.

## Required environment

- Windows 11 with Narrator or NVDA and current Chrome or Edge.
- Safari with VoiceOver is recommended before a stable release.
- Start with the pointer out of the way and navigate without looking at the screen.

## Documentation shell

1. Open `/docs/introduction` and start reading from the top.
   - Expected: the skip link, site header, primary navigation, documentation navigation, `Introduction` level-one heading, description, main content, and `On this page` navigation are distinguishable.
   - Fail if decorative icons are announced, the page starts inside an unlabeled region, or content order differs from visual order.
2. Use the heading shortcut to move through the page.
   - Expected: one level-one heading followed by logically nested level-two and level-three headings, without skipped levels.
3. Use the landmark shortcut.
   - Expected: header/banner, primary navigation, documentation navigation, main content, and page table of contents have useful names.
4. Move through the API table on `/docs/reference/api` using table commands.
   - Expected: the table name and row/column headers provide enough context to understand each value.

## Search dialog

1. Open search with `Ctrl+K`.
   - Expected: `Search documentation` is announced as a dialog and focus moves to its text field once, without selecting or announcing unrelated page content.
2. Enter `styling` and move through results.
   - Expected: each result announces its title, section, and useful excerpt; matched text remains understandable without relying on color.
3. Enter `qxzvplmokn`.
   - Expected: `No results for qxzvplmokn. Try a component, prop, or guide name.` is announced.
4. Press Escape.
   - Expected: the dialog closes and focus returns to the search trigger.

## Basic tag field

1. Open `/playground/tag-input-basic`, focus `Add a skill`, enter `design`, and press Enter.
   - Expected: the tag is added, the draft clears, and Narrator announces `Added tag design` once.
2. Move backward from the empty input with Backspace, then activate `Remove design`.
   - Expected: the selected tag is identifiable, removal announces `Removed tag design` once, and focus moves to the nearest remaining tag or input.
3. Activate `Clear all tags`.
   - Expected: the removed values are announced once and focus remains in the field workflow.

## Validation and bulk entry

1. In `/playground/tag-input-validation`, try to commit `invalid`.
   - Expected: the visible error is associated with the input and the rejection announcement begins `Could not add invalid`.
2. In `/playground/tag-input-constraints`, paste two valid comma-separated values.
   - Expected: both tags are added and announced together as `Added tags` followed by the values, without one announcement per render.
3. Reach maximum capacity.
   - Expected: the input communicates the full/disabled addition state and the maximum message is available without relying on color.

## Focused preview and installation sheet

1. Open the focused Basic preview.
   - Expected: the dialog title and description are announced, background content is inert, and focus remains trapped until dismissal.
2. Visit each state control: Disabled, Read-only, Invalid, and At limit.
   - Expected: each selected state is announced and the field exposes the corresponding native/ARIA state.
3. Close the dialog.
   - Expected: focus returns to `Focus Basic compound field preview`.
4. Open the installation sheet, read the install command, use Copy, and close it.
   - Expected: the sheet has a useful title, `Copied to clipboard` is announced once as status, and focus returns to Install.

## Pass criteria

- No unlabeled interactive controls.
- No duplicate, missing, or stale mutation announcements.
- Dialog and sheet focus never escape into background content.
- Reading, heading, landmark, table, and form-control navigation follow a useful order.
- Every operation and state remains understandable without sight or color.
- Record defects with route, control, exact spoken phrase, expected phrase, browser, and screen-reader version.
