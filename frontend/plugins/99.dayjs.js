import { defineNuxtPlugin } from '#app'
import dayjs from 'dayjs'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.config.globalProperties.$dayjs = dayjs;
})
