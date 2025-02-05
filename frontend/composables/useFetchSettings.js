import { useSettingsStore } from '~/store/settings'

export function useFetchSettings() {
  const settingsStore = useSettingsStore()

  const readSettings = () => $fetch('/api/settings', {
    onResponse({ response }) {
      settingsStore.$patch(response._data)
    },
  })

  const updateSettings = () => $fetch('/api/settings', {
    method: 'POST',
    body: settingsStore.$state,
    onResponse({ response }) {
      settingsStore.$patch(response._data)
    },
  })

  onUnmounted(() => {
    settingsStore.$reset()
  })

  return {
    readSettings,
    updateSettings,
  }
}
