<template>
  <v-snackbar
    ref="snackbar"
    v-model="snackbarShow"
    :timeout="5000"
    :color="snackbarStore.color"
    :multi-line="true"
  >
    <v-icon start>
      {{ snackbarStore.icon }}
    </v-icon>
    {{ snackbarStore.text }}
    <template #actions="{ attrs }">
      <v-btn
        color="white"
        variant="text"
        v-bind="attrs"
        @click="snackbarShow = false"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue';
import { useSnackbarStore } from '~/store/snackbar';

const snackbarStore = useSnackbarStore();

const snackbarShow = computed({
  get() {
    return snackbarStore.show;
  },
  set(value) {
    snackbarStore.updateShow(value);
  }
})
</script>
