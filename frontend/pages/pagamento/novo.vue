<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Pagamento para {{ configStore.unidade?.nome }}</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card :disabled="criandoPagamento">
          <v-card-title class="d-inline-flex align-center">
            <v-badge
              color="primary"
              :content="currentStep"
              inline
            />
            &nbsp;
            <span>{{ steps[currentStep]?.title }}</span>
          </v-card-title>

          <v-window v-model="currentStep">
            <v-window-item
              v-for="(step, index) in steps"
              :key="index"
              :value="parseInt(index)"
            >
              <v-card-text>
                <component
                  :is="step.component"
                  :ref="(el) => addForm(el, index)"
                  class="mb-6"
                  @submit.prevent="nextStep()"
                  @recaptcha="handleRecaptcha"
                />
              </v-card-text>
            </v-window-item>
          </v-window>

          <v-divider />

          <v-card-actions>
            <v-btn
              v-if="currentStep === 1"
              variant="text"
              @click="navigateTo({ name: 'pagamento' })"
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

            <v-spacer />

            <v-btn
              v-if="currentStep < numberOfSteps"
              color="primary"
              @click="nextStep()"
            >
              Pr&oacute;ximo
            </v-btn>

            <v-btn
              v-else-if="currentStep == numberOfSteps"
              color="success"
              :disabled="!enablePagamento"
              :loading="criandoPagamento"
              @click="criarPagamento()"
            >
              Concluir
            </v-btn>
          </v-card-actions>
        </v-card>
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
            <v-list-item-action>
              <v-btn
                icon
                @click="toClipboard(pagamentoStore.idPagamento)"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-title style="user-select: all">
              {{ pagamentoStore.idPagamento }}
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
            :to="{ name: 'pagamento-id', params: { id: pagamentoStore.idPagamento } }"
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
import { navigateTo } from '#app'
import { computed, onUnmounted } from 'vue'
import { useMainStore } from '~/store'
import { useConfigStore } from '~/store/config'
import { usePagamentoStore } from '~/store/pagamento'

definePageMeta({ title: 'Novo Pagamento' })

const store = useMainStore()
const configStore = useConfigStore()
const pagamentoStore = usePagamentoStore()

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
    });
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

onUnmounted(() => {
  store.clearServicos()
  pagamentoStore.$reset()
})
</script>
