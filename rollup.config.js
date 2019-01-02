// @ts-check

import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript';
import minifyHtmlLiterals from 'rollup-plugin-minify-html-literals';

const isProd = !process.env.ROLLUP_WATCH;
const terserOpts = {
  ecma: 8,
  module: true,
  safari10: true,
};

console.info(`Running Rollup in ${isProd ? 'PROD' : 'DEV'} mode...`);

const build = {
  // external: ['lit-html', '@polymer/lit-element'],
  input: [
    'src/app-datepicker.ts',
    'src/app-datepicker-dialog.ts',
    // 'src/test-rerender.ts',
    // 'src/calendar-benchmark.ts',
  ],
  output: [{
    // file: 'dist/app-datepicker.js',
    dir: 'dist',
    format: 'esm',
    preferConst: true,
    esModule: true,
  }],

  experimentalOptimizeChunks: true,
  treeshake: true,
  // preserveModules: true,
  // inlineDynamicImports: true,

  plugins: [
    resolve(),
    isProd && tslint({
      throwError: true,
      configuration: `tslint${isProd ? '.prod' : ''}.json`,
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    isProd && minifyHtmlLiterals(),
    isProd && terser(terserOpts),
    isProd && filesize({ showBrotliSize: true }),
  ],
};

export default [
  build
];
