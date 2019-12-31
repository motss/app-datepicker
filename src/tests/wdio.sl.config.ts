import {
  SauceLabsCapability,
  SauceLabsOptions,
  WdioConfig,
} from './custom_typings';

import { config as baseConfig } from './wdio.config.js';

const baseCapability: SauceLabsCapability = {
  browserVersion: 'latest',
  'sauce:options': {
    build: new Date().toJSON(),
    screenResolution: '1920x1080',
    seleniumVersion: '3.141.59',
  },
  specs: ['./dist/tests/**/*.spec.js'],
  browserName: 'googlechrome',
  platformName: 'windows 10',
};
const sauceLabsUser = process.env.SAUCE_USERNAME || '';
const sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY || '';

export const config: WdioConfig = {
  ...baseConfig,
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
    {
      ...baseCapability,
      'goog:chromeOptions': {
        w3c: true,
      },
    },
    {
      ...baseCapability,
      browserName: 'firefox',
    },
    {
      ...baseCapability,
      browserName: 'safari',
      platformName: 'macos 10.13',
      'sauce:options': {
        ...baseCapability['sauce:options'],
        screenResolution: '1600x1200',
      },
    },
    {
      ...baseCapability,
      browserName: 'microsoftedge',
    },

    // {
    //   ...baseCapability,
    //   browserName: 'internet explorer',
    // },
  ] as SauceLabsCapability[],
};
