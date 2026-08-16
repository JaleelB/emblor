# Phase 4 Publication Evidence: `emblor@2.0.0-alpha.0`

## Verdict

**PASS — Phase 4 completed on 2026-08-16.** The approved integrated candidate is publicly installable from npm as `emblor@2.0.0-alpha.0` under `next`; npm `latest` remains the v1 line at `1.4.8`. The registry artifact, provenance, Git identity, and clean external React 18/19 consumers were independently verified.

The immutable package/source candidate was not changed. The only implementation changes made during publication were release-plumbing corrections to the workflow and its registry validator; those corrections are recorded below. Phase 5 Alpha Iteration is the next active phase. No `alpha.1` correction plan is required from the package, export, install, or consumer checks at this time.

## Authority and candidate

| Item | Evidence |
| --- | --- |
| Approved candidate | `76bbd359eebc522dedd03cbfcacfcc6cfa903b96` |
| Candidate identity | Merge commit `Merge pull request #122 from JaleelB/release/v2-alpha-integration` |
| Reachability | `origin/main` and `git ls-remote origin refs/heads/main` both resolved to the full SHA |
| Exact candidate CI | [CI run 31923283942](https://github.com/JaleelB/emblor/actions/runs/31923283942), Node 22 and Node 24 jobs passed |
| Authorized version | `2.0.0-alpha.0` |
| npm pre-state | `latest=1.4.8`; `next` and `2.0.0-alpha.0` were absent |
| User authorization | Explicitly supplied for the full SHA and exact version before dispatch |

## Protected publication

The successful publication was [workflow run 31925461639](https://github.com/JaleelB/emblor/actions/runs/31925461639). Its validation job ([95112219879](https://github.com/JaleelB/emblor/actions/runs/31925461639/job/95112219879)) passed the exact-SHA boundary, authoritative CI lookup, frozen install, distribution gate, Chromium gate, release dry-run, pack, upload, and candidate checksum. The uploaded candidate was [artifact 9257705455](https://github.com/JaleelB/emblor/actions/runs/31925461639/artifacts/9257705455) with:

```text
commit:  76bbd359eebc522dedd03cbfcacfcc6cfa903b96
version: 2.0.0-alpha.0
tarball: emblor-2.0.0-alpha.0.tgz
sha256:  cb26e1d1d1c873101704600b3761aa5827e7a7b19fc7eb3f5ffdc7c97adcac64
```

The protected `npm` environment was approved before the publish job ([95112389009](https://github.com/JaleelB/emblor/actions/runs/31925461639/job/95112389009)) crossed the environment boundary. The publish job used Node 24, OIDC trusted publishing, `--provenance`, public access, the verified local tarball, and the `next` tag. npm issued public attestations for both the npm publish predicate and SLSA provenance.

### Observed retries and repairs

No npm version or dist-tag was created by the first three attempts:

| Run | Result before publication | Registry effect |
| --- | --- | --- |
| [31925033192](https://github.com/JaleelB/emblor/actions/runs/31925033192) | Main-ref workflow checksum path defect | None |
| [31925241497](https://github.com/JaleelB/emblor/actions/runs/31925241497) | Older boundary assertion rejected the allowed `website/package.json` path | None |
| [31925323387](https://github.com/JaleelB/emblor/actions/runs/31925323387) | npm interpreted the candidate path as a Git spec because the local path lacked `./` | None |
| [31925461639](https://github.com/JaleelB/emblor/actions/runs/31925461639) | Publication succeeded; the immediate post-publish validator did not accept npm 11's JSON array shape | Version was created exactly once |

The release-plumbing corrections were committed separately as `74836ce`, `74f916e`, `badb539`, and `47277e0`. The final dispatch therefore used the corrected feature-ref workflow revision while its checkout, ancestry, CI, candidate metadata, and tarball all remained pinned to the approved merged `main` SHA. The independent validator was corrected for npm 11's response shape and passed after registry propagation. Before the next release, these workflow corrections should be ported to the default-branch workflow so the normal `main` dispatch path is self-contained.

## Registry and artifact verification

The final independent check passed:

```text
[release] npm publication verified: next=2.0.0-alpha.0; latest=1.4.8.
```

`npm view emblor dist-tags --json` returned `latest: 1.4.8` and `next: 2.0.0-alpha.0`. The exact package is available at [npm `emblor@2.0.0-alpha.0`](https://www.npmjs.com/package/emblor/v/2.0.0-alpha.0).

- Public metadata identifies repository `JaleelB/emblor`, MIT license, and `publishConfig.access: public`.
- Peer ranges are `react >=18.0.0 <20.0.0` and `react-dom >=18.0.0 <20.0.0`; there are no runtime dependencies and no package Node engine requirement.
- The root export provides ESM, CJS, and declarations; the only additional export is `./package.json`.
- The registry reports 11 files and 458,496 unpacked bytes. The public tarball URL is `https://registry.npmjs.org/emblor/-/emblor-2.0.0-alpha.0.tgz`.
- The downloaded npm tarball and workflow candidate were byte-identical. Both measured 89,169 bytes, with SHA-512 `AC5D0912E59F6CB3519BE7448ED0035CC2A4302B2AAE7DE8638EC67868A847487D9CB823E168F489DEF02C440154D745C286481821CAE9EEC511BCC582911669`.
- The tarball contains only the approved package files: `dist` ESM/CJS/maps/declarations, `package.json`, `README.md`, `MIGRATION.md`, `CHANGELOG.md`, and `LICENSE`.
- Root ESM/CJS export keys match exactly: `EmblorClear`, `EmblorInput`, `EmblorLabel`, `EmblorRoot`, `EmblorTag`, `EmblorTagList`, `EmblorTagRemove`, and `EmblorTagText`.
- Removed subpaths `emblor/src/index`, `emblor/dist/index.js`, and `emblor/addons` fail to resolve.
- npm exposes both publish and SLSA provenance attestations; the SLSA subject digest matches the public tarball SHA-512.

## Git and GitHub release identity

Registry verification preceded Git metadata creation.

- Annotated tag [`emblor@2.0.0-alpha.0`](https://github.com/JaleelB/emblor/releases/tag/emblor%402.0.0-alpha.0) was pushed alone. Its peeled target is exactly `76bbd359eebc522dedd03cbfcacfcc6cfa903b96`.
- The [GitHub prerelease](https://github.com/JaleelB/emblor/releases/tag/emblor%402.0.0-alpha.0) is published, non-draft, explicitly prerelease, and targets the same full SHA.
- Release notes are sourced from `.github/releases/2.0.0-alpha.0.md` and retain the alpha warning, migration guidance, npm `next` install, and feedback entry point.

## External npm consumers

Consumers were created outside the repository at `C:\\Users\\jbenn\\AppData\\Local\\Temp\\emblor-public-consumers\\react18` and `react19`. They had no workspace, file, link, branch, source, or override dependency. pnpm installed from `https://registry.npmjs.org/` because npm itself encountered a transient Windows TLS error; the resolved package was the public registry package.

| Consumer | Exact install | `next` install | Typecheck | Production build | Runtime/form smoke test |
| --- | --- | --- | --- | --- | --- |
| React 18.3.1 | Pass; resolved `2.0.0-alpha.0` | Pass; lockfile resolved `2.0.0-alpha.0` | Pass | Pass | Pass |
| React 19.1.1 | Pass; resolved `2.0.0-alpha.0` | Pass; lockfile resolved `2.0.0-alpha.0` | Pass | Pass | Pass |

The fixture covered controlled and uncontrolled roots, repeated native form values (`skills[]`), class/style/data/ARIA props, polymorphic `as="section"`, custom forward-ref input/button elements, root/input refs, ESM/CJS exports, and removed-subpath failures. Both runtime checks produced the expected controlled values, submitted values, refs, and polymorphism results.

## Feedback and backlog disposition

The categorized issue forms are available through the [public issue chooser](https://github.com/JaleelB/emblor/issues/new/choose). The alpha labels (`alpha`, runtime, accessibility, docs, types, contract, and severity labels) and `2.0.0-alpha.0` milestone are present.

After the npm link existed, evidence-supported v1 dispositions were posted and closed:

- Addressed by the published v2 package: [#102](https://github.com/JaleelB/emblor/issues/102), [#104](https://github.com/JaleelB/emblor/issues/104), [#117](https://github.com/JaleelB/emblor/issues/117), [#119](https://github.com/JaleelB/emblor/issues/119), and [#120](https://github.com/JaleelB/emblor/issues/120).
- Superseded or outside the frozen v2 core: [#87](https://github.com/JaleelB/emblor/issues/87), [#90](https://github.com/JaleelB/emblor/issues/90), [#93](https://github.com/JaleelB/emblor/issues/93), [#94](https://github.com/JaleelB/emblor/issues/94), [#95](https://github.com/JaleelB/emblor/issues/95), [#96](https://github.com/JaleelB/emblor/issues/96), [#99](https://github.com/JaleelB/emblor/issues/99), [#107](https://github.com/JaleelB/emblor/issues/107), [#109](https://github.com/JaleelB/emblor/issues/109), [#118](https://github.com/JaleelB/emblor/issues/118), and [PR #116](https://github.com/JaleelB/emblor/pull/116).
- Genuine unresolved behavior/security queue remains open for Alpha Iteration: [#69](https://github.com/JaleelB/emblor/issues/69), [#97](https://github.com/JaleelB/emblor/issues/97), [#98](https://github.com/JaleelB/emblor/issues/98), [#100](https://github.com/JaleelB/emblor/issues/100), [#106](https://github.com/JaleelB/emblor/issues/106), [#108](https://github.com/JaleelB/emblor/issues/108), and [PR #86](https://github.com/JaleelB/emblor/pull/86). These are not claimed as fixed by alpha.0.

Every public disposition used a real npm `next` link and distinguished v2 coverage from features intentionally excluded from the frozen core. No unresolved issue was closed as fixed.

## Phase 4 coverage and handoff

| Obligation | Result |
| --- | --- |
| P4/O-01 exact SHA/version authorization | Verified |
| P4/O-02 protected Node 24 OIDC publication | Verified; protected `npm` approval and public provenance recorded |
| P4/O-03 `next=2.0.0-alpha.0`, `latest=1.4.8` | Verified |
| P4/O-04 immutable artifact and package-boundary proof | Verified |
| P4/O-05 React 18/19 npm consumers | Verified |
| P4/O-06 representative public behavior | Verified |
| P4/O-07 matching Git/GitHub prerelease after npm | Verified |
| P4/O-08 feedback and evidence-based backlog actions | Verified |
| P4/O-09 evidence closure and Alpha Iteration handoff | Verified by this record |
| P4/O-10 no frozen-architecture mutation | Verified |

Phase 4 is complete. Phase 5 Alpha Iteration is active for real-consumer feedback and issue-scoped fixes. Do not move npm `latest`, rebuild the website, or treat alpha.0 as beta/stable.
