import { join, resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      /* eslint-disable sort-keys-fix/sort-keys-fix */
      '@/types': resolve(__dirname, '../types/src'),
      '@/const': resolve(__dirname, '../const/src'),
      '@': resolve(__dirname, '../../src'),
      /* eslint-enable */
    },
    environment: 'happy-dom',
    setupFiles: join(__dirname, './tests/setup.ts'),
  },
});
