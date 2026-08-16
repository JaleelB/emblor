export const FROZEN_PATH_PREFIXES = ['packages/emblor/src/', 'packages/emblor/playground/', 'website/'];
export const ALLOWED_FROZEN_PATHS = new Set(['website/package.json']);

export function findForbiddenCandidatePaths(paths) {
  return [...new Set(paths)]
    .filter((path) => FROZEN_PATH_PREFIXES.some((prefix) => path.startsWith(prefix)))
    .filter((path) => !ALLOWED_FROZEN_PATHS.has(path))
    .sort();
}
