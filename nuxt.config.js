require('dotenv').config();

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - PAGIF',
    title: 'Sistema de Pagamentos',
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
    '~/plugins/filters.js',
    '~/plugins/mask.js',
    '~/plugins/toast.js',
    '~/plugins/dayjs.js',
    '~/plugins/validation.js',
    '~/plugins/casl.js',
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
    ['v-currency-field/nuxt-treeshaking', {
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
    ['@nuxtjs/recaptcha', {
        hideBadge: false,  // Hide badge element (v3 & v2 via size=invisible)
        language: 'pt-BR', // Recaptcha language (v2)
        mode: 'base',      // Mode: 'base', 'enterprise'
        version: 2,        // Version
        size: 'normal'     // Size: 'compact', 'normal', 'invisible' (v2)
    }],
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
    pagtesouroURL: process.env.PAGTESOURO_URL,
    recaptcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    },
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.SERVER_BASE_URL,
    },
  },

  router: {
    middleware: ['ssr-cookie'],
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'unidades-slug',
        path: '/unidades/:slug',
        redirect: (to) => {
          return { name: 'index', query: { unidade: to.params.slug } };
        },
      });
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    optionsPath: '~/vuetify.config.js',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    devtools: true,
    watch: [
      '~/db/**/*',
      '~/api/**/*',
    ],
  },
}
