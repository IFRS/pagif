<template>
  <v-form
    ref="form"
    v-bind="$attrs"
  >
    <v-text-field
      prepend-icon="mdi-office-building-marker"
      label="Unidade"
      disabled
      :model-value="$store.getters['config/unidade']?.nome"
    />

    <v-autocomplete
      v-model="servico"
      prepend-icon="mdi-basket"
      label="Serviço"
      no-data-text="Nenhum Serviço encontrado na Unidade atual."
      :rules="validation"
      :loading="$fetchState.pending"
      :disabled="$fetchState.pending"
      :items="$store.getters['servicos']"
      :item-title="item => `${item.nome} (${item.codigo})`"
      :item-value="item => ({ codigo: item.codigo, nome: item.nome })"
      required
      class="required"
    />
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'CodigoServico',
  data() {
    return {
      validation: [
        v => !!v || 'Selecione um Serviço.',
        v => (v === Object(v) && !!v.codigo && !!v.nome) || 'Selecione um Serviço.',
      ],
    }
  },
  computed: {
    servico: {
      get() {
        return { codigo: this.codigoServico, nome: this.nomeServico };
      },
      set(value) {
        this.codigoServico = value?.codigo;
        this.nomeServico = value?.nome;
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
    await this.$store.dispatch('fetchServicos', { isPublic: true, unidade: this.$store.getters['config/unidade']?._id })
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
      console.error(error);
    });
  },
}
</script>
