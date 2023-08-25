<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage :key="$route.fullPath" />
  </NuxtLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useConfigStore } from './store/config';
import { useTheme } from 'vuetify';

const route = useRoute()

const configStore = useConfigStore();
const { darkMode, sigla } = storeToRefs(configStore);

useHead({
  titleTemplate: (titleChunk) => {
    return `${titleChunk || route.meta.title} - Sistema de Pagamentos do ${sigla.value}`
  },
})

const theme = useTheme();

const cookie = useCookie('darkMode');

const isDarkMode = process.server ? cookie.value : darkMode.value;

theme.global.name.value = isDarkMode ? 'dark': 'light';
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
