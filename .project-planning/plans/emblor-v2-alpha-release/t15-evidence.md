# T-15 Evidence: Final Phase 3 `main` Candidate

## Verdict

**PASS.** Phase 3 candidate verification completed. Phase 4 publication remains separately unauthorized.

## Exact merged candidate

- Merged `main` SHA: `76bbd359eebc522dedd03cbfcacfcc6cfa903b96`
- Merge subject: `Merge pull request #122 from JaleelB/release/v2-alpha-integration`
- Merge parents:
  - `a6e86c5793d207b85ec9332fd8836bc2a511e860` — workflow-enabled `main`
  - `2eb96b64092772ab661dd98a5fc54360c1fd5286` — PR #122 candidate before merge

The PR head `2eb96b6...` was not treated as the publication candidate. All final evidence uses merged `main` SHA `76bbd35...`.

## Verification evidence

| Gate                     | Result     | Evidence                                                                                                                 |
| ------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| Node 22 CI               | Pass       | [CI run 31923283942](https://github.com/JaleelB/emblor/actions/runs/31923283942), job `95106659541`                      |
| Node 24 CI               | Pass       | [CI run 31923283942](https://github.com/JaleelB/emblor/actions/runs/31923283942), job `95106659566`                      |
| Chromium browser gate    | Pass       | Node 24 job: 8 browser tests passed in 4.4s                                                                              |
| Package tests            | Pass       | Node 24 job: 5 files, 76 tests passed                                                                                    |
| Export/package checks    | Pass       | Node 24 packed distribution gate                                                                                         |
| React 18 packed consumer | Pass       | Node 24 packed distribution gate                                                                                         |
| React 19 packed consumer | Pass       | Node 24 packed distribution gate                                                                                         |
| Distribution dry-run     | Pass       | Node 24 CI distribution gate completed                                                                                   |
| Release dry-run          | Pass       | Local checkout at `76bbd35`; `release:dry-run` passed without publication                                                |
| Vercel                   | Pass       | [Vercel deployment](https://vercel.com/jaleelbs-projects/emblor/DDfVEBjxhoPf2LSXMVY5UwyDL9bF)                            |
| Workflow boundary        | Pass       | `publish.yml` uses shared exact-SHA boundary validator; `website/package.json` is the only allowed frozen website path   |
| Trusted publishing       | Configured | Repository `JaleelB/emblor`, `.github/workflows/publish.yml`, protected environment `npm`, publish job `id-token: write` |

## Registry pre-state

- npm `latest`: `1.4.8`
- npm `next`: absent before alpha publication
- `emblor@2.0.0-alpha.0`: absent; npm returned expected `E404`

## Publication separation

- `publish.yml` dispatched: **NO**
- Current-SHA publish run: **NONE**
- npm publication attempted: **NO**
- Historical `publish.yml` failure on SHA `88daf89...`: unrelated old run; not part of current transition

## Non-blocking CI notes

CI reported GitHub Actions Node.js 20 deprecation annotations for action internals. Jobs passed; annotations did not affect T-15 verdict.

## Phase boundary

Phase 3 is complete. Phase 4 still requires explicit authorization naming:

- exact merged `main` SHA: `76bbd359eebc522dedd03cbfcacfcc6cfa903b96`
- version: `2.0.0-alpha.0`

No publication authorization is inferred from merge, CI, or this evidence record.
