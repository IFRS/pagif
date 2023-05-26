<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <div
        v-bind="props"
        class="me-3"
      >
        <v-switch
          v-model="darkMode"
          inset
          density="compact"
          hide-details
          color="primary"
          prepend-icon="mdi-theme-light-dark"
          v-bind="props"
        />
      </div>
    </template>
    <span>Modo Escuro</span>
  </v-tooltip>
</template>

<script setup>
import { useCookie } from '#app';
import { storeToRefs } from 'pinia';
import { watch, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useConfigStore } from '~/store/config';

const configStore = useConfigStore();
const { darkMode } = storeToRefs(configStore);

const theme = useTheme();

let cookie = useCookie('darkMode');

const isDarkMode = process.server ? cookie : darkMode;

theme.global.name.value = isDarkMode ? 'dark': 'light';

watch(darkMode, (newValue) => {
  theme.global.name.value = newValue ? 'dark': 'light';
  cookie = newValue;
})

onMounted(() => {
  setTimeout(() => {
    theme.global.name.value = isDarkMode ? 'dark' : 'light';
  }, 0);
});
</script>
