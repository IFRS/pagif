import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import pluginVuetify from 'eslint-plugin-vuetify'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  ...pluginVue.configs['flat/recommended'],
  ...pluginVuetify.configs['flat/recommended'],
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
