<template>
  <v-tooltip location="bottom">
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        style="width: min-content;"
        v-on="on"
      >
        <v-switch
          v-model="darkMode"
          inset
          density="compact"
          hide-details
          color="primary"
          prepend-icon="mdi-theme-light-dark"
        />
      </div>
    </template>
    <span>Modo Escuro</span>
  </v-tooltip>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  computed: {
    darkMode: {
      ...mapGetters({ get: 'config/darkMode' }),
      ...mapMutations({ set: 'config/darkMode' }),
    },
  },
  watch: {
    darkMode(newValue) {
      this.$vuetify.theme.dark = newValue;
    }
  },
  mounted() {
    setTimeout(() => {
      this.$vuetify.theme.dark = this.$store.getters['config/darkMode'];
    }, 0);
  },
}
</script>
