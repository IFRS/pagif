import { vMaska } from 'maska/vue'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('maska', vMaska)
})
