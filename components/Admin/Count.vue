<template>
  <v-card class="d-flex flex-row flex-nowrap">
    <v-sheet
      class="bg-info pa-4 d-flex justify-center align-center"
      width="40%"
    >
      <v-icon
        size="x-large"
        color="white"
      >
        {{ icon }}
      </v-icon>
    </v-sheet>
    <v-card-text class="text-center">
      <span class="text-h3">{{ num }}</span>
      <br>
      <div class="text-subtitle-1">
        <slot />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AdminCount',
  props: {
    icon: {
      type: String,
      default: '',
    },
    num: {
      type: Number,
      default: 0,
    },
  },
}
</script>
