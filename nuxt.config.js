require('dotenv').config();

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - IFPAG',
    title: 'IFPAG',
    htmlAttrs: {
      lang: 'pt-BR',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Sistema de Pagamentos integrado ao PagTesouro.' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/transitions.scss',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/toast.js',
    '~/plugins/dayjs.js',
    '~/plugins/format.js',
    '~/plugins/validation.js',
    '~/plugins/populate-store.client.js',
    '~/plugins/check-unidade.client.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    ['v-currency-field/nuxt', {
      locale: 'pt-BR',
      autoDecimalMode: true,
      decimalLength: 2,
      min: undefined,
      max: undefined,
      defaultValue: null,
      allowNegative: false,
      valueAsInteger: true,
    }],
    ['cookie-universal-nuxt', { alias: 'cookies' }],
  ],

  serverMiddleware: [
    '~/api/index.js',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: '/',
  },

  publicRuntimeConfig: {
    axios: {
      baseURL: process.env.BROWSER_BASE_URL,
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.SERVER_BASE_URL,
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    optionsPath: '~/vuetify.config.js',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    watch: [
      '~/api/',
    ],
  },
}
