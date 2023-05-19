<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <PageTitle>Escolha uma Unidade para Pagamento</PageTitle>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col
        v-for="(unidade, i) in $store.getters['unidades']"
        :key="i"
      >
        <v-btn
          size="x-large"
          @click="escolha(unidade)"
        >
          {{ unidade.nome }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async fetch () {
    await this.$store.dispatch('fetchUnidades', true)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
      console.error(error);
    });
  },
  head: {
    title: 'Escolha uma Unidade',
  },
  methods: {
    escolha(unidade) {
      this.$store.commit('config/unidade', unidade);
      this.$router.push({ path: this.$route.query.returnPath || '/' });
    },
  },
}
</script>
