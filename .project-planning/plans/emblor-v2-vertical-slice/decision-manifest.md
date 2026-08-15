# Decision Manifest: Emblor v2 Vertical Slice

## Required

All active decisions governing package shape or tag-input behavior are required:

| Decision | Applicability                                                                 |
| -------- | ----------------------------------------------------------------------------- |
| DR-0001  | Defines headless scope, ownership, hard break, and excluded features.         |
| DR-0002  | Requires one package and removal of abandoned/feature packages.               |
| DR-0003  | Defines the public `string[]` value model and private focus ownership.        |
| DR-0004  | Requires explicit React 18 and 19 support without rebasing.                   |
| DR-0005  | Keeps the website deferred and permits only a temporary core harness.         |
| DR-0007  | Defines the root-only public export surface.                                  |
| DR-0008  | Defines the `EmblorClear` name with no alias.                                 |
| DR-0009  | Separates canonical transformation from boolean validation.                   |
| DR-0010  | Separates literal delimiters from Enter and opt-in Tab.                       |
| DR-0011  | Defines one internal actual-focus index and focus styling.                    |
| DR-0013  | Defines CI-only quality enforcement and removal of unused hooks.              |
| DR-0014  | Defines Node 24 primary and Node 22 compatibility.                            |
| DR-0015  | Places controlled/uncontrolled draft state on Root.                           |
| DR-0016  | Guarantees prop forwarding, styling freedom, polymorphic types, and refs.     |
| DR-0017  | Defines TagList rendering and adds TagText.                                   |
| DR-0018  | Defines native repeated-value forms, required, disabled/read-only, and reset. |
| DR-0019  | Defines persistent/transient invalid state and structured rejection.          |
| DR-0020  | Assigns tag occurrence identity and keys to consumers.                        |
| DR-0021  | Defines private Tag context and removes TagRemove `index`.                    |
| DR-0022  | Defines the sole metadata-rich value mutation callback.                       |
| DR-0023  | Defines native prop names and the final Root/part ownership boundary.         |
| DR-0024  | Requires max-length rejection without truncation.                             |
| DR-0025  | Defines all-or-nothing Clear under `minTags`.                                 |
| DR-0026  | Defines ordered partial paste acceptance and callback batching.               |
| DR-0027  | Defines private customizable live announcements.                              |
| DR-0028  | Suppresses all Emblor keyboard commands during IME composition.               |
| DR-0029  | Defines direction-aware physical arrow navigation.                            |
| DR-0030  | Keeps Input editable at capacity and preserves rejected draft.                |
| DR-0031  | Defines constraint configuration errors and non-retroactive changes.          |
| DR-0032  | Defines single-code-point literal delimiter grammar.                          |
| DR-0034  | Requires exactly one Input and allows zero-or-one TagList.                    |
| DR-0035  | Preserves semantics and behavior under polymorphism.                          |
| DR-0036  | Defines length as Unicode code points.                                        |
| DR-0037  | Defines prospective-draft paste parsing and selection behavior.               |
| DR-0038  | Applies blur actions only when focus leaves Root.                             |
| DR-0039  | Trusts valid external strings and enforces rendered-index integrity.          |
| DR-0040  | Defines post-removal and post-clear focus restoration.                        |

## Related

| Decision | Reason                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| DR-0012  | Alpha-release policy informs documentation and later gates, but publishing is outside this vertical-slice implementation plan. |
| DR-0041  | Records the completed evidence review and freezes the verified architecture boundary.                                          |

## Not Applicable

| Decision | Reason                                                       |
| -------- | ------------------------------------------------------------ |
| DR-0006  | Superseded by DR-0017, which retains Label and adds TagText. |
| DR-0033  | Superseded by DR-0034, which requires exactly one Input.     |

## Deferred

None. Website work and alpha publication are plan non-goals governed by active decisions, not deferred obligations of this plan.

## Conflicts or Uncertainty

- DR-0003's provisional note allowed possible generated tag IDs. DR-0020 is the later specific decision and resolves that point: Emblor generates no Tag IDs and exposes no identity helper.
- DR-0016 permits polymorphism on every part. DR-0035 refines rather than contradicts it by preserving semantics and narrowing compatible Input elements.
- DR-0019's native-required interaction is resolved by DR-0018 and DR-0034: the one visible Input is the required invalid-focus target.
- DR-0026's paste batch policy is refined by DR-0037's prospective-draft and selection rules.
- DR-0029's directional navigation operates over the sparse mounted registry defined by DR-0039.
- No unresolved conflict blocks implementation.

## Supersession Resolution

```text
DR-0006 (Label, no TagText) ──superseded by──> DR-0017 (Label + TagText)
DR-0033 (Input optional) ─────superseded by──> DR-0034 (exactly one Input)
```
