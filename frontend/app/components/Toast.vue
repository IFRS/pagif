<template>
  <v-snackbar
    v-model="showing"
    :timeout="5000"
    :color="color"
    multi-line
    :vertical="details"
  >
    <v-icon start>
      {{ icon }}
    </v-icon>
    {{ text }}
    {{ details }}
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
const snackbarStore = useSnackbarStore()
const { showing, color, icon, text, details } = storeToRefs(snackbarStore)
</script>
