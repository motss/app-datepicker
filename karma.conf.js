// Karma configuration
// Generated on Tue Mar 26 2019 23:00:26 GMT+0800 (Singapore Standard Time)

const customLaunchers = {
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'windows 7',
    version: '11',
  },
  sl_edge_17: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'windows 10',
    version: '17',
  },
  sl_edge_13: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'windows 10',
    version: '13',
  },
  sl_safari_9: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'os x 10.11',
    version: '9',
  },
  sl_safari_10_1: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macos 10.12',
    version: '10.1',
  },
  sl_chrome_41: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Linux',
    version: '41',
  },
  sl_chrome_70: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'windows 10',
    version: '70',
  },
  sl_firefox_62: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'windows 10',
    version: '62',
  },
  sl_firefox_63: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'windows 10',
    version: '63',
  },
};

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'dist/test/**/*.spec.js',
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // reporters: ['progress', 'saucelabs'],
    reporters: ['dots', 'progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'ChromeHeadless', 'ChromeCanaryHeadless',
      'Firefox', 'FirefoxNightly',
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    transports: ['websocket', 'polling'],

    // sauceLabs: {
    //   username: process.env.SAUCE_USERNAME,
    //   accessKey: process.env.SAUCE_ACCESS_KEY,
    //   testName: 'app-datepicker Unit Tests',
    //   startConnect: true,
    // },
    // customLaunchers,
    // browsers: Object.keys(customLaunchers),
  });
};
