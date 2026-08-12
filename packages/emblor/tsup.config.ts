import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'addons/index': 'src/addons/index.ts',
    'sortable/index': 'src/sortable/index.ts',
    'utils/index': 'src/utils/index.ts',
    'types/index': 'src/types/index.ts',
    'testing/index': 'src/testing/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  target: 'es2019',
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false
});
