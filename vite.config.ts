import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const { CI } = process.env;

const isCi = (CI || 'false') === 'true';

/* eslint-disable import/no-default-export */
// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    browser: {
      enabled: true,
      fileParallelism: true,
      headless: isCi,
      isolate: true,
      name: 'chromium', // pw
      provider: 'playwright',
      slowHijackESM: true,
      // ...{
      //   name: 'chrome', // wdio
      //   provider: 'webdriverio',
      // },
    },
    clearMocks: true,
    coverage: {
      enabled: true,
      exclude: ['**/*{benchmarks,demo,mocks,tests}*/**', '**/swipe-tracker/**'],
      provider: 'istanbul',
      reporter: ['lcov', 'text'],
      thresholds: {
        '100': false,
        autoUpdate: true,
      },
    },
    environment: 'happy-dom',
    globals: true,
    include: [
      '**/controllers/**/**.test.ts',
      // '**/*test*/date-picker/**.test.ts',
      // '**/*test*/date-picker-dialog/**.test.ts',
      // '**/*test*/date-picker-input/**.test.ts',
      // '**/*test*/date-picker-input-surface/**.test.ts',
      // '**/*test*/helpers/clamp-value.test.ts',
      // '**/*test*/helpers/date-validator.test.ts',
      // '**/*test*/helpers/focus-element.test.ts',
      // '**/*test*/helpers/is-in-current-month.test.ts',
      // '**/*test*/helpers/nullish-attribute-converter.test.ts',
      // '**/*test*/helpers/to-closest-target.test.ts',
      // '**/*test*/helpers/to-date-string.test.ts',
      // '**/*test*/helpers/to-day-diff-inclusive.test.ts',
      // '**/*test*/helpers/to-formatters.test.ts',
      // '**/*test*/helpers/to-multi-calendars.test.ts',
      // '**/*test*/helpers/to-next-selectable-date.test.ts',
      // '**/*test*/helpers/to-next-selected-date.test.ts',
      // '**/*test*/helpers/to-resolved-date.test.ts',
      // '**/*test*/helpers/to-year-list.test.ts',
      // '**/*test*/helpers/warn-undefined-element.test.ts',
      // '**/*test*/icon-button/**.test.ts',
      // '**/*test*/month-calendar/**.test.ts',
      // '**/*test*/year-grid/**.test.ts',
      // '**/*test*/year-grid-button/**.test.ts',
    ],
    setupFiles: ['./src/setup-test.ts'],
    update: !isCi,
    watch: !isCi,
  },
});
