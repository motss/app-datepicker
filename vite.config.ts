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
      '**/*test*/helpers/is-in-current-month.test.ts',
      '**/*test*/helpers/nullish-attribute-converter.test.ts',
      '**/*test*/helpers/to-closest-target.test.ts',
      '**/*test*/helpers/to-date-string.test.ts',
      '**/*test*/helpers/to-day-diff-inclusive.test.ts',
      '**/*test*/helpers/to-formatters.test.ts',
      '**/*test*/helpers/to-multi-calendars.test.ts',
      '**/*test*/helpers/to-next-selectable-date.test.ts',
      '**/*test*/helpers/to-next-selected-date.test.ts',
      '**/*test*/helpers/to-resolved-date.test.ts',
      '**/*test*/helpers/to-year-list.test.ts',
      '**/*test*/helpers/warn-undefined-element.test.ts',
      '**/*test*/icon-button/**.test.ts',
      '**/*test*/month-calendar/**.test.ts',
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
