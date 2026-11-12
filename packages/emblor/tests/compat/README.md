# Packed consumer fixtures

React 18 and React 19 consumers install the candidate tarball outside the workspace and run types, production builds, runtime mounts, and ESM/CJS/export checks.

`react-18-lock.yaml` and `react-19-lock.yaml` freeze the complete third-party dependency graph. Verification substitutes only the tarball path, relative path, and SHA-512 integrity, then uses `pnpm install --frozen-lockfile --ignore-scripts`. The candidate is still inspected separately by the distribution verifier. No registry resolution step runs during verification.

To deliberately refresh these fixtures, generate isolated consumers with the exact direct versions in `verify-packed-consumers.mjs`, resolve their lockfiles with the repository-pinned pnpm, and replace only the candidate-specific values with `__TARBALL_PATH__`, `__TARBALL_RELATIVE__`, and `__TARBALL_INTEGRITY__`. Review all dependency changes before committing. Do not update locks merely to make a hash pass.

Set `EMBLOR_GRAPH_DIRECTORY` to capture readable normalized graphs for review. Fingerprints retain dependency versions and edges, exclude machine-specific installation paths and optional native platform binaries, and normalize the candidate package identity. The size baseline keeps its original 10% limits. Changing dependency fingerprints never resets those limits.
