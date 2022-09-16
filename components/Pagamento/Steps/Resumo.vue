<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Confira o Resumo do Pagamento</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p>
          Voc&ecirc; pagar&aacute; a quantia de <strong>R$ {{ $format.intToMoeda(valorPrincipal) }}</strong> para <strong>{{ unidade?.nome }}</strong> pelo produto/servi&ccedil;o <strong>{{ nomeServico }} ({{ codigoServico }})</strong>.
        </p>
        <p>
          O pagamento ser&aacute; em nome de <strong>{{ nomeContribuinte }}<template v-if="cnpjCpf">&nbsp;({{ $format.cnpjCpf(cnpjCpf) }})</template></strong>.
        </p>
        <br>
        <v-alert
          text
          type="info"
        >
          Ao clicar em "Concluir" o pagamento ser&aacute; gerado e voc&ecirc; ter&aacute; <strong>24h</strong> para realiz&aacute;-lo.
        </v-alert>
      </v-col>
      <v-col>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Resumo',
  computed: {
    unidade: {
      ...mapGetters({ get: 'config/unidade' }),
    },
    valorPrincipal: {
      ...mapGetters({ get: 'pagamento/valorPrincipal' }),
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
  },
}
</script>
