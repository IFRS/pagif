<template>
  <v-snackbar
    v-model="showing"
    :timeout="5000"
    :color="color"
    multi-line
  >
    <v-icon start>
      {{ icon }}
    </v-icon>
    {{ text }}
    <template #actions>
      <v-btn
        color="white"
        variant="text"
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
const { showing, color, icon, text } = storeToRefs(snackbarStore);
</script>
