<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <h2>Escolha uma Unidade para pagamento</h2>
      </v-col>
    </v-row>
    <v-row>
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
    title: 'Página Inicial',
  },
  async fetch () {
    await this.$store.dispatch('fetchUnidades')
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
      console.log(error);
    });
  },
  methods: {
    escolha(unidade) {
      this.$store.commit('unidade/replace', unidade);
      this.$router.push({ name: 'index' });
    },
  },
}
</script>
