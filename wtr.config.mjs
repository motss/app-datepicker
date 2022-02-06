import { fromRollup } from '@web/dev-server-rollup';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { sendKeysPlugin } from '@web/test-runner-commands/plugins';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const nodeResolvePlugin = fromRollup(nodeResolve);

const {
  CI = 'false',
  COVERAGE = 'false',
  TEST_HELPERS = 'false',
} = process.env;

const isCI = CI === 'true';
const isCoverage = COVERAGE === 'true';
const isTestHelpersOnly = TEST_HELPERS === 'true';

/** @type {import('@web/test-runner').TestRunnerConfig} */
const config = {
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    ...(isTestHelpersOnly ? [] : [
      playwrightLauncher({ product: 'firefox' }),
      playwrightLauncher({ product: 'webkit' }),
    ])
  ],
  browserStartTimeout: 60e3,
  concurrency: 3,
  concurrentBrowsers: 9,
  coverage: true,
  ...(
    isCoverage && ({
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
  plugins: [
    nodeResolvePlugin({
      exportConditions: ['default', 'dev', 'development', 'esbuild', 'import'],
      extensions: ['.mjs', '.js', '.ts', '.css', '.graphql'],
    }),
    esbuildPlugin({ ts: true }),
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
};

export default config;
