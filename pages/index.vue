<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <h2>Escolha uma Unidade para pagamento</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn
          v-for="(unidade, i) in $store.state.unidades"
          :key="i"
          x-large
          :to="{
            path: '/unidade',
            params: {
              unidade: unidade.slug,
            },
          }"
        >
          {{ unidade.nome }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  async fetch () {
    await this.$store.dispatch('fetchUnidades')
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
      console.log(error);
    });
  },
}
</script>
