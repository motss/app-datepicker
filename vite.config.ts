/// <reference types="vitest" />

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const { CI } = process.env;

const isCI = (CI || 'false') === 'true';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
    },
  },
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      headless: isCI,
      isolate: true,
      ...(
        {
          name: 'chromium', // pw
          // name: 'chrome', // wdio
        }
      ),
    },
    include: ['**/*test*/date-picker/**.test.ts'],
    clearMocks: true,
    coverage: {
      thresholds: {
        "100": false,
        autoUpdate: true,
      },
      exclude: ['**/*{benchmarks,mocks,tests}*/**'],
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
    },
    environment: 'happy-dom',
    globals: true,
    watch: !isCI,
  },
});
