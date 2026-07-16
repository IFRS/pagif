<template>
  <v-card class="d-flex flex-row flex-nowrap">
    <v-sheet
      class="bg-grey-darken-2 pa-4 d-flex justify-center align-center"
      width="30%"
    >
      <v-icon
        size="x-large"
        color="white"
      >
        {{ icon }}
      </v-icon>
    </v-sheet>
    <v-card-text class="text-center">
      <span class="text-display-large">{{ num }}</span>
      <br>
      <div class="text-body-large">
        <slot />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '',
  },
  num: {
    type: Number,
    default: 0,
  },
})
</script>
