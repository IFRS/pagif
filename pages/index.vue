<template>
  <v-container>
    <v-row class="my-5" align="center">
      <v-col>
        <div v-if="intro" class="intro">
          <v-img class="intro__marca" :src="($vuetify.theme.dark) ? '/img/logo-white.png' : '/img/logo.png'" contain/>
          <div class="intro__text" v-html="intro"/>
        </div>
      </v-col>
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
        this.$store.commit('config/unidade', unidade);
        this.$toast.success(`Unidade definida para "${unidade.nome}".`);
      }

      this.$router.replace({ 'query': null });
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.intro {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    flex-direction: column;
  }

  &__marca {
    flex: 0 1 160px;
  }

  &__text {
    flex: 0 1 80ch;

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      flex-basis: auto;
    }
  }
}
</style>
