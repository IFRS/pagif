<template>
  <v-container>
    <v-autocomplete
      label="Serviço"
      v-model="codigoServico"
      :rules="validation"
      :loading="$fetchState.pending"
      :disabled="$fetchState.pending"
      :items="$store.state.admin.servicos"
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
  </v-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'PagamentoCodigoServico',
  data() {
    return {
      validation: [
        v => !!v || 'Selecione um Serviço.',
      ],
    }
  },
  computed: {
    codigoServico: {
      ...mapGetters({ get: 'admin/pagamento/codigoServico' }),
      ...mapMutations({ set: 'admin/pagamento/codigoServico' }),
    },
  },
  async fetch() {
    await this.$store.dispatch('admin/fetchServicos')
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
      console.log(error);
    });
  },
}
</script>
