<template>
  <component :is="tag" class="mb-5"><slot></slot></component>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    level: {
      default() {
        return '2';
      },
      validator(value) {
        return ['2', '3', '4', '5', '6'].includes(value);
      }
    },
  },
  computed: {
    tag() {
      return 'h' + this.level;
    },
  },
}
</script>
