const { ESLint } = require('eslint');
const babelParser = require('@babel/eslint-parser');
const airbnbConfig = require('eslint-config-airbnb');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');
const reactPlugin = require('eslint-plugin-react');
const importPlugin = require('eslint-plugin-import');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
      globals: {
        browser: true,
        es6: true,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        allowImportExportEverywhere: true,
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
    settings: {
      env: {
        NODE_ENV: process.env.NODE_ENV || 'development',
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    extends: ['airbnb', 'prettier', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
    rules: {
      'prettier/prettier': 'error',
      'import/no-named-as-default-member': 0,
      'import/order': [2, { groups: ['external', 'index', 'sibling', 'parent', 'internal', 'builtin'] }],
      'react/jsx-filename-extension': [
        0,
        {
          extensions: ['.js', '.jsx'],
        },
      ],
      'import/prefer-default-export': 0,
      'import/no-extraneous-dependencies': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'react/jsx-props-no-spreading': 0,
      'react/forbid-prop-types': 0,
      'react/require-default-props': 0,
      'no-nested-ternary': 0,
      'global-require': 0,
      'import/no-dynamic-require': 0,
      'no-unused-expressions': 0, // Disable this rule if you have legitimate short-circuit expressions
      'react-hooks/rules-of-hooks': 'error', // Ensure rules of hooks are enforced
      'react-hooks/exhaustive-deps': 'warn', // Ensure dependencies are correct in useEffect
    },
    ignores: ['node_modules', 'build', 'public', 'src/serviceWorker.js'],
  },
];
