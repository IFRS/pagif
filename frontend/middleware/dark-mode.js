import { defineNuxtRouteMiddleware, useNuxtApp } from "#app";
import { useConfigStore } from "~/store/config";

export default defineNuxtRouteMiddleware(() => {
  useNuxtApp().$vuetify.theme.dark = process.server ? useNuxtApp().$cookies.get('darkMode') : useConfigStore().darkMode;
})
