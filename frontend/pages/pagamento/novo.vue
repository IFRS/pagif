<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Pagamento para {{ configStore.unidade?.nome }}</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-stepper
          :model-value="currentStep"
          :disabled="criandoPagamento"
        >
          <v-stepper-header>
            <template
              v-for="(step, index) in steps"
              :key="`${index}-step`"
            >
              <v-stepper-item
                :title="step.title"
                :value="parseInt(index)"
                :complete="currentStep > index"
              />
              <v-divider />
            </template>
          </v-stepper-header>
          <v-stepper-window>
            <v-stepper-window-item
              v-for="(step, index) in steps"
              :key="`${index}-content`"
              :value="parseInt(index)"
            >
              <component
                :is="step.component"
                :ref="(el) => addForm(el, index)"
                class="mb-6"
                @keyup.enter.prevent="nextStep()"
                @recaptcha="handleRecaptcha"
              />
            </v-stepper-window-item>
          </v-stepper-window>
          <v-stepper-actions
            :disabled="false"
            color="primary"
          >
            <template #prev>
              <v-btn
                v-if="currentStep === 1"
                variant="text"
                :to="{ name: 'pagamento' }"
              >
                Voltar
              </v-btn>
              <v-btn
                v-else
                variant="text"
                :disabled="criandoPagamento"
                @click="previousStep()"
              >
                Anterior
              </v-btn>
            </template>

            <template #next>
              <v-btn
                v-if="currentStep < numberOfSteps"
                variant="tonal"
                @click="nextStep()"
              >
                Pr&oacute;ximo
              </v-btn>

              <v-btn
                v-else-if="currentStep == numberOfSteps"
                color="success"
                variant="flat"
                :disabled="!enablePagamento"
                :loading="criandoPagamento"
                @click="criarPagamento()"
              >
                Concluir
              </v-btn>
            </template>
          </v-stepper-actions>
        </v-stepper>
      </v-col>
    </v-row>
    <v-dialog
      v-model="pagamentoConcluido"
      persistent
      max-width="800"
    >
      <v-card>
        <v-card-title class="text-h5">
          Pagamento criado com sucesso!
        </v-card-title>
        <v-card-text>
          Pague agora ou salve o Código do Pagamento abaixo para pagar em outro momento.

          <v-list-item
            class="px-0"
            lines="two"
          >
            <template #prepend>
              <v-btn
                class="me-3"
                icon
                @click="toClipboard(idPagamento)"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <v-list-item-title style="user-select: all">
              {{ idPagamento }}
            </v-list-item-title>
            <v-list-item-subtitle>Código do Pagamento</v-list-item-subtitle>
          </v-list-item>

          <v-alert
            text
            type="warning"
            prominent
            density="compact"
          >
            Lembre-se, sem esse código <strong>não</strong> é possível retomar esse pagamento.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn
            variant="text"
            color="secondary"
            :to="{ name: 'index' }"
          >
            Sair
          </v-btn>
          <v-spacer />
          <v-btn
            variant="text"
            color="primary"
            :to="{ name: 'pagamento-id', params: { id: idPagamento } }"
          >
            Pagar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import copy from 'copy-to-clipboard'

useHeadSafe({
  title: 'Novo Pagamento',
})

const store = useMainStore()
const configStore = useConfigStore()

const pagamentoStore = usePagamentoStore()
const { idPagamento } = storeToRefs(pagamentoStore)

const recaptchaResponse = ref(null)
const criandoPagamento = ref(false)
const pagamentoConcluido = ref(false)
const currentStep = ref(1)
const steps = {
  1: {
    component: resolveComponent('PagamentoStepsCodigoServico'),
    title: 'Serviço',
  },
  2: {
    component: resolveComponent('PagamentoStepsIdentificacao'),
    title: 'Identificação',
  },
  3: {
    component: resolveComponent('PagamentoStepsExtra'),
    title: 'Informações Extras',
  },
  4: {
    component: resolveComponent('PagamentoStepsValorPrincipal'),
    title: 'Valor',
  },
  5: {
    component: resolveComponent('PagamentoStepsResumo'),
    title: 'Resumo',
  },
}
const forms = []

function addForm(el, index) {
  forms[index] = el
}

const numberOfSteps = computed(() => {
  return Object.keys(steps).length
})

function previousStep() {
  currentStep.value = currentStep.value - 1
}

async function nextStep() {
  const { valid } = await forms[currentStep.value].validateForm()
  if (valid) {
    currentStep.value = currentStep.value + 1
  }
}

function handleRecaptcha(response) {
  recaptchaResponse.value = response
}

const enablePagamento = computed(() => {
  return Boolean(recaptchaResponse.value)
})

async function criarPagamento() {
  criandoPagamento.value = true

  const { error } = await pagamentoStore.save_public(recaptchaResponse.value)

  if (error.value) {
    useToast().error('Ocorreu um erro ao criar o Pagamento.')
    console.error(error)
  } else {
    pagamentoConcluido.value = true
  }

  criandoPagamento.value = false
}

async function toClipboard(text) {
  let copiou = false
  if (Navigator.clipboard) {
    await Navigator.clipboard.writeText(text)
      .then(() => {
        copiou = true
      }, () => {
        copiou = false
      })
  } else if (copy(text, { format: 'text/plain' })) {
    copiou = true
  } else {
    copiou = false
  }

  if (copiou) {
    useToast().success('Código do Pagamento copiado para a área de transferência!')
  } else {
    useToast().info('Seu navegador não suporta esse recurso. Por favor, copie manualmente.')
  }
}

onBeforeRouteLeave((to, from, next) => {
  store.clearServicos()
  /*
    Ao limpar o store é gerado o erro 'Missing required param "id"', pois a navegação usa o idPagamento como parâmetro
    Porém, somente limpando o store nesse hook a página de pagamento funciona. Ao usar o hook onUnmout ou onBeforeUnmount o store é limpo depois do fetch.
  */
  pagamentoStore.$reset()
  next()
})
</script>
