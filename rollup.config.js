// @ts-check

import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript';
import minifyHtmlLiterals from 'rollup-plugin-minify-html-literals';

const isProd = 'production' === process.env.NODE_ENV;
const terserOpts = {
  ecma: 8,
  module: true,
  safari10: true,
};

const build = {
  input: [
    'src/app-datepicker.ts',
    // 'src/test-rerender.ts',
    // 'src/calendar-benchmark.ts',
  ],
  output: [{
    // file: 'dist/app-datepicker.js',
    dir: 'dist',
    format: 'esm',
  }],

  experimentalCodeSplitting: true,
  experimentalOptimizeChunks: true,
  preferConst: true,
  treeshake: true,
  // experimentalOptimizeImports: true,
  // inlineDynamicImports: true,

  plugins: [
    resolve(),
    ...(isProd ? [tslint({
      throwError: true,
      configuration: `tslint${isProd ? '.prod' : ''}.json`,
    })] : []),
    typescript({ tsconfig: './tsconfig.json' }),
    ...(isProd ? [minifyHtmlLiterals(), terser(terserOpts), filesize({ showBrotliSize: true })] : []),
  ],
};

export default [
  build
];
