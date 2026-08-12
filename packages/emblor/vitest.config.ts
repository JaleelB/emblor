import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const fromRoot = (relPath: string) => fileURLToPath(new URL(relPath, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      emblor: fromRoot('./src/index.ts'),
      'emblor/core': fromRoot('./src/core/index.ts'),
      'emblor/addons': fromRoot('./src/addons/index.ts'),
      'emblor/sortable': fromRoot('./src/sortable/index.ts'),
      'emblor/utils': fromRoot('./src/utils/index.ts'),
      'emblor/types': fromRoot('./src/types/index.ts'),
      'emblor/testing': fromRoot('./src/testing/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup-vitest.ts'],
  },
});
