# Residual Decision Coverage: Emblor v2 Tag Primitive

This matrix tracks the residual obligations after the frozen vertical slice. Each row is closed only by direct unit, integration, type, browser, package, or documentation evidence recorded in `implementation-review.md`.

| ID      | Residual obligation                                                                                               | Source  | Tasks                  | Verification               | Final status |
| ------- | ----------------------------------------------------------------------------------------------------------------- | ------- | ---------------------- | -------------------------- | ------------ |
| RP/O-01 | Apply trim -> transform -> empty/built-in/custom ordering to single candidates and non-empty batch segments       | DR-0009 | T-01, T-05             | VT-01, VT-05               | Verified     |
| RP/O-02 | Preserve intrinsic Enter, literal delimiter, and opt-in/native Tab behavior                                       | DR-0010 | T-06, T-11             | VT-06, VT-11               | Verified     |
| RP/O-03 | Keep one private focus index synchronized with actual DOM focus and roving focus                                  | DR-0011 | T-06, T-09, T-10       | VT-06, VT-09, VT-10        | Verified     |
| RP/O-04 | Route every controlled/uncontrolled draft transition through Root with deterministic callback order               | DR-0015 | T-05                   | VT-05                      | Verified     |
| RP/O-05 | Preserve applicable DOM props, polymorphic types/refs, styling ownership, and protected precedence                | DR-0016 | T-08, T-11             | VT-08, VT-11               | Verified     |
| RP/O-06 | Prove repeated form values, required focus, disabled/read-only submission, and reset ownership in a browser       | DR-0018 | T-07, T-10, T-11       | VT-07, VT-10, VT-11        | Verified     |
| RP/O-07 | Clear transient rejection only on draft change or successful addition and compose it with persistent invalid      | DR-0019 | T-02, T-05, T-11       | VT-02, VT-05, VT-11        | Verified     |
| RP/O-08 | Emit one exact metadata-rich callback per accepted transition and remain silent for rejection/guards/sync         | DR-0022 | T-02, T-05             | VT-02, VT-05               | Verified     |
| RP/O-09 | Reject overlength candidates without truncation, preserve draft, and evaluate transformed length                  | DR-0024 | T-05, T-11             | VT-05, VT-11               | Verified     |
| RP/O-10 | Enforce all-or-nothing Clear and corrective individual removal across every minTags relation                      | DR-0025 | T-07, T-11             | VT-07, VT-11               | Verified     |
| RP/O-11 | Evaluate paste candidates left-to-right with intra-batch state, individual rejection, and one add-many transition | DR-0026 | T-01, T-05             | VT-01, VT-05               | Verified     |
| RP/O-12 | Preserve live-region semantics, exact ordering, localization/suppression, repeats, and guarded/sync silence       | DR-0027 | T-08, T-11             | VT-08, VT-11               | Verified     |
| RP/O-13 | Suppress every Emblor command during composition and resume only on a later ordinary key                          | DR-0028 | T-06                   | VT-06                      | Verified     |
| RP/O-14 | Resolve explicit/inherited/runtime direction and move physically at both Input boundaries and among Tags          | DR-0029 | T-06, T-10, T-11       | VT-06, VT-10, VT-11        | Verified     |
| RP/O-15 | Keep Input editable/focusable at capacity while preserving draft and structured rejection                         | DR-0030 | T-05, T-11             | VT-05, VT-11               | Verified     |
| RP/O-16 | Fail fast for invalid bounds and apply dynamic valid constraints prospectively and silently                       | DR-0031 | T-07, T-11             | VT-07, VT-11               | Verified     |
| RP/O-17 | Enforce literal single-code-point delimiter grammar, deduplication, escaping, and whole-draft mode                | DR-0032 | T-05, T-11             | VT-05, VT-11               | Verified     |
| RP/O-18 | Keep structural registration portal/Strict-safe and automatic Label IDs in rendered DOM order                     | DR-0034 | T-03, T-08, T-10       | VT-03, VT-08, VT-10        | Verified     |
| RP/O-19 | Preserve semantics and exactly-once/cancellable behavior across intrinsic and custom polymorphic elements         | DR-0035 | T-03, T-08, T-10, T-11 | VT-03, VT-08, VT-10, VT-11 | Verified     |
| RP/O-20 | Count canonical length in Unicode code points with documented grapheme limitations and zero-bound ordering        | DR-0036 | T-01, T-05, T-11       | VT-01, VT-05, VT-11        | Verified     |
| RP/O-21 | Parse prospective paste and restore selection only while the original intent remains current                      | DR-0037 | T-04, T-09, T-10, T-11 | VT-04, VT-09, VT-10, VT-11 | Verified     |
| RP/O-22 | Apply blur behavior only after whole-Root exit, including portals, cancellation, guards, and unmount silence      | DR-0038 | T-09, T-10, T-11       | VT-09, VT-10, VT-11        | Verified     |
| RP/O-23 | Trust external strings, lock ownership mode, enforce mounted indexes, and preserve sparse state/forms/navigation  | DR-0039 | T-07, T-09, T-11       | VT-07, VT-09, VT-11        | Verified     |
| RP/O-24 | Restore removal/Clear focus by resulting position only after accepted/acknowledged transitions                    | DR-0040 | T-09, T-10, T-11       | VT-09, VT-10, VT-11        | Verified     |
| RP/O-25 | Preserve all frozen public boundaries, compatibility policy, package shape, and excluded-feature scope            | DR-0041 | T-00 - T-12            | VT-00, VT-12               | Verified     |

## Completion rule

All 25 residual obligations are locally `Verified`. The direct evidence and local gate results are recorded in `implementation-review.md`. This status does not claim that the post-review artifact has passed the configured Node 24 CI lane; plan closure remains pending that operational confirmation.
