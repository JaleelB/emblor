# 0013 — Use CI-Only Quality Enforcement

## Status

Accepted

## Context

The repository no longer contains `.husky/pre-commit`, but root metadata still runs `husky` during `prepare` and retains Husky, lint-staged, and `tsc-files` dependencies and configuration. The former hook only invoked lint-staged. Meanwhile, current CI builds packages and checks formatting but does not execute the Emblor package's lint, typecheck, or tests.

## Decision

Do not restore the Husky pre-commit hook.

Remove the root `prepare` script, Husky, lint-staged, `tsc-files`, and lint-staged configuration when they have no other verified use. Use CI as the authoritative enforcement boundary.

CI for the v2 package must run formatting verification, lint, typecheck, tests, production build, and package-content/export verification. Local package scripts should expose the same checks so contributors can run them voluntarily before pushing.

## Alternatives Considered

- Restore the former lint-staged pre-commit hook.
- Keep both local hooks and CI enforcement.
- Retain the unused hook dependencies for possible future use.
- Rely only on developer convention without automated enforcement.

## Consequences

- Local commits are not blocked or modified by repository hooks.
- Every pushed change receives the same reproducible quality checks.
- CI must be strengthened before release because the current workflows omit critical package checks.
- Dead installation scripts and dependencies are removed.
- If fast local hooks become desirable later, they require a new decision and must not replace CI.

## Related Files

- `package.json`
- `pnpm-lock.yaml`
- `.github/workflows/ci.yml`
- `.github/workflows/code-check.yml`
- `.github/workflows/publish.yml`
- `packages/emblor/package.json`

## Related Plan

`.project-planning/plans/emblor-v2-package.md`

## Supersedes

The incomplete Husky/lint-staged setup and the former pre-commit hook.

## Superseded By

None.

## Notes

Accepted by Jaleel on 2026-08-11.
