<template>
  <v-form ref="form" @submit.prevent>
    <v-autocomplete
      label="Código do Serviço"
      v-model="codigoServico"
      :rules="rules"
      :loading="$fetchState.pending"
      :disabled="$fetchState.pending"
      :items="$store.getters['servicos']"
      item-text="nome"
      item-value="codigo"
      required
    >
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title>{{ item.nome }} ({{ item.codigo }})</v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'PagamentoCodigoServico',
  data() {
    return {
      rules: [
        v => !!v || 'Selecione um Serviço.',
      ],
    }
  },
  computed: {
    codigoServico: {
      ...mapGetters({ get: 'pagamento/codigoServico' }),
      ...mapMutations({ set: 'pagamento/codigoServico' }),
    },
  },
  async fetch() {
    await this.$store.dispatch('fetchServicos', { unidade: this.$store.getters['unidade/id'] })
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
      console.log(error);
    });
  },
}
</script>
