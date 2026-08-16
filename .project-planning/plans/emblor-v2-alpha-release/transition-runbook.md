# Transition Runbook: v1 Maintenance Line and v2 Alpha Integration

## Status

Ready for execution. No branch creation, issue mutation, pull-request mutation, merge, npm publication, or dist-tag change is performed by this document.

Phase 3 package preparation is complete on `feat/emblor-v2-refactor`. Candidate `337985d5c1a8ebfecf81557a974ee2df9f67bf84` passed Node 22 and Node 24 CI, including the Chromium browser gate, in [GitHub Actions run 31814904247](https://github.com/JaleelB/emblor/actions/runs/31814904247). The npm trusted publisher is configured for `JaleelB/emblor`, `publish.yml`, environment `npm`, and permission `npm publish`.

T-11 through T-14 are now evidenced: v1 is preserved on `1.x`, the backlog is classified internally, manual release control is installed on `main`, and PR #122's integration candidate is green on Node 22/24, website checks, and Vercel. Remaining Phase 3 work is the reviewed merge and exact resulting `main` candidate verification. Phase 4 publication and all public backlog replies/closures remain separately gated.

## Desired Repository and Registry State

```text
GitHub
├── 1.x       v1 source; critical maintenance only
└── main      v2 alpha, beta, documentation, and stable work

npm
├── latest    1.4.8 throughout alpha and beta
└── next      2.0.0-alpha.x and 2.0.0-beta.x
```

Git state does not mutate npm. Pull requests and merges do not publish. Only the protected manual workflow may publish a verified tarball.

## Scope

### Included

- Preserve current v1 `main` as remote branch `1.x`.
- Classify existing v1 issues and pull requests internally without mutating public issue/PR state.
- Prepare post-publish reply/closure dispositions; act on them only after the alpha is public and each reply can contain a real npm `next` link.
- Replace the automatic token-based `main` publish workflow with manual trusted publishing.
- Integrate `feat/emblor-v2-refactor` into `main` through a reviewed integration branch.
- Re-run the complete exact-SHA release gate on the resulting `main` candidate.
- Hand the approved SHA to the separately authorized Phase 4 publication action.

### Excluded

- Routine v1 fixes, feature work, dependency modernization, or architectural cleanup.
- Publishing `1.4.9` merely because old reports exist.
- Publishing `2.0.0-alpha.0` during Phase 3.
- Moving npm `latest` away from `1.4.8`.
- Reintroducing autocomplete, sortable behavior, Tailwind, Shadcn, CVA, or v1 compatibility into v2.
- Deciding final v1 sunset duration.

## Preconditions

- Preserve current uncommitted planning edits before switching branches:

  ```text
  .changeset/README.md
  .project-planning/README.md
  .project-planning/plans/emblor-v2-distribution-readiness/implementation-review.md
  .project-planning/roadmaps/emblor-v2-to-stable.md
  ```

- Confirm `origin/main` still represents v1 and `origin/feat/emblor-v2-refactor` contains the approved Phase 3 preparation series.
- Do not expose or copy npm/GitHub credentials into planning evidence.
- Do not dispatch `publish.yml` during this transition.

## T-11 — Preserve v1 on `1.x`

Decisions: DR-0012, DR-0042.

Obligations: AR/O-19.

1. Commit or stash current local edits deliberately.
2. Fetch remote state and verify `refs/heads/1.x` does not already exist.
3. Create `1.x` from exact current `origin/main` v1 tip.
4. Push `1.x` without changing `main` or npm.
5. Enable branch protection against force pushes and deletion when repository settings permit.
6. Record branch-point SHA in implementation review.

Reference commands:

```powershell
git status --short
git fetch origin --prune
git ls-remote --heads origin 1.x
git switch --create 1.x origin/main
git push --set-upstream origin 1.x
```

Verification: VT-11.

## T-12 — Classify v1 issues and pull requests internally

Decisions: DR-0001, DR-0012, DR-0041, DR-0042.

Obligations: AR/O-20.

During Phase 3, do not reply to or close public issues and pull requests. Build an internal disposition queue that distinguishes “addressed by v2” from “removed from core,” records the evidence needed after publication, and never promises a v1 patch without a separate approved plan. Public replies and closures are post-publish actions only.

### Out-of-scope v1 capabilities

Classify for a post-publish explanation and closure where appropriate:

- autocomplete/suggestions: issues #87, #90, #93, #107, #118 and PR #116;
- Tailwind or v1 styling coupling: issues #94 and #109;
- v1-only feature/API requests: issues #95, #96, #99, #100 and #108.

Autocomplete, sortable behavior, and styling integrations may appear later as consumer-owned documentation examples. They must not return to core.

### Legitimate reports likely addressed by v2

Queue for post-publish testing and a precise migration reply:

- packaging/runtime interop: issues #104 and #117;
- React 19 peer compatibility: issue #119;
- DOM prop forwarding: issue #102;
- mobile/keyboard behavior: issue #69;
- delimiter paste: issue #97;
- Backspace removal: issue #106 and PR #86.

PR #86 targets obsolete v1 internals. Queue a thanks-and-migration reply after the alpha is public and equivalent v2 behavior can be linked. Do not merge it into either v2 or `1.x` merely to clear the queue.

### Administrative or security verification

- Issue #120: verify against published package manifest. `npm-run-all` and `rimraf` are not dependencies of published `emblor@1.4.8`; queue an explanation and closure after publication unless a package-install reproduction is supplied.
- Issue #98: determine whether reported `tsup`/Rollup advisory affects shipped runtime or only development tooling. Escalate only a confirmed consumer or release-system vulnerability. Do not label an unverified report as resolved.
- Questions, stale reports, and incomplete reproductions: record the missing evidence or proposed closure reason; do not create speculative v1 work.

### v1 patch threshold

Stop alpha integration and create a separate bounded v1 patch plan only for:

- a confirmed exploitable consumer security vulnerability;
- a systemic installation failure affecting supported v1 population;
- a similarly critical regression with a small, isolated, testable fix.

Ordinary bugs remain documented historical v1 issues and do not block alpha. Public issue/PR actions wait for the post-publish gate.

Verification: VT-12.

## T-13 — Install manual trusted publishing on `main`

Decisions: DR-0012–DR-0014, DR-0042.

Obligations: AR/O-21.

1. Create `chore/manual-alpha-publishing` from `origin/main`.
2. Copy only `.github/workflows/publish.yml` from `origin/feat/emblor-v2-refactor`.
3. Confirm diff removes automatic `workflow_run`/Changesets/token publishing and adds only protected `workflow_dispatch` OIDC publishing.
4. Commit, push, and open a workflow-only PR targeting `main`.
5. Require CI and review, then merge.
6. Confirm GitHub Actions exposes `Publish alpha` and old automatic `Publish` workflow is no longer active from `main`.
7. Do not dispatch workflow.

Reference commands:

```powershell
git switch --create chore/manual-alpha-publishing origin/main
git restore --source origin/feat/emblor-v2-refactor -- .github/workflows/publish.yml
git diff -- .github/workflows/publish.yml
git add .github/workflows/publish.yml
git commit -m "ci(release): require manual trusted publishing"
git push --set-upstream origin chore/manual-alpha-publishing
gh pr create --base main --head chore/manual-alpha-publishing --title "ci(release): require manual trusted publishing" --body "Replace automatic token publishing with manually dispatched, exact-SHA, protected-environment npm OIDC publishing. No package publication."
```

Verification: VT-13.

## T-14 — Prepare and review v2 integration PR

Decisions: DR-0001, DR-0012–DR-0014, DR-0041, DR-0042.

Obligations: AR/O-22.

1. Fetch updated `main` after workflow-only PR merges.
2. Create `release/v2-alpha-integration` from updated `origin/main`.
3. Merge `origin/feat/emblor-v2-refactor` with `--no-commit --no-ff`.
4. Resolve conflicts in favor of frozen v2 package unless a current `main` change is independently required and compatible.
5. Review four current `main`-only commits: `fd10bbd`, `dd511c0`, `4402cf8`, and `88daf89`.
6. Prove no v1 component, autocomplete, sortable, styling runtime, old dependencies, or obsolete publishing path returns.
7. Commit reviewed merge, push, and open a PR targeting `main`.

Reference commands:

```powershell
git fetch origin --prune
git switch --create release/v2-alpha-integration origin/main
git merge --no-commit --no-ff origin/feat/emblor-v2-refactor
git status
git diff --cached --stat
git diff origin/feat/emblor-v2-refactor -- packages/emblor/src
git diff origin/feat/emblor-v2-refactor -- packages/emblor/package.json
```

After review:

```powershell
git commit -m "chore(release): integrate v2 alpha candidate"
git push --set-upstream origin release/v2-alpha-integration
gh pr create --base main --head release/v2-alpha-integration --title "chore(release): integrate Emblor v2 alpha" --body "Integrate the verified Emblor v2 alpha candidate. npm publication remains separate and manually approved."
```

Verification: VT-14.

Current state: PR #122 is open against `main` with all required checks green. Do not merge it in this run; T-15 records the final merged-SHA gate.

## T-15 — Approve final Phase 3 `main` candidate

Decisions: DR-0012–DR-0014, DR-0041, DR-0042.

Obligations: AR/O-22, AR/O-23.

1. Require Node 22 and Node 24 CI on exact integration candidate.
2. Require Node 24 Chromium, packed React 18/19 consumers, export/package checks, and release dry-run.
3. Merge only after frozen-boundary review passes.
4. Treat resulting verified `main` SHA as Phase 4 candidate. Do not publish older feature-branch SHA.
5. Record approval outside candidate commit or in post-publish evidence so release SHA does not become self-referential.
6. Require a new explicit user instruction naming exact `main` SHA and `2.0.0-alpha.0` before dispatch.

Verification: VT-15.

## Verification Tasks

### VT-11 — v1 preservation

Verify `origin/1.x` equals recorded pre-v2 `origin/main` SHA and no npm state changed.

### VT-12 — Backlog disposition

Record the internal issue/PR classification, queued reply/closure disposition, unresolved v1 defects, and any escalated security evidence. Do not mutate public issue/PR state in Phase 3; post-publish verification records the real reply/closure links and `next` links. Confirm no v1 code change was made merely to clear backlog.

### VT-13 — Publication-control replacement

Verify default-branch `publish.yml` uses only manual dispatch, exact candidate inputs, successful-CI lookup, Node 24 OIDC, protected `npm` environment, verified tarball publication under `next`, and no `NPM_TOKEN` or automatic trigger. Confirm no workflow run was dispatched.

### VT-14 — Integration boundary

Review merge conflicts and final tree against DR-0041. Run source/dependency/export scans proving excluded v1 coupling remains absent.

### VT-15 — Final Phase 3 gate

Record exact merged `main` SHA, CI run, browser result, packed-consumer result, dry-run result, trusted-publisher configuration, npm registry pre-state, and explicit Phase 3 verdict. Publication remains unattempted.

## Post-publish backlog actions

These actions do not belong to Phase 3 and must not be performed while the alpha is unpublished:

1. After the exact alpha is public and VT-09 passes, revisit the internal disposition queue.
2. Reply to each applicable issue or pull request with the actual migration or scope result, distinguishing v2 resolution from removal from core.
3. Include a real npm `next` link such as [`next`](https://www.npmjs.com/package/emblor?activeTab=versions); do not post a placeholder link.
4. Close only reports whose disposition is supported by the published artifact and linked evidence. Keep unresolved v1 defects open.

## Commit and PR Milestones

1. Remote branch milestone: `1.x` created from current v1 `main`; no commit required.
2. Workflow PR: one narrow commit replacing automatic publication.
3. Internal issue/PR classification: planning evidence only; no external repository mutation or package commit is required in Phase 3.
4. Integration PR: reviewed merge commit plus only necessary planning reconciliation.
5. Phase 4: protected workflow run, npm/GitHub prerelease, and post-publish evidence; not part of this transition runbook.

## Rollback

- Before integration merge: close integration PR and leave `main` unchanged.
- After integration merge but before publication: revert integration merge only if a release blocker requires it; npm remains unchanged.
- After npm alpha publication: never unpublish as rollback. Record defect and publish a corrected alpha under roadmap policy.
- Never delete or rewrite `1.x` to roll back v2.

## Completion Gate

This transition is complete only when:

- `origin/1.x` preserves pre-v2 `main` tip;
- v1 backlog has documented disposition without broad v1 implementation;
- default-branch publication is manual, OIDC-based, and protected;
- v2 is integrated into `main` without reintroduced v1 coupling;
- exact merged `main` SHA passes every Phase 3 gate;
- npm still reports `latest: 1.4.8` and no `2.0.0-alpha.0`;
- explicit Phase 4 authorization has not been inferred from merge or CI.
