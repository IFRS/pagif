<template>
  <component
    :is="tag"
    class="mb-5"
  >
    <slot />
  </component>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  level: {
    default: '2',
    validator(value) {
      return ['2', '3', '4', '5', '6'].includes(value);
    }
  },
})

const tag = computed(() => ('h' + props.level))
</script>
