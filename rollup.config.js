import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

const basePlugins = [
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    presets: [['@babel/env', { modules: false }]],
  }),
];

export default [
  {
    input: 'lib/index.js',
    output: {
      name: 'urlParser',
      file: 'dist/jsVideoUrlParser.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: basePlugins,
  },
  {
    input: 'lib/index.js',
    output: {
      name: 'urlParser',
      file: 'dist/jsVideoUrlParser.min.js',
      format: 'umd',
      sourcemap: true,
    },
    plugins: [...basePlugins, terser()],
  },
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/jsVideoUrlParser.esm.js',
      format: 'es',
      sourcemap: true,
      exports: 'default',
    },
    plugins: basePlugins,
  },
];
