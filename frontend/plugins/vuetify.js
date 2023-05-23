import { defineNuxtPlugin } from '#app'
import { createVuetify, aliases, mdi } from 'vuetify'
import { pt } from 'vuetify/locale'
// import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
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
      defaultTheme: 'light',
      dark: false,
      options: {
        customProperties: true
      },
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
  })

  nuxtApp.vueApp.use(vuetify)
})
