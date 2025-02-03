import { defineNuxtPlugin } from '#app'
import { vMaska } from 'maska/vue'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.directive('maska', vMaska)
})
