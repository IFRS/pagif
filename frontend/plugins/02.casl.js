import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/store/auth";
import { createMongoAbility } from "@casl/ability";

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useAuthStore(nuxtApp.$pinia);
  let user = null;

  if (process.server) {
    user = await $fetch('/api/auth/me');
  }

  if (process.client) {
    user = store.user;
  }

  if (user) {
    const ability = createMongoAbility(user.abilities);
    nuxtApp.vueApp.config.globalProperties.$acl = ability;
  }
})
