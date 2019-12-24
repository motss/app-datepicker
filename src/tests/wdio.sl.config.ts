import {
  SauceLabsCapability,
  SauceLabsOptions,
  WdioConfig,
} from './custom_typings';

import { config as baseConfig } from './wdio.config.js';

const baseSauceOptions: SauceLabsOptions = {
  build: new Date().toJSON(),
  screenResolution: '1920x1080',
  seleniumVersion: '3.141.59',
  logName: '',
};
const sauceLabsUser = process.env.SAUCE_USERNAME || '';
const sauceLabsAccessKey = process.env.SAUCE_ACCESS_KEY || '';

export const config: WdioConfig = {
  ...baseConfig,
  services: ['sauce'],
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
      browserName: 'googlechrome',
      browserVersion: 'latest',
      'goog:chromeOptions': {
        // args: [
        //   '--disable-gpu',
        //   '--headless',
        //   '--no-sandbox',
        // ],
        w3c: true,
      },
      'sauce:options': {
        ...baseSauceOptions,
        logName: 'windows-10-googlechrome-latest',
      },
      platformName: 'windows 10',
    },
    {
      browserName: 'firefox',
      browserVersion: 'latest',
      // 'moz:firefoxOptions': {
      //   args: [
      //     '--headless',
      //   ],
      // },
      'sauce:options': {
        ...baseSauceOptions,
        logName: 'windows-10-firefox-latest',
      },
      platformName: 'windows 10',
    },
    {
      browserName: 'safari',
      browserVersion: 'latest',
      platformName: 'macos 10.13',
      'sauce:options': {
        ...baseSauceOptions,
        logName: 'macos-10-13-safari-latest',
        screenResolution: '1600x1200',
      },
    },
    {
      browserName: 'microsoftedge',
      browserVersion: 'latest',
      platformName: 'windows 10',
      'sauce:options': {
        ...baseSauceOptions,
        logName: 'windows-10-microsoftedge-latest',
      },
    },
  ] as SauceLabsCapability[],
};
