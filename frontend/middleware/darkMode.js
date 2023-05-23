import { defineNuxtRouteMiddleware, useNuxtApp } from "#app";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useConfigStore } from "~/store/config";

export default defineNuxtRouteMiddleware(() => {
  const theme = useTheme()

  const darkMode = process.server ? useNuxtApp().$cookies.get('darkMode') : useConfigStore().darkMode;

  theme.global.name.value = darkMode ? 'dark': 'light';
})
