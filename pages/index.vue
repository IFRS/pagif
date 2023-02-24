<template>
  <v-container>
    <v-row v-show="intro" class="my-5">
      <v-col cols="12" md="10" v-html="intro" class="mx-auto"/>
    </v-row>
    <v-row class="my-10" justify="center">
      <v-col cols="auto">
        <v-hover v-slot="{ hover }">
          <v-card
            :color="hover ? 'accent' : ''"
            :to="{ name: 'consulta' }"
          >
            <v-card-text class="text-center" :class="hover ? 'white--text' : ''">
              <v-icon x-large :color="hover ? 'white' : ''">mdi-archive-search-outline</v-icon>
              <v-card-title class="justify-center">Consultar Pagamento</v-card-title>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>

      <v-col cols="auto">
        <v-hover v-slot="{ hover }">
          <v-card
            :color="hover ? 'accent' : ''"
            :to="{ name: 'pagamento' }"
          >
            <v-card-text class="text-center" :class="hover ? 'white--text' : ''">
              <v-icon x-large :color="hover ? 'white' : ''">mdi-cash-plus</v-icon>
              <v-card-title class="justify-center">Realizar Pagamento</v-card-title>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
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
