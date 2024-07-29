import withNuxt from './.nuxt/eslint.config.mjs'
import globals from 'globals'
import { FlatCompat } from '@eslint/eslintrc'
import pluginVue from 'eslint-plugin-vue'
import pluginVuetify from 'eslint-plugin-vuetify'

const compat = new FlatCompat({
  config: pluginVuetify.configs.recommended,
})

export default withNuxt(
  ...pluginVue.configs['flat/essential'],
  ...pluginVue.configs['flat/recommended'],
  ...pluginVue.configs['flat/strongly-recommended'],
  ...compat.extends('plugin:vue/base', 'plugin:vuetify/base'),
  {
    name: 'Frontend',
    rules: {
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
    },
    languageOptions: {
      ecmaVersion: 11,
      globals: {
        ...globals.browser,
      },
    },
  },
)
