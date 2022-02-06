#!/usr/bin/env zx

const {
  CI = 'false',
  INIT_CWD = '',
} = process.env;

if (CI !== 'true') {
  const {
    name: moduleName,
  } = JSON.parse(await fs.readFile('./package.json', { encoding: 'utf-8' }));

  if (
    !INIT_CWD.endsWith(`node_modules/${moduleName}`) &&
    INIT_CWD.endsWith(moduleName)
  ) {
    /**
     * NOTE: To skip running `simple-git-hooks` in CI environment.
     * But `npm x -y -- simple-git-hooks@latest` does not work as expected so splitting it into
     * a 2-step process: install without saving as dependency then execute it.
     */
    await $`npm i --no-save simple-git-hooks`
    await $`simple-git-hooks`;

    await $`npm dedupe`;
  }
}
