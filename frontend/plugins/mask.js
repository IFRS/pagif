import { defineNuxtPlugin } from '#app';
import VueMask from 'v-mask'

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(VueMask);
})
