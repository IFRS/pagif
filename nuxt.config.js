require('dotenv').config();
const { logger } = require('./logger');

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Sistema de Pagamentos',
    title: 'Início',
    htmlAttrs: {
      lang: 'pt-BR',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Sistema de Pagamentos integrado ao PagTesouro.' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-TileColor', content: '#2b5797' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '194x194', href: '/favicon-194x194.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#1351B4' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/transitions.scss',
    '~/assets/vuetify-required.scss',
  ],

  styleResources: {
    scss: [
      '~/assets/_functions.scss',
    ]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/filters.js',
    '~/plugins/mask.js',
    '~/plugins/toast.js',
    '~/plugins/dayjs.js',
    '~/plugins/validation.js',
    '~/plugins/unauthorized.js',
    '~/plugins/casl.js',
    '~/plugins/populate-store.client.js',
    '~/plugins/check-unidade.client.js',
    '~/plugins/gtag.client.js',
    '~/plugins/tiptap-vuetify.client.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/style-resources',
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
    recaptcha: {
      siteKey: process.env.RECAPTCHA_SITE_KEY,
    },
    pagtesouroURL: process.env.PAGTESOURO_URL,
    GA: process.env.GA_ID,
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
    transpile: ['vuetify/lib', "tiptap-vuetify"],
  },

  hooks: {
    render: {
      errorMiddleware(app) {
        app.use((error, _req, _res, next) => {
          if (error) {
            logger.error("[Nuxt Render Error] %o", error);
          }
          next(error);
        });
      },
    },
  },
}
