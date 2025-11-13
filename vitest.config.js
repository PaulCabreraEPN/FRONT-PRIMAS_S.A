import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/test/setupTests.js',
    include: ['src/test/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8'
    }
  }
});
