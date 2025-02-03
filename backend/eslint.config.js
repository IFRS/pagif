const globals = require('globals');
const nodePlugin = require('eslint-plugin-n');
const js = require('@eslint/js');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
  stylistic.configs.customize({
    flat: true,
    semi: true,
    jsx: false,
    braceStyle: '1tbs',
  }),
  js.configs.recommended,
  nodePlugin.configs['flat/recommended-script'],
  {
    name: 'Backend',
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.commonjs,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
];
