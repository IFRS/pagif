import axios from '@nuxtjs/axios'
import { defineNuxtRouteMiddleware } from 'nuxt'

export default defineNuxtRouteMiddleware((to) => {
  if (isServer) {
    axios.defaults.headers.common.cookie = to.headers.cookie;
  }
})
