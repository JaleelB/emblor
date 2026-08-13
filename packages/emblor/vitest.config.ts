import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const fromRoot = (relPath: string) => fileURLToPath(new URL(relPath, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      emblor: fromRoot('./src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup-vitest.ts'],
  },
});
