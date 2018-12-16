// @ts-check

import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript';

const isProd = 'production' === process.env.NODE_ENV;
const build = {
  input: [
    'src/app-datepicker.ts',
    'src/test-rerender.ts',
  ],
  output: [{
    // file: 'dist/app-datepicker.js',
    dir: 'dist',
    format: 'esm',
  }],

  experimentalCodeSplitting: true,

  plugins: [
    resolve(),
    ...(isProd ? [tslint({
      throwError: true,
      configuration: `tslint${isProd ? '.prod' : ''}.json`,
    })] : []),
    typescript({ tsconfig: './tsconfig.json' }),
    ...(isProd ? [terser(), filesize({ showBrotliSize: true })] : []),
  ],
};

export default [
  build
];
