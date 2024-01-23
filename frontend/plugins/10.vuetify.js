import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { pt } from 'vuetify/locale'
import DayJsAdapter from '@date-io/dayjs'
import pt_BR from 'dayjs/locale/pt-br'

export default defineNuxtPlugin(({ vueApp }) => {
  const vuetify = createVuetify({
    // components: {
    //   ...components,
    //   ...labsComponents,
    // },
    directives,
    ssr: true,
    locale: {
      locale: 'pt',
      messages: {
        pt,
      },
    },
    date: {
      adapter: DayJsAdapter,
      locale: {
        pt: pt_BR,
      }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
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
            info: '#155BCB',
            success: '#168821',
            warning: '#FFCD07',
            error: '#E52207',
            footer: '#0C326F',
            surface: '#fafafa',
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: '#4A77B4',
            secondary: '#565C65',
            accent: '#155BCB',
            info: '#345D96',
            success: '#4d8055',
            warning: '#E6C74C',
            error: '#d83933',
            footer: '#071D41',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        color: 'primary',
        variant: 'elevated',
        rounded: 'xl',
      },
      VAutocomplete: {
        variant: 'underlined',
      },
      VDataTable: {
        class: 'bg-transparent',
      },
      VTextField: {
        variant: 'underlined',
      },
    },
  })

  vueApp.use(vuetify)
})
