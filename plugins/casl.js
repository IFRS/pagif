import { createMongoAbility } from "@casl/ability";
import { defineNuxtPlugin } from 'nuxt'
import { useFetch } from "nuxt/app";
import { useAuthStore } from "~/store/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useAuthStore();
  let user = null;

  if (process.server) {
    user = await useFetch('/api/auth/me');
  }

  if (process.client) {
    user = store.user;
  }

  if (user) {
    const ability = createMongoAbility(user.abilities);
    nuxtApp.vueApp.config.globalProperties.$acl = ability;
  }
})
