<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout :name="layout">
    <NuxtLoadingIndicator />
    <div>
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<script setup>
import { useTheme } from 'vuetify'

const route = useRoute()

const layout = computed(() => {
  return route.name?.startsWith('admin') ? 'admin' : 'default'
})

const configStore = useConfigStore()
const { dnt, darkMode, sigla } = storeToRefs(configStore)

useHead({
  titleTemplate: (titleChunk) => {
    return `${titleChunk || route.meta.title} - Sistema de Pagamentos do ${sigla.value}`
  },
})

const theme = useTheme()

const cookie = useCookie('darkMode')

const isDarkMode = import.meta.server ? cookie.value : darkMode.value

theme.global.name.value = isDarkMode ? 'dark' : 'light'

const { disableAnalytics, enableAnalytics } = useGtag()

watch(dnt, (newDNT) => {
  if (newDNT) {
    disableAnalytics()
  } else {
    enableAnalytics()
  }
}, { immediate: true })
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
