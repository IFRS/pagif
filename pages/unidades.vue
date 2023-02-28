<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <h2>Escolha uma Unidade para Pagamento</h2>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col
        v-for="(unidade, i) in $store.getters['unidades']"
        :key="i"
      >
        <v-btn
          x-large
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
  name: 'Unidades',
  head: {
    title: 'Escolha uma Unidade',
  },
  async fetch () {
    await this.$store.dispatch('fetchUnidades', true)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
      console.error(error);
    });
  },
  methods: {
    escolha(unidade) {
      this.$store.commit('config/unidade', unidade);
      this.$router.push({ name: 'index' });
    },
  },
}
</script>
