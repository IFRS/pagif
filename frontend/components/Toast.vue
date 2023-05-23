<template>
  <v-snackbar
    ref="snackbar"
    v-model="snackbarShow"
    :timeout="5000"
    :color="$store.state.snackbar.color"
    :multi-line="true"
  >
    <v-icon start>
      {{ $store.state.snackbar.icon }}
    </v-icon>
    {{ $store.state.snackbar.text }}
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

const store = useSnackbarStore();

const snackbarShow = computed({
  get() {
    return store.show;
  },
  set(value) {
    store.updateShow(value);
  }
})
</script>
