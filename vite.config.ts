import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const { CI } = process.env;

const isCI = (CI || 'false') === 'true';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
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
    include: [
      '**/*test*/date-picker/**.test.ts',
      '**/*test*/date-picker-dialog/**.test.ts',
      '**/*test*/date-picker-input-surface/**.test.ts',
      '**/*test*/helpers/clamp-value.test.ts',
      '**/*test*/helpers/date-validator.test.ts',
      '**/*test*/helpers/focus-element.test.ts',
      // '**/*test*/date-picker-input/**.test.ts',
    ],
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
    setupFiles: ['./src/setup-test.ts'],
    watch: !isCI,
  },
});
