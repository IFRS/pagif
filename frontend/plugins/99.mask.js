import { defineNuxtPlugin } from '#app'
import { vMaska } from "maska"

export default defineNuxtPlugin(async ({ vueApp }) => {
  vueApp.directive('maska', vMaska)
})
