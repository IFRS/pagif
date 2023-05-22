<template>
  <v-card v-bind="$attrs">
    <template v-if="!$attrs.loading">
      <v-card-title class="text-h5">
        Pagamento {{ $store.getters['pagamento/idPagamento'] }}
      </v-card-title>
      <v-card-subtitle>
        {{ $store.getters['pagamento/nomeServico'] }} ({{ $store.getters['pagamento/codigoServico'] }})
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col md="6">
            <v-list-item lines="two">
              <v-list-item-title>Nome do Contribuinte</v-list-item-title>
              <v-list-item-subtitle>{{ $store.getters['pagamento/nomeContribuinte'] }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item lines="two">
              <v-list-item-title>CPF / CNPJ</v-list-item-title>
              <v-list-item-subtitle>{{ $filters.cnpj_cpf($store.getters['pagamento/cnpjCpf']) || '-' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item lines="two">
              <v-list-item-title>Refer&ecirc;ncia</v-list-item-title>
              <v-list-item-subtitle>{{ $store.getters['pagamento/referencia'] || '-' }}</v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col md="6">
            <v-list-item lines="two">
              <v-list-item-title>Compet&ecirc;ncia</v-list-item-title>
              <v-list-item-subtitle>{{ $dayjs($store.getters['pagamento/competencia']).isValid() ? $dayjs($store.getters['pagamento/competencia']).format('MM/YYYY') : '-' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item lines="two">
              <v-list-item-title>Vencimento</v-list-item-title>
              <v-list-item-subtitle>{{ $dayjs($store.getters['pagamento/vencimento']).isValid() ? $dayjs($store.getters['pagamento/vencimento']).format('DD/MM/YYYY') : '-' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item lines="two">
              <v-list-item-title>Data de Cria&ccedil;&atilde;o</v-list-item-title>
              <v-list-item-subtitle>{{ $dayjs($store.getters['pagamento/dataCriacao']).isValid() ? $dayjs($store.getters['pagamento/dataCriacao']).format('DD/MM/YYYY [às] HH:mm:ss') : '-' }}</v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>

        <v-divider />

        <v-list-group>
          <template #activator>
            <v-list-item-title>Valor Total</v-list-item-title>
            <v-list-item-subtitle>{{ $filters.int_to_real($store.getters['pagamento/valor'], true) || '-' }}</v-list-item-subtitle>
          </template>
          <v-row>
            <v-col md="6">
              <v-list-item lines="two">
                <v-list-item-title>Valor Principal</v-list-item-title>
                <v-list-item-subtitle>{{ $filters.int_to_real($store.getters['pagamento/valorPrincipal'], true) }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item lines="two">
                <v-list-item-title>Descontos</v-list-item-title>
                <v-list-item-subtitle>{{ $filters.int_to_real($store.getters['pagamento/valorDescontos'], true) || '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item lines="two">
                <v-list-item-title>Outras Dedu&ccedil;&otilde;es</v-list-item-title>
                <v-list-item-subtitle>{{ $filters.int_to_real($store.getters['pagamento/valorOutrasDeducoes'], true) || '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col md="6">
              <v-list-item lines="two">
                <v-list-item-title>Multa</v-list-item-title>
                <v-list-item-subtitle>{{ $filters.int_to_real($store.getters['pagamento/valorMulta'], true) || '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item lines="two">
                <v-list-item-title>Juros</v-list-item-title>
                <v-list-item-subtitle>{{ $filters.int_to_real($store.getters['pagamento/valorJuros'], true) || '-' }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item lines="two">
                <v-list-item-title>Outros Acr&eacute;scimos</v-list-item-title>
                <v-list-item-subtitle>{{ $filters.int_to_real($store.getters['pagamento/valorOutrosAcrescimos'], true) || '-' }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>
        </v-list-group>

        <v-divider />

        <v-row>
          <v-col md="6">
            <v-list-item
              v-if="privado"
              lines="two"
            >
              <v-list-item-title>Tipo de Pagamento Escolhido</v-list-item-title>
              <v-list-item-subtitle>{{ $store.getters['pagamento/tipoPagamentoEscolhido'] || '-' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item
              v-if="privado"
              lines="two"
            >
              <v-list-item-title>Transa&ccedil;&atilde;o</v-list-item-title>
              <v-list-item-subtitle>{{ $store.getters['pagamento/transacaoPSP'] || '-' }}</v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col md="6">
            <v-list-item
              v-if="privado"
              lines="two"
            >
              <v-list-item-title>Prestador de Servi&ccedil;o de Pagamento</v-list-item-title>
              <v-list-item-subtitle>{{ $store.getters['pagamento/nomePSP'] || '-' }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item lines="two">
              <v-list-item-title>Situa&ccedil;&atilde;o</v-list-item-title>
              <v-list-item-subtitle>
                <PagamentoSituacao :situacao="$store.getters['pagamento/situacao']?.codigo || ''" />
                <small v-if="$store.getters['pagamento/situacao']?.data">({{ 'atualizado em ' + $dayjs($store.getters['pagamento/situacao'].data).format('DD/MM/YYYY [às] HH:mm:ss') }})</small>
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>

        <v-row v-if="$store.getters['pagamento/situacao'].codigo == 'CRIADO'">
          <v-col>
            <v-list-item>
              <v-list-item-title>
                Endere&ccedil;o para Pagamento:
                <NuxtLink
                  v-slot="{ href, route, navigate }"
                  :to="{ name: 'pagamento-id', params: { id: $store.getters['pagamento/id'] } }"
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
      </v-card-text>

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
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';

defineProps({
  privado: {
    type: Boolean,
    default: false,
  },
})

const domain = computed(() => {
  if (process.client) return window.location.host;
  return process.env.BROWSER_BASE_URL;
})
</script>