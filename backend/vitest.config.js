import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test'
    },
    globals: true,
    setupFiles: ['./tests/setup.js']
  }
});
