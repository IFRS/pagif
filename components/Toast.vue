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
    <template #action="{ attrs }">
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

<script>
export default {
  name: 'Toast',
  computed: {
    snackbarShow: {
      get() {
        return this.$store.state.snackbar.show;
      },
      set(value) {
        this.$store.commit('snackbar/updateShow', value);
      }
    },
  },
}
</script>
