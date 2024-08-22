import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svgr from '@svgr/rollup';

export default {
  input: 'scripts/index.js',
  output: {
    dir: 'theme/assets',
    // entryFileNames: '[name].js', // Dynamic script names base on input file name
    entryFileNames: 'comission.js',
    // format: 'iife', TODO: Determine if/when this is needed.
    sourcemap: false,
  },
  treeshake: true, // Enable tree shaking for dead code elimination
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    nodeResolve(),
    terser(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
    }),
    svgr(),
    commonjs(),
  ],
};
