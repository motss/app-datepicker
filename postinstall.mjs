#!/usr/bin/env zx

const {
  CI = 'false',
  INIT_CWD = '',
} = process.env;

if (CI !== 'true') {
  const {
    name: fullModuleName,
  } = JSON.parse(await fs.readFile('./package.json', { encoding: 'utf-8' }));
  const [, moduleName = fullModuleName] = fullModuleName.split('/', 2);

  if (
    ![
      fullModuleName,
      moduleName,
    ].some(n => INIT_CWD.endsWith(`node_modules/${n}`)) &&
    INIT_CWD.endsWith(moduleName)
  ) {
    /**
     * NOTE: To skip running `simple-git-hooks` in CI environment.
     * But `npm x -y -- simple-git-hooks@latest` does not work as expected so splitting it into
     * a 2-step process: install without saving as dependency then execute it.
     */
    await $`npm i --no-save simple-git-hooks`
    await $`rm -rf .git/hooks`
    await $`sh ${__dirname}/simple-git-hooks.sh`;

    await $`npm dedupe`;
  }
}
