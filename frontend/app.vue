<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage :key="$route.fullPath" />
  </NuxtLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTheme } from 'vuetify';
import { useConfigStore } from './store/config';

const configStore = useConfigStore();
const { darkMode } = storeToRefs(configStore);

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
