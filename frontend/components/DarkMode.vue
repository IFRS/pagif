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
    <span>{{ darkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro' }}</span>
  </v-tooltip>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useTheme } from 'vuetify';
import { useConfigStore } from '~/store/config';

const configStore = useConfigStore();
const { darkMode } = storeToRefs(configStore);

const theme = useTheme();

watch(darkMode, (newValue) => {
  theme.global.name.value = newValue ? 'dark': 'light';
})
</script>
