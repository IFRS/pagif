<template>
  <v-snackbar
    ref="snackbar"
    v-model="show"
    :timeout="5000"
    :color="color"
    :multi-line="true"
  >
    <v-icon start>
      {{ icon }}
    </v-icon>
    {{ text }}
    <template #actions="{ attrs }">
      <v-btn
        color="white"
        variant="text"
        v-bind="attrs"
        @click="snackbarStore.hide()"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useSnackbarStore } from '~/store/snackbar';

const snackbarStore = useSnackbarStore();
const { show, color, icon, text } = storeToRefs(snackbarStore);
</script>
