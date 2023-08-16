import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { pt } from 'vuetify/locale'

export default defineNuxtPlugin(({ vueApp }) => {
  const vuetify = createVuetify({
    components: {
      ...components,
      ...labsComponents,
    },
    directives,
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
      options: {
        customProperties: true
      },
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#1351B4',
            secondary: '#636363',
            accent: '#1351B4',
            error: '#E52207',
            info: '#155BCB',
            success: '#168821',
            warning: '#B38C00',
            footer: '#0C326F',
          },
        },
        dark: {
          dark: true,
          colors: {
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
    defaults: {
      VBtn: {
        color: 'primary',
        variant: 'elevated',
        rounded: true,
      },
    },
  })

  vueApp.use(vuetify)
})
