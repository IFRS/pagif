import { useNuxtApp } from '#app'
import { useSnackbarStore } from '~/app/stores/snackbar'

export default function () {
  const { $pinia } = useNuxtApp()
  return useSnackbarStore($pinia)
}
