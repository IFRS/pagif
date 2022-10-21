<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Novo Pagamento para {{ $store.getters['config/unidade']?.nome }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-stepper v-model="currentStep">
          <v-stepper-header>
            <template v-for="(step, index) in steps">
              <v-stepper-step
                :key="index"
                :complete="currentStep > index"
                :step="index"
              >
                {{ step.title }}
              </v-stepper-step>

              <v-divider v-if="index != numberOfSteps" :key="index + '_divider'"></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content v-for="(step, index) in steps" :key="index" :step="index">
              <component
                class="mb-6"
                :is="step.component"
                ref="step"
                @submit.prevent="nextStep()"
              ></component>

              <v-toolbar
                color="transparent"
                flat
              >
                <v-btn
                  text
                  v-if="currentStep === 1"
                  @click="$router.push({ name: 'pagamento' })"
                >
                  Voltar
                </v-btn>
                <v-btn
                  text
                  v-else
                  :disabled="criandoPagamento"
                  @click="previousStep()"
                >
                  Anterior
                </v-btn>

                <v-spacer></v-spacer>

                <v-btn
                  color="primary"
                  v-if="currentStep < numberOfSteps"
                  @click="nextStep()"
                >
                  Pr&oacute;ximo
                </v-btn>

                <v-btn
                  color="success"
                  v-if="currentStep == numberOfSteps"
                  :loading="criandoPagamento"
                  @click="criarPagamento()"
                >
                  Concluir
                </v-btn>
              </v-toolbar>
            </v-stepper-content>
          </v-stepper-items>
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
            two-line
          >
            <v-list-item-action>
              <v-btn
                icon
                @click="toClipboard($store.getters['pagamento/idPagamento'])"
              >
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title style="user-select: all">{{ $store.getters['pagamento/idPagamento'] }}</v-list-item-title>
              <v-list-item-subtitle>Código do Pagamento</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-alert
            text
            type="warning"
            prominent
            dense
          >
            Lembre-se, sem esse código <strong>não</strong> é possível retomar esse pagamento.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="secondary"
            :to="{ name: 'index' }"
          >
            Já salvei o Código do Pagamento, quero sair dessa tela
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            :to="{ name: 'pagamento-id', params: { id: $store.getters['pagamento/id'] } }"
          >
            Pagar Agora
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import copy from 'copy-to-clipboard';

export default {
  name: 'PagamentoNovo',
  head: {
    title: 'Novo Pagamento',
  },
  data() {
    return {
      criandoPagamento: false,
      currentStep: 1,
      steps: {
        1: {
          component: 'PagamentoStepsCodigoServico',
          title: 'Produto ou Serviço',
        },
        2: {
          component: 'PagamentoStepsIdentificacao',
          title: 'Identificação',
        },
        3: {
          component: 'PagamentoStepsExtra',
          title: 'Informações Extras',
        },
        4: {
          component: 'PagamentoStepsValorPrincipal',
          title: 'Valor',
        },
        5: {
          component: 'PagamentoStepsResumo',
          title: 'Resumo',
        },
      },
      pagamentoConcluido: false,
    }
  },
  computed: {
    numberOfSteps() {
      return Object.keys(this.steps).length;
    }
  },
  methods: {
    previousStep() {
      this.currentStep = this.currentStep - 1;
    },
    nextStep() {
      const refIndex = this.currentStep - 1;

      if (!this.$refs.step[refIndex]) return;
      if (!this.$refs.step[refIndex].$refs.form) return;

      if (this.$refs.step[refIndex].$refs.form.validate()) {
        this.currentStep = this.currentStep + 1;
      }
    },
    async criarPagamento() {
      this.criandoPagamento = true;
      await this.$store.dispatch('pagamento/save')
      .then(() => {
        this.pagamentoConcluido = true;
      })
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao criar o Pagamento. ' + error.message);
        console.error(error);
      })
      .finally(() => {
        this.criandoPagamento = false;
      });
    },
    async toClipboard(text) {
      let copiou = false;
      if (Navigator.clipboard) {
        await Navigator.clipboard.writeText(text)
        .then(() => {
          copiou = true;
        }, () => {
          copiou = false;
        });
      } else if (copy(text, { format: 'text/plain' })) {
        copiou = true;
      } else {
        copiou = false;
      }

      if (copiou) {
        this.$toast.success('Código do Pagamento copiado para a área de transferência!');
      } else {
        this.$toast.info('Seu navegador não suporta esse recurso. Por favor, copie manualmente.');
      }
    },
  },
  destroyed () {
    this.$store.commit('pagamento/clear');
  },
}
</script>
