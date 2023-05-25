import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'
// import { aliases, mdi } from 'vuetify/iconsets/mdi'
// import { pt } from 'vuetify/locale'
// import 'vuetify/styles'

export default defineNuxtConfig({
  app: {
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
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: [
    '@fontsource/roboto/latin.css',
    '@fontsource/roboto/latin-100-italic.css',
    '@fontsource/roboto/latin-100.css',
    '@fontsource/roboto/latin-300-italic.css',
    '@fontsource/roboto/latin-300.css',
    '@fontsource/roboto/latin-400-italic.css',
    '@fontsource/roboto/latin-400.css',
    '@fontsource/roboto/latin-500-italic.css',
    '@fontsource/roboto/latin-500.css',
    '@fontsource/roboto/latin-700-italic.css',
    '@fontsource/roboto/latin-700.css',
    '@fontsource/roboto/latin-900-italic.css',
    '@fontsource/roboto/latin-900.css',
    '@mdi/font/css/materialdesignicons.css',
    'vuetify/styles',
    '~/assets/transitions.scss',
    '~/assets/vuetify-required.scss',
  ],

  modules: [
    '@pinia/nuxt',
    'nuxt-proxy-request',
    // '@invictus.codes/nuxt-vuetify',
    // ['@nuxtjs/recaptcha', {
    //     hideBadge: false,  // Hide badge element (v3 & v2 via size=invisible)
    //     language: 'pt-BR', // Recaptcha language (v2)
    //     mode: 'base',      // Mode: 'base', 'enterprise'
    //     version: 2,        // Version
    //     size: 'normal'     // Size: 'compact', 'normal', 'invisible' (v2)
    // }],
    // ['cookie-universal-nuxt', { alias: 'cookies' }],
    // ['v-currency-field/nuxt-treeshaking', {
    //   locale: 'pt-BR',
    //   autoDecimalMode: true,
    //   decimalLength: 2,
    //   min: undefined,
    //   max: undefined,
    //   defaultValue: null,
    //   allowNegative: false,
    //   valueAsInteger: true,
    // }],
  ],

  proxy: {
    options: {
      target: 'http://localhost:3030',
      pathRewrite: {
        '^/api': '',
      },
      pathFilter: ['/api/**'],
    },
  },

  runtimeConfig: {
    public: {
      recaptcha: {
        siteKey: '',
      },
      pagtesouroURL: '',
      GA: '',
    },
  },

  sourcemap: {
    server: false,
    client: false,
  },

  hooks: {
    'pages:extend' (routes) {
      routes.push({
        name: 'unidades-slug',
        path: '/unidades/:slug',
        redirect: (to) => {
          return { name: 'index', query: { unidade: to.params.slug } };
        },
      });
    },
    'vite:extendConfig': (config) => {
      config.plugins.push(
        vuetify({
          autoImport: true,
          // styles: {
          //   configFile: 'assets/settings.scss',
          // },
        }),
      )
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "assets/_functions.scss";',
        },
      },
    },
  },

  typescript: {
    shim: false,
  },
})
