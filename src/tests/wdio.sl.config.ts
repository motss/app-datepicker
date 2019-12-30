import {
  SauceLabsCapability,
  SauceLabsOptions,
  WdioConfig,
} from './custom_typings';

import { config as baseConfig } from './wdio.config.js';

const baseSauceOptions: SauceLabsOptions = {
  build: new Date().toJSON(),
  name: '',
  screenResolution: '1920x1080',
  seleniumVersion: '3.141.59',
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
      browserName: 'googlechrome',
      browserVersion: 'latest',
      'goog:chromeOptions': {
        w3c: true,
      },
      'sauce:options': {
        ...baseSauceOptions,
        name: 'windows-10-googlechrome-latest',
      },
      platformName: 'windows 10',
      specs: ['./dist/tests/tests_googlechrome.js'],
    },
    {
      browserName: 'firefox',
      browserVersion: 'latest',
      'sauce:options': {
        ...baseSauceOptions,
        name: 'windows-10-firefox-latest',
      },
      platformName: 'windows 10',
      specs: ['./dist/tests/tests_firefox.js'],
    },
    {
      browserName: 'safari',
      browserVersion: 'latest',
      platformName: 'macos 10.13',
      'sauce:options': {
        ...baseSauceOptions,
        name: 'macos-10-13-safari-latest',
        screenResolution: '1600x1200',
      },
      specs: ['./dist/tests/tests_safari.js'],
    },
    {
      browserName: 'microsoftedge',
      browserVersion: 'latest',
      platformName: 'windows 10',
      'sauce:options': {
        ...baseSauceOptions,
        name: 'windows-10-microsoftedge-latest',
      },
      specs: ['./dist/tests/tests_microsoftedge.js'],
    },

    // {
    //   browserName: 'internet explorer',
    //   browserVersion: 'latest',
    //   platformName: 'windows 10',
    //   'sauce:options': {
    //     ...baseSauceOptions,
    //     name: 'windows-10-internet-explorer-latest',
    //   },
    // },
  ] as SauceLabsCapability[],
};
