import { defineNuxtConfig } from 'nuxt/config';
import { fork } from 'child_process';
import viteVuetify from 'vite-plugin-vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { pt } from 'vuetify/locale'
// import '@mdi/font/css/materialdesignicons.css'
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
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
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
    '~/assets/transitions.scss',
    '~/assets/vuetify-required.scss',
  ],

  styleResources: {
    scss: [
      '~/assets/_functions.scss',
    ]
  },

  modules: [
    '@nuxt/devtools',
    '@invictus.codes/nuxt-vuetify',
    // '@nuxtjs/style-resources',
    // '@nuxtjs/axios',
    // ['@nuxtjs/recaptcha', {
    //     hideBadge: false,  // Hide badge element (v3 & v2 via size=invisible)
    //     language: 'pt-BR', // Recaptcha language (v2)
    //     mode: 'base',      // Mode: 'base', 'enterprise'
    //     version: 2,        // Version
    //     size: 'normal'     // Size: 'compact', 'normal', 'invisible' (v2)
    // }],
    '@pinia/nuxt',
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
    async (options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(
        viteVuetify()
      ))
    },
  ],

  // serverMiddleware: [
  //   '~/api/index.js',
  // ],
  serverMiddleware: [
    { path: "/api", handler: "~/api/index.js" },
  ],

  axios: {
    baseURL: '/',
  },

  runtimeConfig: {
    axios: {
      baseURL: 'http://localhost:3000/',
    },
    public: {
      axios: {
        baseURL: '/',
      },
      recaptcha: {
        siteKey: '',
      },
      pagtesouroURL: '',
      GA: '',
    },
  },

  // vuetify: {
  //   treeShake: true,
  //   defaultAssets: false,
  //   customVariables: ['~/assets/variables.scss'],
  //   optionsPath: '~/vuetify.config.js',
  // },
  vuetify: {
    vuetifyOptions: {
      ssr: true,
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
      locale: {
        locale: 'pt',
        messages: {
          pt,
        },
      },
      theme: {
        options: {
          customProperties: true
        },
        dark: false,
        themes: {
          light: {
            primary: '#1351B4',
            secondary: '#636363',
            accent: '#1351B4',
            error: '#E52207',
            info: '#155BCB',
            success: '#168821',
            warning: '#B38C00',
            footer: '#0C326F',
          },
          dark: {
            primary: '#5992ED',
            secondary: '#565C65',
            accent: '#1351B4',
            error: '#FD8BA0',
            info: '#345D96',
            success: '#4d8055',
            warning: '#E6C74C',
            footer: '#071D41',
          },
        },
      },
    },
    moduleOptions: {
      treeshaking: true,
      useIconCDN: false,
      autoImport: true,
    },
  },

  build: {
    devtools: true,
    watch: [
      '~/db/**/*',
      '~/api/**/*',
    ],
    transpile: ['vuetify/lib', "tiptap-vuetify"],
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
    listen: () => {
      let fila = fork('./queue/process.js');

      fila.on('close', (code) => {
        console.log(`Fila terminada com o código: ${code}`);
      });
    },
  },
})
