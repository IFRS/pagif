<template>
  <v-container>
    <v-row v-if="intro" v-html="intro"></v-row>
    <v-row class="my-10" justify="center">
      <v-hover v-slot="{ hover }">
        <v-card
          class="mr-10"
          :color="hover ? 'accent' : ''"
          :to="{ name: 'consulta' }"
        >
          <v-responsive :aspect-ratio="16/9">
            <v-card-text class="text-center" :class="hover ? 'white--text' : ''">
              <v-icon x-large :color="hover ? 'white' : ''">mdi-archive-search-outline</v-icon>
              <v-card-title class="justify-center">Consultar Pagamento</v-card-title>
            </v-card-text>
          </v-responsive>
        </v-card>
      </v-hover>
      <v-hover v-slot="{ hover }">
        <v-card
          :color="hover ? 'accent' : ''"
          :to="{ name: 'pagamento' }"
        >
          <v-responsive :aspect-ratio="16/9">
            <v-card-text class="text-center" :class="hover ? 'white--text' : ''">
              <v-icon x-large :color="hover ? 'white' : ''">mdi-cash-plus</v-icon>
              <v-card-title class="justify-center">Realizar Pagamento</v-card-title>
            </v-card-text>
          </v-responsive>
        </v-card>
      </v-hover>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Index',
  computed: {
    intro: {
      ...mapGetters({ get: 'config/intro' }),
      ...mapMutations({ set: 'config/intro' }),
    }
  },
  beforeCreate() {
    if (this.$route.query.unidade) {
      const unidade = this.$store.getters['unidades'].find(unidade => (unidade.slug && unidade.slug === this.$route.query.unidade));
      if (unidade) {
        this.$store.commit('unidade/replace', unidade);
      }

      this.$router.replace({ 'query': null });
    }
  },
}
</script>
