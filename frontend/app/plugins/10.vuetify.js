import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { pt } from 'vuetify/locale'
import DayJsAdapter from '@date-io/dayjs'
import pt_BR from 'dayjs/locale/pt-br'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ vueApp }) => {
  const vuetify = createVuetify({
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
      },
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
        customProperties: true,
      },
      themes: {
        light: {
          dark: false,
          colors: {
            pagif: '#39b54a',
            primary: '#1351B4',
            secondary: '#636363',
            accent: '#1866E2',
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
            pagif: '#39b54a',
            primary: '#C5D4EB',
            secondary: '#8D9297',
            accent: '#9FB8DE',
            info: '#155BCB',
            success: '#168821',
            warning: '#FFCD07',
            error: '#E52207',
            footer: '#071D41',
          },
        },
      },
    },
    defaults: {
      VBtn: {
        color: 'primary',
        variant: 'elevated',
        rounded: 'pill',
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
