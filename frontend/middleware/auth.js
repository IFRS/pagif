import { defineNuxtRouteMiddleware, useFetch, navigateTo } from "#app";
import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware(async () => {
  let usuario = null;

  if (process.server) {
    usuario = await useFetch('/api/auth/me');
  }

  if (process.client) {
    usuario = useAuthStore().user;
  }

  if (!usuario) {
    return navigateTo('/');
  }
})
