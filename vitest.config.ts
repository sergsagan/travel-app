import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    env: {
      NODE_ENV: 'test',
      VITEST: 'true'
    },
    alias: {
      'drizzle-orm/libsql': fileURLToPath(new URL('./tests/mocks/drizzle.ts', import.meta.url)),
    },
  },
});
