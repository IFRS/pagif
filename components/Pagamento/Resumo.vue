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
          Voc&ecirc; pagar&aacute; a quantia de <strong>R$ {{ $format.intToMoeda($store.getters['pagamento/valorPrincipal']) }}</strong> para <strong>{{ $store.getters['unidade/nome'] }}</strong> pelo produto/servi&ccedil;o <strong>"{{ $store.getters['pagamento/codigoServico'] }}"</strong>.
        </p>
        <p>
          O pagamento ser&aacute; em nome de <strong>{{ $store.getters['pagamento/nomeContribuinte'] }}<template v-if="$store.getters['pagamento/cnpjCpf']">&nbsp;({{ $format.cnpjCpf($store.getters['pagamento/cnpjCpf']) }})</template></strong>.
        </p>
        <br>
        <p class="text-body-2 info--text">Ao clicar em "Concluir" o pagamento ser&aacute; gerado e voc&ecirc; ter&aacute; <strong>24h</strong> para realiz&aacute;-lo.</p>
      </v-col>
      <v-col>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PagamentoResumo',
}
</script>
