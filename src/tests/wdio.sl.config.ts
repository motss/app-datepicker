import type {
  SauceLabsCapability,
  WdioConfig,
} from './custom_wdio.js';

import { config as baseConfig } from './wdio.config.js';

const baseCapability: SauceLabsCapability = {
  browserVersion: 'latest',
  'sauce:options': {
    build: new Date().toJSON(),
    screenResolution: '800x600',
    seleniumVersion: '3.141.59',
  },
  specs: ['./dist/tests/**/full-icu.spec.js'],
  // specs: ['./dist/tests/**/*.spec.js'],
  // specs: ['./dist/tests/app-datepicker/tests.js'],
  // specs: ['./dist/tests/app-datepicker-dialog/tests.js'],
  browserName: 'googlechrome',
  platformName: 'windows 10',
};
const sauceLabsUser = process.env.SAUCE_USERNAME || '';
const sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY || '';

export const config: WdioConfig = {
  ...baseConfig,
  // maxInstances: 72,
  services: ['sauce'],
  specs: [],
  region: 'us',
  user: sauceLabsUser,
  key: sauceLabsAccessKey,
  sauceConnect: true,
  sauceConnectOpts: {
    user: sauceLabsUser,
    accessKey: sauceLabsAccessKey,
  },
  capabilities: [
    // {
    //   ...baseCapability,
    //   'goog:chromeOptions': {
    //     w3c: true,
    //   },
    // },
    // {
    //   ...baseCapability,
    //   browserName: 'firefox',
    // },
    {
      ...baseCapability,
      browserName: 'safari',
      platformName: 'macos 10.13',
      'sauce:options': {
        ...baseCapability['sauce:options'],
        screenResolution: '1024x768',
      },
    },
    {
      ...baseCapability,
      browserName: 'microsoftedge',
      browserVersion: '18',
    },

    // {
    //   ...baseCapability,
    //   browserName: 'internet explorer',
    // },
  ] as SauceLabsCapability[],
};
