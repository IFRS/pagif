<template>
  <v-card v-bind="$attrs">
    <template v-if="!loading">
      <v-card-title class="text-h5">
        Pagamento {{ idPagamento }}
      </v-card-title>
      <v-card-subtitle>
        {{ nomeServico }} ({{ codigoServico }})
      </v-card-subtitle>
      <v-list lines="two">
        <v-container fluid>
          <v-row dense>
            <v-col md="6">
              <v-list-item>
                <v-list-item-title>Nome do Contribuinte</v-list-item-title>
                <v-list-item-subtitle>{{ nomeContribuinte }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>CPF / CNPJ</v-list-item-title>
                <v-list-item-subtitle>{{ useFilters().cnpj_cpf(cnpjCpf) || '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Refer&ecirc;ncia</v-list-item-title>
                <v-list-item-subtitle>{{ referencia || '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col md="6">
              <v-list-item>
                <v-list-item-title>Compet&ecirc;ncia</v-list-item-title>
                <v-list-item-subtitle>{{ dayjs(competencia).isValid() ? dayjs(competencia).format('MM/YYYY') : '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Vencimento</v-list-item-title>
                <v-list-item-subtitle>{{ dayjs(vencimento).isValid() ? dayjs(vencimento).format('DD/MM/YYYY') : '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Data de Cria&ccedil;&atilde;o</v-list-item-title>
                <v-list-item-subtitle>{{ dayjs(dataCriacao).isValid() ? dayjs(dataCriacao).format('DD/MM/YYYY [às] HH:mm:ss') : '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>

          <v-divider />

          <v-list-group value="Valor Total">
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-title>Valor Total</v-list-item-title>
                <v-list-item-subtitle>{{ useFilters().int_to_real(valor, true) || '-' }}</v-list-item-subtitle>
              </v-list-item>
            </template>
            <v-row dense>
              <v-col md="6">
                <v-list-item>
                  <v-list-item-title>Valor Principal</v-list-item-title>
                  <v-list-item-subtitle>{{ useFilters().int_to_real(valorPrincipal, true) }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Descontos</v-list-item-title>
                  <v-list-item-subtitle>{{ useFilters().int_to_real(valorDescontos, true) || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Outras Dedu&ccedil;&otilde;es</v-list-item-title>
                  <v-list-item-subtitle>{{ useFilters().int_to_real(valorOutrasDeducoes, true) || '-' }}</v-list-item-subtitle>
                </v-list-item>
              </v-col>
              <v-col md="6">
                <v-list-item>
                  <v-list-item-title>Multa</v-list-item-title>
                  <v-list-item-subtitle>{{ useFilters().int_to_real(valorMulta, true) || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Juros</v-list-item-title>
                  <v-list-item-subtitle>{{ useFilters().int_to_real(valorJuros, true) || '-' }}</v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Outros Acr&eacute;scimos</v-list-item-title>
                  <v-list-item-subtitle>{{ useFilters().int_to_real(valorOutrosAcrescimos, true) || '-' }}</v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>
          </v-list-group>

          <v-divider />

          <v-row dense>
            <v-col md="6">
              <v-list-item
                v-if="privado"
              >
                <v-list-item-title>Tipo de Pagamento Escolhido</v-list-item-title>
                <v-list-item-subtitle>{{ tipoPagamentoEscolhido || '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item
                v-if="privado"
              >
                <v-list-item-title>Transa&ccedil;&atilde;o</v-list-item-title>
                <v-list-item-subtitle>{{ transacaoPSP || '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col md="6">
              <v-list-item
                v-if="privado"
              >
                <v-list-item-title>Prestador de Servi&ccedil;o de Pagamento</v-list-item-title>
                <v-list-item-subtitle>{{ nomePSP || '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Situa&ccedil;&atilde;o</v-list-item-title>
                <v-list-item-subtitle>
                  <PagamentoSituacao :situacao="situacao?.codigo || ''" />
                  &thinsp;
                  <small v-if="situacao?.data">({{ 'atualizado em ' + dayjs(situacao.data).format('DD/MM/YYYY [às] HH:mm:ss') }})</small>
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>

          <v-row
            v-if="situacao.codigo == 'CRIADO'"
            dense
          >
            <v-col>
              <v-list-item>
                <v-list-item-title>
                  Endere&ccedil;o para Pagamento:
                  <NuxtLink
                    v-slot="{ href, route, navigate }"
                    :to="{ name: 'pagamento-id', params: { id: idPagamento } }"
                  >
                    <a
                      :href="href"
                      @click="navigate"
                    >{{ domain + route.fullPath }}</a>
                  </NuxtLink>
                </v-list-item-title>
              </v-list-item>
            </v-col>
          </v-row>
        </v-container>
      </v-list>

      <template v-if="!!$slots.default()">
        <v-divider />

        <v-card-actions>
          <slot />
        </v-card-actions>
      </template>
    </template>
    <!-- eslint-disable-next-line vuetify/no-deprecated-components -->
    <v-skeleton-loader
      v-else
      type="card-heading, list-item-two-line@3, list-item, list-item-two-line, actions"
    />
  </v-card>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  privado: {
    type: Boolean,
    default: false,
  },
})

const dayjs = utilDayJS()

const pagamentoStore = usePagamentoStore()

const {
  idPagamento,
  nomeServico,
  codigoServico,
  nomeContribuinte,
  cnpjCpf,
  referencia,
  competencia,
  vencimento,
  dataCriacao,
  valor,
  valorPrincipal,
  valorDescontos,
  valorOutrasDeducoes,
  valorMulta,
  valorJuros,
  valorOutrosAcrescimos,
  tipoPagamentoEscolhido,
  transacaoPSP,
  nomePSP,
  situacao,
} = storeToRefs(pagamentoStore)

const domain = computed(() => {
  if (import.meta.client) return window.location.host
  return process.env.BROWSER_BASE_URL
})
</script>
