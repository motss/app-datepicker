import { WdioConfig } from './custom_typings.js';

export const config: WdioConfig = {
  runner: 'local',
  specs: [
    // './dist/tests/**/*.spec.js',
    './dist/tests/tests.js',
  ],
  exclude: [],
  maxInstances: 15,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--window-size=1920,1080',
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
        ],
        w3c: true,
      },
      maxInstances: 5,
    },
    {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: [
          '--window-size=1920,1080',
          '--headless',
        ],
      },
      maxInstances: 5,
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
