# Planning Session — Emblor v2 API Audit Continuation

## Date

2026-08-12

## Context

Continue the post-plan stress test after the initial implementation plan was reopened. The plan remains `Needs decisions`; implementation has not begun.

## Accepted Today

- DR-0018: native form participation with repeated ordered values, committed-tag required semantics, disabled omission, and uncontrolled native reset behavior.
- DR-0019: externally controlled `invalid` plus structured transient `onReject` events.
- DR-0020: remove generated tag IDs and leave React keys and optional DOM IDs to consumers.
- DR-0021: nested `EmblorTagText` and `EmblorTagRemove` inherit private context from `EmblorTag`.
- DR-0022: use one metadata-rich `onValueChange` and remove mutation convenience/tag-click callbacks.
- DR-0023: use native React DOM prop names on rendered parts and rename `inputBlurBehavior` to `blurBehavior`.
- DR-0024: reject overlength transformed candidates without implicit truncation.
- DR-0025: make Clear all-or-nothing and disabled whenever `minTags > 0`.
- DR-0026: partially accept valid pasted candidates in order and publish one accepted batch transition.
- DR-0027: provide default English live-region messages with a customizable `getAnnouncement` formatter.
- DR-0030: keep Input editable and focusable at `maxTags`, exposing capacity state and rejecting only commit attempts.
- DR-0031: fail fast on invalid numeric constraints and apply valid dynamic changes prospectively without mutating existing values or drafts.
- DR-0032: accept only single-code-point literal delimiters, with a valid empty-array mode and literal paste parsing.
- DR-0033: permit one Input and one TagList per Root while supporting multiple natively associated Labels.
- DR-0034: require exactly one Input, allow at most one optional TagList, and retain multiple Labels; supersedes DR-0033.
- DR-0035: preserve Emblor's required semantics and behavior across polymorphic elements, including button-equivalent actions and input-like custom editors.
- DR-0036: count `minLength` and `maxLength` in Unicode code points without a grapheme-segmentation dependency.
- DR-0037: default paste-to-add on and parse the browser-equivalent prospective draft, preserving the original draft/selection on total rejection.
- DR-0038: default blur behavior to noop and apply opt-in commit/discard only when focus leaves the entire Root.
- DR-0039: trust valid external string arrays verbatim, forbid tag-state ownership switching, and enforce sparse positional Tag index integrity.
- DR-0040: restore focus by resulting mounted position after acknowledged removal and return focus to Input after Clear.

## Remaining Interview Order

The known audit list is resolved, but the independent final audit found additional contracts:

1. IME/composition safety for commit and navigation keys.
2. RTL/direction-aware horizontal keyboard navigation.
3. Input behavior at `maxTags` capacity.
4. Handling invalid constraint configuration and dynamic constraint changes.
5. Valid delimiter shapes, especially empty and multi-character strings.
6. Cardinality of Root compound parts such as Input, Label, and TagList.

IME/composition safety is resolved by DR-0028; five newly discovered contracts remain.

RTL/direction-aware navigation is resolved by DR-0029; four newly discovered contracts remain.

Input behavior at capacity is resolved by DR-0030; three newly discovered contracts remain.

Invalid and dynamic constraint behavior is resolved by DR-0031; two newly discovered contracts remain.

Delimiter validity and parsing behavior are resolved by DR-0032; one newly discovered contract remains.

Compound-part cardinality is resolved by DR-0033; all contracts from the independent audit list are now decided.

## Final Audit Findings

The post-interview contradiction-and-omission audit reopened planning. It found no status or supersession errors in DR-0001 through DR-0033, and every accepted obligation currently has task and verification coverage. It did find additional product contracts hidden behind broad plan language:

1. DR-0033 permits Root without Input, while DR-0018 requires native `required` invalid focus to route to the visible Input.
2. DR-0016 guarantees polymorphic `as`, but semantic requirements for non-native action, label, tag, and text-entry elements are not explicit.
3. `minLength` and `maxLength` do not define whether length means UTF-16 code units, Unicode code points, or grapheme clusters.
4. Paste does not define how clipboard text combines with an existing draft/caret selection, and `addOnPaste` still lacks an explicitly accepted default.
5. `blurBehavior` does not define default behavior or event ordering when focus moves from Input to an internal Tag, Remove, or Clear control.
6. Controlled/default values and Tag rendering do not define trust/normalization, duplicate/out-of-range indexes, omitted items, or duplicate rendered indexes.
7. Keyboard and pointer removal do not yet define the exact post-removal focus target when adjacent tags remain.

These contracts must be resolved one at a time, followed by another bounded audit, before plan readiness is restored.

The first final-audit finding is resolved by DR-0034. Requiring exactly one Input removes the conflict between DR-0018 and superseded DR-0033; six final-audit contracts remain.

Polymorphic semantics are resolved by DR-0035; five final-audit contracts remain.

Unicode length semantics are resolved by DR-0036; four final-audit contracts remain.

Paste/draft interaction is resolved by DR-0037; three final-audit contracts remain.

Blur default and focus-boundary ordering are resolved by DR-0038; two final-audit contracts remain.

External-value ownership and rendered-index integrity are resolved by DR-0039; one final-audit contract remains.

Post-removal focus is resolved by DR-0040. All findings from the final contradiction-and-omission audit are now decided; plan readiness awaits the bounded resync audit.

## Bounded Final Resync Audit

Completed after DR-0040:

- 40 decision records inspected: 38 Accepted and 2 Superseded.
- DR-0006 and DR-0033 are the only superseded records and both have active replacements.
- All 38 active decisions appear in the Required manifest.
- All 38 active decisions have one or more concrete obligation rows.
- All 139 obligation rows map to non-empty tasks, files, verification, and `Planned` status.
- All referenced task and verification IDs resolve to the nine implementation tasks and nine verification tasks.
- No active decision is missing, contradicted, deferred, unmapped, partially covered, or violated.
- Every decision record contains the required durable-record sections.
- `git diff --check` passes for the planning artifacts.

The plan is implementation-ready. This bounded audit closes the decision interview; implementation should proceed from T-01 through T-09 without reopening accepted contracts unless implementation evidence reveals a genuine contradiction.

## Next Step

Begin implementation from the resynced Emblor v2 plan when authorized by Jaleel.
