import { esbuildPlugin } from '@web/dev-server-esbuild';
import { sendKeysPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';

const {
  CI = 'false',
  COVERAGE = 'false',
  MODE = 'dev',
  TEST_HELPERS = 'false',
  WATCH = 'false',
} = process.env;

const isCI = CI === 'true';
const isCoverage = COVERAGE === 'true';
const isTestHelpersOnly = TEST_HELPERS === 'true';
const isWatch = WATCH === 'true';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    ...(isTestHelpersOnly ? [] : [
      playwrightLauncher({ product: 'firefox' }),
      playwrightLauncher({ product: 'webkit' }),
    ])
  ],
  preserveSymlinks: true,
  browserStartTimeout: 60e3,
  concurrency: 3,
  concurrentBrowsers: 9,
  ...(
    isCoverage && ({
      coverage: true,
      coverageConfig: {
        report: true,
        threshold: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        nativeInstrumentation: true,
        exclude: [
          'src/*tests*/**',
          'node_modules/**',
          ...(isTestHelpersOnly ? [
            'src/mixins/**',
            'src/root-element/**',
          ] : [
            'src/helpers/**'
          ])
        ],
      },
    })
  ),
  files: [
    `src/*tests*/${isTestHelpersOnly ? 'helpers' : '!(helpers)'}/*.test.ts`
  ],
  nodeResolve: { exportConditions: MODE === 'dev' ? ['development'] : [] },
  plugins: [
    esbuildPlugin({ ts: true, target: 'esnext' }),
    sendKeysPlugin(),
  ],
  testFramework: {
    config: {
      // checkLeaks: true,
      fullTrace: true,
      timeout: 60e3,
      ui: 'bdd',
      ...(isCI && {
        retries: 3,
      }),
    }
  },
  watch: isWatch,
};

export default config;
