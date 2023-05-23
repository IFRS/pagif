<template>
  <v-tooltip location="bottom">
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        style="width: min-content;"
        v-on="on"
      >
        <v-switch
          v-model="darkMode"
          inset
          density="compact"
          hide-details
          color="primary"
          prepend-icon="mdi-theme-light-dark"
        />
      </div>
    </template>
    <span>Modo Escuro</span>
  </v-tooltip>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { watch, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { useConfigStore } from '~/store/config';

const store = useConfigStore();
const { darkMode } = storeToRefs(store);

const theme = useTheme();

watch(darkMode, (newValue) => {
  theme.global.name.value = newValue ? 'dark': 'light';
})

onMounted(() => {
  setTimeout(() => {
    theme.global.name.value = darkMode ? 'dark' : 'light';
  }, 0);
});
</script>
