<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          :loading="pending"
          :disabled="pending"
        >
          <v-card-title primary-title>
            Pagamento {{ idPagamento }}
          </v-card-title>
          <v-card-text>
            <p>
              Pagamento no valor de <strong>R$ {{ useFilters().int_to_real(valorPrincipal) }}</strong> para <strong>{{ nomeUnidade }}</strong> pelo servi&ccedil;o <strong>{{ nomeServico }} ({{ codigoServico }})</strong>.
            </p>
            <p>
              O pagamento <template v-if="competencia">
                referente ao m&ecirc;s <strong>{{ dayjs(competencia, 'YYYY-MM').format('MM/YYYY') }}</strong>&nbsp;
              </template>est&aacute; em nome de <strong>{{ nomeContribuinte }}<template v-if="cnpjCpf">&nbsp;({{ useFilters().cnpj_cpf(cnpjCpf) }})</template></strong>.
            </p>
            <p v-if="referencia">
              O n&uacute;mero de refer&ecirc;ncia atrelado a esse pagamento &eacute; <strong>{{ referencia }}</strong>.
            </p>
            <p class="mb-3">
              Vencimento em
              <strong>
                <template v-if="vencimento">
                  {{ dayjs(vencimento).format('DD/MM/YYYY') }}
                </template>
                <template v-else>
                  {{ dayjs(dataCriacao).add(1, 'day').format('DD/MM/YYYY') }}
                </template>
              </strong>.
            </p>

            <v-alert
              v-if="situacao?.codigo === 'INICIADO' || situacao?.codigo === 'SUBMETIDO'"
              type="info"
              text
            >
              Pagamento n&atilde;o pode ser realizado por j&aacute; ter sido iniciado. Verifique mais informa&ccedil;&otilde;es sobre esse Pagamento na
              <NuxtLink
                :to="{ name: 'consulta-id', params: { id: idPagamento } }"
                class="text-white"
              >
                p&aacute;gina de consulta.
              </NuxtLink>
            </v-alert>

            <v-alert
              v-else-if="situacao?.codigo === 'CONCLUIDO'"
              type="info"
              text
            >
              Pagamento n&atilde;o pode ser realizado por j&aacute; ter sido conclu&iacute;do. Verifique mais informa&ccedil;&otilde;es sobre esse Pagamento na
              <NuxtLink
                :to="{ name: 'consulta-id', params: { id: idPagamento } }"
                class="text-white"
              >
                p&aacute;gina de consulta.
              </NuxtLink>
            </v-alert>

            <v-alert
              v-else-if="situacao?.codigo === 'REJEITADO' || situacao?.codigo === 'CANCELADO'"
              type="info"
              text
            >
              Pagamento n&atilde;o pode ser realizado por j&aacute; ter sido finalizado. Verifique mais informa&ccedil;&otilde;es sobre esse Pagamento na
              <NuxtLink
                :to="{ name: 'consulta-id', params: { id: idPagamento } }"
                class="text-white"
              >
                p&aacute;gina de consulta.
              </NuxtLink>
            </v-alert>

            <v-alert
              v-else
              type="error"
              text
            >
              Aten&ccedil;&atilde;o! Ao clicar em &quot;<strong>Pagar Agora</strong>&quot; voc&ecirc; iniciar&aacute; um processo de <strong>acesso &uacute;nico</strong>. Ou seja, a tela para pagamento s&oacute; ser&aacute; exibida uma &uacute;nica vez.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              variant="text"
              :to="{ name: 'pagamento' }"
            >
              Voltar
            </v-btn>
            <v-btn
              v-if="situacao?.codigo === 'CRIADO'"
              :disabled="mostrarPagamento"
              variant="text"
              color="primary"
              @click="mostrarPagamento = true"
            >
              Pagar Agora
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="mostrarPagamento">
      <v-col>
        <v-card>
          <v-alert
            type="info"
            text
          >
            Confira os dados que aparecer&atilde;o na tela abaixo antes de efetuar o pagamento.
          </v-alert>
          <iframe
            v-resize-iframe="{ heightCalculationMethod: 'documentElementOffset' }"
            class="iframe-epag"
            scrolling="no"
            :src="proximaUrl + '&btnConcluir=true' + (!configStore.darkMode ? '&tema=tema-light' : '')"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import iFrameResize from 'iframe-resizer/js/iframeResizer'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '~/store/config'
import { usePagamentoStore } from '~/store/pagamento'

useHeadSafe({
  title: 'Pagamento',
})

const dayjs = useDayjs()

const mostrarPagamento = ref(false)

const configStore = useConfigStore()

const route = useRoute()
const pagamentoStore = usePagamentoStore()

const { pending, error } = await pagamentoStore.show_public(route.params.id)

if (error.value) {
  console.error(error);
  useToast().error('Ocorreu um erro ao buscar o Pagamento.')
  await navigateTo({ name: 'pagamento' })
}

const {
  idPagamento,
  valorPrincipal,
  nomeUnidade,
  nomeServico,
  codigoServico,
  nomeContribuinte,
  cnpjCpf,
  situacao,
  referencia,
  competencia,
  vencimento,
  dataCriacao,
  proximaUrl,
} = storeToRefs(pagamentoStore)

async function retornoPagtesouro(event) {
  // Só confiar em eventos oriundos do PagTesouro.
  if (event.origin !== useRuntimeConfig().public.pagtesouroURL) return

  // Evento disparado pelos botões Fechar/Concluir.
  if (event.data === "EPAG_FIM") {
    useToast().info('Pagamento finalizado.')
    await navigateTo({ name: 'index' })
  }
}

onMounted(() => {
  window.addEventListener('message', retornoPagtesouro, false)
})

const vResizeIframe = {
  beforeMount(el, { value }) {
    el.addEventListener('load', () => iFrameResize(value, el))
  },
  beforeUnmount(el) {
    el.iFrameResizer.removeListeners()
  }
}

onBeforeRouteLeave((to, from, next) => {
  pagamentoStore.$reset()
  next()
})
</script>

<style lang="scss" scoped>
.iframe-epag {
  margin: 0;
  padding: 0;
  border: 0;
  width: 1px;
  min-width: 100%;
}
</style>
