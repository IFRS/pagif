<template>
  <v-container>
    <v-card :loading="$fetchState.pending">
      <v-card-title primary-title>
        Pagamento {{ $store.getters['pagamento/idPagamento'] }}
      </v-card-title>
      <v-card-text>
        <p>Pagamento no valor de <strong>R$ {{ $format.intToMoeda(valorPrincipal) }}</strong> para <strong>{{ nomeUnidade }}</strong> pelo produto/servi&ccedil;o <strong>{{ nomeServico }} ({{ codigoServico }})</strong>.</p>
        <p>Em nome de <strong>{{ nomeContribuinte }}<template v-if="cnpjCpf">&nbsp;({{ $format.cnpjCpf(cnpjCpf) }})</template></strong>.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="secondary"
          plain
          :to="{ name: 'pagamento' }"
        >Voltar</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="situacao?.codigo === 'CRIADO'"
          color="primary"
          text
          :to="{ name: 'pagar-id', params: { id: idPagamento } }"
        >Pagar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PagamentoCriado',
  async fetch() {
    await this.$store.dispatch('pagamento/show', this.$route.params.id)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao buscar o Pagamento. ' + error.message);
      console.error(error);
    })
  },
  computed: {
    idPagamento: {
      ...mapGetters({ get: 'pagamento/idPagamento' }),
    },
    valorPrincipal: {
      ...mapGetters({ get: 'pagamento/valorPrincipal' }),
    },
    nomeUnidade: {
      ...mapGetters({ get: 'pagamento/nomeUnidade' }),
    },
    nomeServico: {
      ...mapGetters({ get: 'pagamento/nomeServico' }),
    },
    codigoServico: {
      ...mapGetters({ get: 'pagamento/codigoServico' }),
    },
    nomeContribuinte: {
      ...mapGetters({ get: 'pagamento/nomeContribuinte' }),
    },
    cnpjCpf: {
      ...mapGetters({ get: 'pagamento/cnpjCpf' }),
    },
    situacao: {
      ...mapGetters({ get: 'pagamento/situacao' }),
    }
  },
  destroyed () {
    this.$store.commit('pagamento/clear');
  },
}
</script>
