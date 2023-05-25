import { defineNuxtPlugin, useRequestHeaders } from "#app"
import { useConfigStore } from "~/store/config"

export default defineNuxtPlugin(async ({ $pinia }) => {
  const headers = useRequestHeaders();
  const store = useConfigStore($pinia);
  if (headers.dnt == '1') store.dnt = true;
})
