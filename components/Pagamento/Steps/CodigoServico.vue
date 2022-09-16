<template>
  <v-form ref="form" v-on="$listeners">
    <v-autocomplete
      label="Código do Serviço"
      no-data-text="Nenhum Serviço encontrado na Unidade atual."
      v-model="servico"
      :rules="rules"
      :loading="$fetchState.pending"
      :disabled="$fetchState.pending"
      :items="$store.getters['servicos']"
      :item-text="item => `${item.nome} (${item.codigo})`"
      :item-value="item => ({ codigo: item.codigo, nome: item.nome })"
      required
    ></v-autocomplete>
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'CodigoServico',
  data() {
    return {
      rules: [
        v => !!v || 'Selecione um Serviço.',
      ],
    }
  },
  computed: {
    servico: {
      get() {
        return { codigo: this.codigoServico, nome: this.nomeServico };
      },
      set(value) {
        this.codigoServico = value.codigo;
        this.nomeServico = value.nome;
      }
    },
    codigoServico: {
      ...mapGetters({ get: 'pagamento/codigoServico' }),
      ...mapMutations({ set: 'pagamento/codigoServico' }),
    },
    nomeServico: {
      ...mapGetters({ get: 'pagamento/nomeServico' }),
      ...mapMutations({ set: 'pagamento/nomeServico' }),
    },
  },
  async fetch() {
    await this.$store.dispatch('fetchServicos', { unidade: this.$store.getters['config/unidade']?._id })
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
      console.log(error);
    });
  },
  methods: {
    clip() {
      copy('TESTE');
    },
  },
}
</script>
