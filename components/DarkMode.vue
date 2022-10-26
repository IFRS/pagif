<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" style="width: min-content;">
        <v-switch
          v-model="darkMode"
          inset
          dense
          hide-details
          color="primary"
          prepend-icon="mdi-theme-light-dark"
        ></v-switch>
      </div>
    </template>
    <span>Modo Escuro</span>
  </v-tooltip>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DarkMode',
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
