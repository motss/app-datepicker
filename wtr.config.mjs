import { nodeResolve } from '@rollup/plugin-node-resolve';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import { sendKeysPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';

const nodeResolvePlugin = fromRollup(nodeResolve);

const {
  CI = 'false',
  COVERAGE = 'false',
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
  plugins: [
    nodeResolvePlugin({
      /**
       * NOTE(motss): If you see the following warnings when running the tests, those are expected
       * behavior when you run with the `development` version of `lit`.
       *
       * Using `dedupe: [id => /lit/i.test(id)]` or equivalent will not make the warnings go away.
       *
       * @example
       *
       * ```sh
       * Lit is in dev mode. Not recommended for production! See https://lit.dev/msg/dev-mode for more information.
       * Multiple versions of Lit loaded. Loading multiple versions is not recommended. See https://lit.dev/msg/multiple-versions for more information.
       * ```
       *
       */
      exportConditions: ['default', 'dev', 'development', 'esbuild', 'import'],
      extensions: ['.mjs', '.js', '.ts', '.css', '.graphql'],
    }),
    esbuildPlugin({ ts: true, target: 'es2021' }),
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
