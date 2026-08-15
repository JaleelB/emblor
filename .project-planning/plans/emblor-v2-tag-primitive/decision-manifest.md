# Decision Manifest: Emblor v2 Tag Primitive Completion

## Required

These decisions directly govern a confirmed fix, residual verification task, browser gate, or behavioral-documentation obligation.

| Decision | Applicability                                                                               |
| -------- | ------------------------------------------------------------------------------------------- |
| DR-0009  | Defines trim, transform, empty, and validation ordering corrected by G-01.                  |
| DR-0010  | Governs Enter, literal delimiters, and opt-in Tab verification.                             |
| DR-0011  | Governs actual focus, roving focus, and browser focus verification.                         |
| DR-0015  | Governs Root-owned controlled/uncontrolled draft transitions and callback order.            |
| DR-0016  | Governs DOM prop forwarding, polymorphic refs, styling ownership, and protected props.      |
| DR-0018  | Governs repeated form values, required focus, disabled/read-only submission, and reset.     |
| DR-0019  | Defines transient/persistent invalid lifecycle corrected by G-02.                           |
| DR-0022  | Governs the single mutation callback, details, counts, and silence.                         |
| DR-0024  | Governs overlength rejection, draft preservation, and no implicit truncation.               |
| DR-0025  | Governs Clear and individual-removal behavior under `minTags`.                              |
| DR-0026  | Governs the batch candidate pipeline affected by G-01.                                      |
| DR-0027  | Governs live-region behavior, ordering, localization, suppression, and silence.             |
| DR-0028  | Governs the full IME command-key suppression matrix.                                        |
| DR-0029  | Governs explicit/inherited/runtime direction and physical arrow movement.                   |
| DR-0030  | Governs editable/focusable Input behavior and rejection at capacity.                        |
| DR-0031  | Governs invalid/dynamic constraints and non-retroactive state.                              |
| DR-0032  | Governs literal single-code-point delimiters and custom paste escape hatches.               |
| DR-0034  | Governs structural registration and DOM-ordered automatic labels corrected by G-03.         |
| DR-0035  | Governs semantic polymorphism, custom Input compatibility, activation, and cancellation.    |
| DR-0036  | Governs Unicode code-point counting and zero-bound ordering.                                |
| DR-0037  | Governs prospective paste and stale selection protection corrected by G-04.                 |
| DR-0038  | Governs whole-Root blur boundaries, portals, cancellation, and guards.                      |
| DR-0039  | Governs authoritative external strings, state ownership, rendered indexes, and sparse Tags. |
| DR-0040  | Governs post-removal/Clear focus restoration and controlled acknowledgement.                |
| DR-0041  | Freezes the architecture and permits contract-restoring fixes and additional proof.         |

## Related — Preserved Regression Constraints

| Decision | Reason                                                                   |
| -------- | ------------------------------------------------------------------------ |
| DR-0001  | Headless ownership and excluded-feature scope must remain intact.        |
| DR-0002  | One-package shape must remain intact.                                    |
| DR-0003  | Public `string[]` values and private focus ownership must remain intact. |
| DR-0004  | React 18/19 support remains a final compatibility gate.                  |
| DR-0005  | Website work remains outside this roadmap.                               |
| DR-0007  | Root-only exports remain a final package gate.                           |
| DR-0008  | `EmblorClear` naming remains unchanged.                                  |
| DR-0012  | Alpha release policy is downstream and not executed here.                |
| DR-0013  | CI-only enforcement remains the repository policy.                       |
| DR-0014  | Node 22/24 policy governs final verification.                            |
| DR-0017  | TagList rendering and TagText remain unchanged.                          |
| DR-0020  | Consumer-owned occurrence identity remains unchanged.                    |
| DR-0021  | Nested Tag context remains private.                                      |
| DR-0023  | Native prop names and Root/part ownership remain unchanged.              |

## Not Applicable

- DR-0006 is superseded by DR-0017.
- DR-0033 is superseded by DR-0034.

## Deferred

None.

## Conflicts or Uncertainty

None.

DR-0009 and DR-0026 are consistent: genuinely empty paste split segments are ignored, while non-empty whitespace candidates are trimmed and passed through `transform` before empty rejection. DR-0041 explicitly permits all four fixes because they restore already accepted behavior without changing the frozen public boundary.

## Supersession Resolution

```text
DR-0006 (Label, no TagText) ──superseded by──> DR-0017 (Label + TagText)
DR-0033 (Input optional) ─────superseded by──> DR-0034 (exactly one Input)
```
