const { createConfig, startServer } = require('es-dev-server');
const { performance } = require('perf_hooks');
const Launcher = require('@wdio/cli').default;

function debug(message, ...args) {
  const timestamp = new Date().toJSON()
    .replace('T', ' ')
    .replace('Z', '')

  console.debug(
    `[${timestamp}] ${message}`,
    ...args
  );
}

function to3Dp(x) {
  return Math.floor(x * 1e3) / 1e3;
}

function toHumanTime(timestamp) {
  if (timestamp < 1e3) return `${timestamp}ms`;
  if (timestamp < (1e3 * 60)) return `${to3Dp(timestamp / 1e3)}s`;
  if (timestamp < (1e3 * 60 * 60)) return `${to3Dp(timestamp / (1e3 * 60))}m`;
  if (timestamp < (1e3 * 60 * 60 * 24)) return `${to3Dp(timestamp / (1e3 * 60 * 60))}h`;

  return `${to3Dp(timestamp / (1e3 * 60 * 60 * 24))}`;
}

function readArg(argName) {
  const args = process.argv;
  const configFileIdx = process.argv.findIndex(n => n === argName);

  if (configFileIdx < 0 || configFileIdx === args.length - 1) {
    throw new Error(`${argName} is not defined`);
  }

  return args[configFileIdx + 1];
}

async function main() {
  /**
   * Not all ports are supported by Sauce Connect Proxy.
   *
   * @see https://wiki.saucelabs.com/display/DOCS/Sauce+Connect+Proxy+FAQs,
   */
  const PORT = process.env.PORT || 4000;
  const mainStartAt = performance.now();
  const config = createConfig({
    port: PORT,
    nodeResolve: true,
    logStartup: false,
    logCompileErrors: false,
    logErrorsToBrowser: true,
    // babel = false,
    // babelConfig,
    // babelExclude = [],
    // babelModernExclude = [],
    // babelModuleExclude = [],
    // basePath,
    // compress = true,
    // fileExtensions = [],
    // hostname,
    // http2 = false,
    // logStartup,
    // moduleDirs = ['node_modules'],
    // nodeResolve = false,
    // open = false,
    // port,
    // preserveSymlinks = false,
    // sslCert,
    // sslKey,
    // watch = false,
    // logErrorsToBrowser = false,
    // polyfills = _constants.polyfillsModes.AUTO,
    // responseTransformers,
    // debug = false
  });

  const { server } = await startServer(config);
  const gracefulShutdown = (code) => {
    server.close((err) => {
      const mainDuration = performance.now() - mainStartAt;

      debug(`Finished in ${toHumanTime(mainDuration)}`);

      if (err) console.error(`[ERROR] Failed to close server`, err);
      else {
        debug(`Server closed`);
      }

      process.exit(code);
    });

    // force shutdown after 15s timeout
    setTimeout(() => {
      debug(`Could not close server in time, forcefully shutting down`);
      process.exit(code);
    }, (15e3));
  };

  debug(`es-dev-server running at port ${PORT}...`);

  [
    'SIGTERM', // kill
    'SIGINT', // Ctrl or Cmd + C
  ].forEach(n => process.on(n, gracefulShutdown));

  const wdio = new Launcher(readArg('--config-file'));
  const code = await wdio.run();

  debug(`Completed. Closing server...`);

  gracefulShutdown(code);
}

main().catch((err) => {
  console.error('Fail to run tests', err);
  process.exit(1);
});
