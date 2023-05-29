import { useNuxtApp } from "#app";
import { useSnackbarStore } from "~/store/snackbar";

export default function() {
  const { $pinia } = useNuxtApp();
  return useSnackbarStore($pinia);
}
