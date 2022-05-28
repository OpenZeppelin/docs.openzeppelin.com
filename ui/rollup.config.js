import styles from 'rollup-plugin-styles';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import serve from './rollup/serve';
import run from './rollup/run';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js',
  output: {
    dir: 'theme/dist',
    format: 'iife',
    sourcemap: true,
    assetFileNames: '[name][extname]',
  },
  plugins: [
    replace({
      preventAssignment: true,
      include: '../**/node_modules/highlightjs-solidity/solidity.js',
      delimiters: ['', ''],
      'var module = module ? module : {};': '',
    }),

    styles({
      mode: 'extract',
      url: false,
      minimize: production,
      sourceMap: true,
    }),

    production && terser(),

    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),

    !production && run('node', 'preview/build.js', {
      watch: ['preview', 'theme/{partials,helpers}'],
      ignored: ['preview/build'],
    }),

    !production && serve('preview/build', { wait: 200 }),
  ],
  watch: {
    clearScreen: false,
  },
};
