<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Pagamento para {{ configStore.unidade?.nome }}</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>
          {{ steps[currentStep]?.title }}
          <v-badge
            color="primary"
            :content="currentStep"
            inline
          />
        </h3>
        <v-window v-model="step">
          <v-window-item
            v-for="(step, index) in steps"
            :key="index"
            :value="index"
          >
            <component
              :is="step.component"
              :ref="'step' + index"
              class="mb-6"
              @submit.prevent="nextStep()"
              @recaptcha="handleRecaptcha"
            />
            <v-toolbar
              color="transparent"
              flat
            >
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
            </v-toolbar>
          </v-window-item>
        </v-window>
        <!-- TODO substituir componente -->
        <!-- <v-stepper v-model="currentStep">
          <v-stepper-header>
            <template
              v-for="(step, index) in steps"
              :key="index"
            >
              <v-stepper-step
                :complete="currentStep > index"
                :step="index"
              >
                {{ step.title }}
              </v-stepper-step>

              <v-divider v-if="index != numberOfSteps" />
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="(step, index) in steps"
              :key="index"
              :step="index"
            >
              <component
                :is="step.component"
                :ref="'step' + index"
                class="mb-6"
                @submit.prevent="nextStep()"
                @recaptcha="handleRecaptcha"
              />

              <v-toolbar
                color="transparent"
                flat
              >
                <v-btn
                  v-if="currentStep === 1"
                  variant="text"
                  @click="$router.push({ name: 'pagamento' })"
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
              </v-toolbar>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper> -->
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
                @click="toClipboard($store.getters['pagamento/idPagamento'])"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-title style="user-select: all">
              {{ $store.getters['pagamento/idPagamento'] }}
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
            :to="{ name: 'pagamento-id', params: { id: $store.getters['pagamento/id'] } }"
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
import { navigateTo } from 'nuxt/app'
import { computed, onUnmounted } from 'vue'
import { useMainStore } from '~/store'
import { useConfigStore } from '~/store/config'
import { usePagamentoStore } from '~/store/pagamento'

definePageMeta({ title: 'Novo Pagamento' })

const store = useMainStore()
const configStore = useConfigStore()
const pagamentoStore = usePagamentoStore()

const enablePagamento = ref(false)
const criandoPagamento = ref(false)
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
const pagamentoConcluido = ref(false)

const numberOfSteps = computed(() => {
  return Object.keys(steps).length
})

function previousStep() {
  currentStep = currentStep - 1;
}

function nextStep() {
  if (this.$refs['step' + this.currentStep][0].$refs.form.validate()) {
    currentStep = currentStep + 1;
  }
}

function handleRecaptcha(status) {
  enablePagamento = status
}

async function criarPagamento() {
  criandoPagamento = true

  const recaptcha = await this.$recaptcha.getResponse()

  const { error } = await pagamentoStore.save_public(recaptcha)
  pagamentoConcluido = true
  if (error) {
    useToast().error('Ocorreu um erro ao criar o Pagamento.')
    console.error(error)
  }
  criandoPagamento = false

  await this.$recaptcha.reset()
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
