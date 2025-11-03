import { useNuxtApp } from '#app'
import { useSnackbarStore } from '~/stores/snackbar'

export default function () {
  const { $pinia } = useNuxtApp()
  return useSnackbarStore($pinia)
}
