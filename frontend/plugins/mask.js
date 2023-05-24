import { defineNuxtPlugin } from '#app'
import { vMaska } from "maska"

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.directive('maska', vMaska)
})
