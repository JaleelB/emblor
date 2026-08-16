# Decision Coverage: Emblor v2 Vertical Slice

Every Required obligation is mapped to implementation and verification. Status begins at `Planned`; implementation review must advance each row to `Verified` or expose a deviation.

| Obligation                                                                                         | Source  | Tasks                  | Files / areas                   | Verification        | Status   |
| -------------------------------------------------------------------------------------------------- | ------- | ---------------------- | ------------------------------- | ------------------- | -------- |
| O-001 Headless primitive owns behavior; consumers own markup/styling/integrations                  | DR-0001 | T-01, T-10, T-13       | package, playground, README     | VT-10, VT-12, VT-13 | Verified |
| O-002 No compatibility component or excluded feature exports/dependencies                          | DR-0001 | T-01                   | package/export/build files      | VT-01, VT-10        | Verified |
| O-003 Publish one `emblor` package and remove abandoned package layout                             | DR-0002 | T-01                   | `packages/`, workspace          | VT-01               | Verified |
| O-004 Use public `string[]`; keep focus/identity machinery private                                 | DR-0003 | T-02, T-03             | types, Root, context            | VT-02, VT-03        | Verified |
| O-005 Explicitly support React 18 and 19 without branch rebase                                     | DR-0004 | T-12                   | manifest, lockfile, CI fixtures | VT-11               | Verified |
| O-006 Leave website on v1; keep only a temporary core acceptance harness                           | DR-0005 | T-01, T-10             | website, playground             | VT-01, VT-12        | Verified |
| O-007 Export supported code only from package root; keep internals private                         | DR-0007 | T-01, T-02             | manifest, tsup, indexes         | VT-02, VT-10        | Verified |
| O-008 Export `EmblorClear` and no provisional alias                                                | DR-0008 | T-02, T-09             | Clear, types, exports           | VT-02, VT-04        | Verified |
| O-009 Trim then transform; validate transformed canonical candidate                                | DR-0009 | T-05                   | evaluator, Root actions         | VT-05               | Verified |
| O-010 Keep `transform` rewrite-only and `validate` boolean/rejection-only                          | DR-0009 | T-02, T-05             | types, evaluator                | VT-02, VT-05        | Verified |
| O-011 Enter always commits; Tab only with `addOnTab`; delimiters are literal text                  | DR-0010 | T-05, T-06             | Input, evaluator                | VT-05, VT-06        | Verified |
| O-012 Use one private actual-focus index; no public focus controls or virtual active state         | DR-0011 | T-02, T-03, T-07       | types, store, Tag/Input         | VT-02, VT-06        | Verified |
| O-013 Keep input focused after add and expose `data-focused` on actual Tag focus                   | DR-0011 | T-07                   | Input, Tag                      | VT-06, VT-09        | Verified |
| O-014 Remove unused hook toolchain and make CI authoritative                                       | DR-0013 | T-01, T-12             | root manifest, workflows        | VT-01, VT-11        | Verified |
| O-015 Run format, lint, type, tests, build, and package/export checks                              | DR-0013 | T-11, T-12             | scripts, workflows              | VT-10, VT-11        | Verified |
| O-016 Use Node 24 primary, Node 22 compatibility, exact root engine range, no package engine       | DR-0014 | T-01, T-12             | root manifest, version file, CI | VT-11               | Verified |
| O-017 Root owns controlled/uncontrolled draft and every draft mutation                             | DR-0015 | T-02, T-03, T-06       | Root, Input, store              | VT-02, VT-03, VT-05 | Verified |
| O-018 All parts forward applicable native/ARIA/data/style/events                                   | DR-0016 | T-02, T-09             | all public parts/types          | VT-02, VT-09        | Verified |
| O-019 All parts have element-sensitive `as` and ref types without styling runtime/asChild          | DR-0016 | T-02, T-09             | polymorphic types/parts         | VT-02, VT-09        | Verified |
| O-020 TagList render function uses current Root values in both state modes; static children remain | DR-0017 | T-04                   | TagList                         | VT-03, VT-04        | Verified |
| O-021 Label auto-associates; TagText reads exact nearest Tag value and allows child override       | DR-0017 | T-04, T-08             | Label, TagText, contexts        | VT-03, VT-04, VT-09 | Verified |
| O-022 `name` submits ordered repeated committed values with exact name                             | DR-0018 | T-08                   | Root/form internals             | VT-07               | Verified |
| O-023 Required means one committed tag; invalid focuses visible Input                              | DR-0018 | T-08                   | Root, Input, form internals     | VT-07, VT-09        | Verified |
| O-024 Disabled omits values; read-only submits; native reset affects only uncontrolled state       | DR-0018 | T-03, T-08             | Root/form internals             | VT-03, VT-07        | Verified |
| O-025 Expose persistent `invalid` and structured `onReject` reasons/source/raw/canonical           | DR-0019 | T-02, T-05, T-08       | types, evaluator, Root/Input    | VT-02, VT-05, VT-08 | Verified |
| O-026 Combine persistent/transient invalid attributes and clear transient state on edit/success    | DR-0019 | T-03, T-08             | store, Root, Input              | VT-08, VT-09        | Verified |
| O-027 Do not generate Tag IDs/keys; preserve supplied ID and document consumer identity            | DR-0020 | T-04, T-10, T-13       | Tag, lab, README                | VT-03, VT-04, VT-13 | Verified |
| O-028 Tag supplies private value/index context; TagText/Remove outside Tag fail clearly            | DR-0021 | T-04, T-09             | tag context and nested parts    | VT-04               | Verified |
| O-029 Remove TagRemove `index`; custom external removal stays consumer-owned                       | DR-0021 | T-02, T-09             | types, TagRemove                | VT-02, VT-04        | Verified |
| O-030 `onValueChange` is the sole mutation callback with exact discriminated details               | DR-0022 | T-02, T-05, T-06, T-07 | types and all actions           | VT-02, VT-05, VT-06 | Verified |
| O-031 One accepted transition emits once; rejection/controlled sync emits no value change          | DR-0022 | T-05, T-06             | actions/evaluator               | VT-05               | Verified |
| O-032 Use native part props and final Root behavior names; remove aliases                          | DR-0023 | T-02, T-06, T-09       | types and parts                 | VT-02, VT-09        | Verified |
| O-033 Keep `placeholderWhenFull` and behavioral constraints on Root                                | DR-0023 | T-02, T-05             | Root types/Input                | VT-02, VT-05        | Verified |
| O-034 Reject max length after transform, preserve draft, never truncate                            | DR-0024 | T-05                   | evaluator/actions               | VT-05               | Verified |
| O-035 Clear removes all only when `minTags` is zero/omitted; otherwise unavailable                 | DR-0025 | T-09                   | Clear/actions                   | VT-04, VT-09        | Verified |
| O-036 Paste evaluates candidates left-to-right against accumulated state                           | DR-0026 | T-05                   | batch evaluator                 | VT-05               | Verified |
| O-037 Paste emits rejection per rejected candidate and one ordered add-many transition             | DR-0026 | T-05, T-06             | batch actions                   | VT-05, VT-08        | Verified |
| O-038 Paste clears draft on any acceptance and preserves it on total rejection                     | DR-0026 | T-05, T-06             | batch/draft actions             | VT-05               | Verified |
| O-039 Provide private polite atomic live region and default/custom/suppressible strings            | DR-0027 | T-08                   | Root/live region/types          | VT-08, VT-09        | Verified |
| O-040 Derive announcements from mutation/rejection events with defined batch ordering              | DR-0027 | T-05, T-08             | actions/live region             | VT-08               | Verified |
| O-041 During composition, never command, prevent, mutate, reject, or announce                      | DR-0028 | T-06, T-07             | Input/Tag keyboard paths        | VT-06, VT-08        | Verified |
| O-042 Use physical arrows with direction-aware predecessor/successor and caret boundaries          | DR-0029 | T-07                   | Input/Tag navigation            | VT-06               | Verified |
| O-043 Home/End remain first/last; missing direction defaults LTR                                   | DR-0029 | T-07                   | navigation/direction resolver   | VT-06               | Verified |
| O-044 At maxTags Input stays editable/focusable, exposes state, rejects commit, preserves draft    | DR-0030 | T-05, T-06             | Root/Input/evaluator            | VT-05, VT-06, VT-09 | Verified |
| O-045 Bounds are finite non-negative integers with valid min/max relationships or Root throws      | DR-0031 | T-03, T-05             | Root constraint validation      | VT-03, VT-05        | Verified |
| O-046 Dynamic constraint changes never retroactively mutate or emit                                | DR-0031 | T-03, T-05             | Root/actions                    | VT-03, VT-05        | Verified |
| O-047 Delimiters are literal single code points; invalid entries throw; duplicates dedupe          | DR-0032 | T-05                   | delimiter validation/parser     | VT-05               | Verified |
| O-048 Empty delimiters are valid; no magic Enter/Tab aliases; consumer can cancel paste            | DR-0032 | T-05, T-06             | Input/parser                    | VT-05, VT-06        | Verified |
| O-049 Exactly one Input, zero-or-one TagList, repeatable Labels/actions across portals/Strict Mode | DR-0034 | T-03, T-04, T-08       | registrations/parts             | VT-04, VT-09        | Verified |
| O-050 Missing/duplicate structural parts and incompatible custom Input throw clearly               | DR-0034 | T-03, T-09             | registrations/Input             | VT-02, VT-04, VT-09 | Verified |
| O-051 Preserve required roles, state, focus, naming, and behavior under `as`                       | DR-0035 | T-02, T-08, T-09       | all parts                       | VT-02, VT-09        | Verified |
| O-052 Non-button actions get button semantics and exactly-once Enter/Space activation              | DR-0035 | T-09                   | Clear/TagRemove                 | VT-09               | Verified |
| O-053 Consumer handlers run first; documented cancellation/protected-prop rules apply              | DR-0035 | T-02, T-06, T-09, T-13 | parts, event utilities, docs    | VT-06, VT-09, VT-13 | Verified |
| O-054 Count canonical length in Unicode code points, not UTF-16 units/graphemes                    | DR-0036 | T-05                   | evaluator                       | VT-05               | Verified |
| O-055 Paste defaults on and parses prospective draft using selection or end fallback               | DR-0037 | T-05, T-06             | Input/paste action              | VT-05, VT-06        | Verified |
| O-056 Consumer-cancelled/disabled paste stays native; total rejection restores draft/selection     | DR-0037 | T-05, T-06             | Input/paste action              | VT-05, VT-06        | Verified |
| O-057 Blur defaults noop and acts only after focus leaves Root/registered portals                  | DR-0038 | T-03, T-06             | focus boundary/Input            | VT-06               | Verified |
| O-058 Blur commit/discard ordering, cancellation, guards, and unmount silence are preserved        | DR-0038 | T-06                   | Root/Input actions              | VT-05, VT-06        | Verified |
| O-059 External values must be string arrays, are authoritative, and do not emit/normalize          | DR-0039 | T-03, T-04             | Root/store/TagText              | VT-03               | Verified |
| O-060 Ownership switching throws; valid external changes remain callback-silent                    | DR-0039 | T-03                   | Root/state utility              | VT-03               | Verified |
| O-061 Tag indexes are valid unique positions; sparse rendering/navigation is supported             | DR-0039 | T-03, T-04, T-07       | Tag registry/navigation         | VT-04, VT-06        | Verified |
| O-062 Individual removal restores resulting position, lower fallback, then Input                   | DR-0040 | T-07                   | removal/focus coordinator       | VT-06               | Verified |
| O-063 Controlled restoration waits for exact acknowledgement and respects consumer focus           | DR-0040 | T-07                   | pending focus coordinator       | VT-06               | Verified |
| O-064 Clear restores Input only after accepted reflected transition; guards preserve focus         | DR-0040 | T-07, T-09             | Clear/focus coordinator         | VT-06, VT-09        | Verified |
