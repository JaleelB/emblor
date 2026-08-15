import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  target: 'es2019',
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
});
