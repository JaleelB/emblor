import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'save emblor',
  minify: true,
  target: 'es2018',
  external: ['react'],
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: true,
  format: ['esm', 'cjs'],
  injectStyle: true,
});
