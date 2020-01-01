import { WdioConfig } from './custom_typings.js';

export const config: WdioConfig = {
  runner: 'local',
  specs: [
    // './dist/tests/**/*.spec.js',
    // './dist/tests/app-datepicker/tests.js',
    './dist/tests/app-datepicker-dialog/tests.js',
  ],
  exclude: [],
  maxInstances: 45,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--window-size=800,600',
          '--headless',
          '--no-sandbox',
          // '--disable-gpu',
        ],
        w3c: true,
      },
      maxInstances: 9,
    },
    {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: [
          '--window-size=800,600',
          '--headless',
        ],
      },
      maxInstances: 9,
    },
  ],
  logLevel: 'error',
  bail: 1,
  baseUrl: 'http://localhost',
  waitforTimeout: 10e3,
  connectionRetryCount: 3,

  services: [
    'selenium-standalone',
  ],
  seleniumLogs: 'logs',

  framework: 'mocha',
  specFileRetries: 1,
  reporters: ['spec'],
  mochaOpts: {
    // asyncOnly: true,
    checkLeaks: true,
    inlineDiffs: true,
    require: ['reify'],
    timeout: 30e3,
    ui: 'bdd',
  },
};
