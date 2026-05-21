const js = require('@eslint/js');
const babelParser = require('@babel/eslint-parser');
const globals = require('globals');
const jestPlugin = require('eslint-plugin-jest');

module.exports = [
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'lib/provider/template.js',
      'lib/provider/template.d.ts',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env'],
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      'arrow-body-style': ['error', 'as-needed', {
        requireReturnForObjectLiteral: true,
      }],
      'arrow-parens': ['error', 'as-needed'],
      'arrow-spacing': 'error',
      'camelcase': ['error', { properties: 'never' }],
      'comma-dangle': ['error', 'always-multiline'],
      'guard-for-in': 'error',
      'indent': ['error', 2],
      'keyword-spacing': 'error',
      'linebreak-style': ['error', 'unix'],
      'no-eq-null': 'error',
      'no-multi-str': 'error',
      'no-trailing-spaces': 'error',
      'no-useless-escape': 'error',
      'no-use-before-define': ['error', { functions: false }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'space-before-blocks': ['error', {
        classes: 'always',
        functions: 'always',
        keywords: 'always',
      }],
      'space-before-function-paren': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', {
        nonwords: false,
        words: true,
      }],
      'jest/expect-expect': 'off',
      'jest/valid-expect': 'off',
    },
  },
  {
    files: ['**/*.test.js', 'lib/testUrls.js'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'jest/expect-expect': 'off',
      'jest/valid-expect': 'off',
    },
  },
];
