<template>
  <Component
    :is="tag"
    class="titulo"
  >
    <slot />
  </Component>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import colors from 'vuetify/util/colors'

const props = defineProps({
  level: {
    default: '2',
    validator(value) {
      return ['2', '3', '4', '5', '6'].includes(value);
    }
  },
})

const tag = computed(() => ('h' + props.level))

const { current } = useTheme()

const color = computed(() => {
  return current.value.dark ? colors.grey.lighten4 : colors.grey.darken4
})


</script>

<style lang="scss" scoped>
.titulo {
  color: v-bind(color);
  margin-top: 1rem;
  margin-bottom: 2rem;
  padding-inline-start: 0.75rem;
  position: relative;

  &::before {
    $size: 4px;

    content: '';
    position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: $size;
    height: 70%;
    background-color: rgb(var(--v-theme-pagif));
    border-radius: calc($size / 2);
  }
}
</style>
