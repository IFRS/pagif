import { defineNuxtConfig } from 'nuxt/config'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  app: {
    head: {
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
    '~/assets/vuetify-required.scss',
  ],

  modules: [
    '@pinia/nuxt',
    'nuxt-proxy-request',
  ],

  proxy: {
    options: {
      enableLogger: (process.env.NODE_ENV !== 'production') ? true : false,
      target: process.env.API_BASE,
      pathRewrite: {
        '^/api': '',
      },
      pathFilter: ['/api/**'],
    },
  },

  runtimeConfig: {
    public: {
      pagtesouroURL: '',
      recaptcha: {
        siteKey: '',
      },
      googleClientId: '',
      GA: '',
    },
  },

  sourcemap: {
    server: false,
    client: false,
  },

  hooks: {
    'pages:extend': (routes) => {
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
          autoImport: { labs: true },
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
          additionalData: '@import "assets/utils/utils.scss";',
        },
      },
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  typescript: {
    shim: false,
  },

  devtools: {
    enabled: false,
  },
})
