import { defineNuxtPlugin } from '#app'
import Maska from 'maska'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(Maska);
})
