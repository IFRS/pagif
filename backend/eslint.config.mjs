import globals from 'globals';
import nodePlugin from 'eslint-plugin-n';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
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
      sourceType: 'module',
      ecmaVersion: 2021,
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
];
