import { defineNuxtPlugin } from "#app";
import { useAuthStore } from "~/store/auth";
import { createMongoAbility } from "@casl/ability";

export default defineNuxtPlugin(async ({ $pinia, vueApp }) => {
  const authStore = useAuthStore($pinia);

  if (authStore.user) {
    const ability = createMongoAbility(authStore.user.abilities);
    vueApp.config.globalProperties.$acl = ability;
  }
})
