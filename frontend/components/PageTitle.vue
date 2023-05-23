<template>
  <Component
    :is="tag"
    class="mb-5"
  >
    <slot />
  </Component>
</template>

<script setup>
import { computed } from 'vue';

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
