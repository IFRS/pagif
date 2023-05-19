import { defineNuxtPlugin } from 'nuxt'
import dayjs from 'dayjs'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$dayjs = dayjs;
})
