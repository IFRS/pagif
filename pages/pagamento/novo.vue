<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Novo Pagamento para {{ $store.getters['unidade/nome'] }}</h2>
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
                {{ step.name }}
              </v-stepper-step>

              <v-divider v-if="index != numberOfSteps"></v-divider>
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

              <v-btn
                text
                :disabled="(currentStep <= 1) || criandoPagamento"
                @click="previousStep()"
              >
                Anterior
              </v-btn>

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
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PagamentoNovo',
  head: {
    title: 'Novo Pagamento',
  },
  data() {
    return {
      criandoPagamento: false,
      steps: {
        1: {
          component: 'PagamentoCodigoServico',
          name: 'Produto ou Serviço',
        },
        2: {
          component: 'PagamentoNomeContribuinte',
          name: 'Nome',
        },
        3: {
          component: 'PagamentoCnpjCpf',
          name: 'CPF / CNPJ',
        },
        4: {
          component: 'PagamentoValorPrincipal',
          name: 'Valor',
        },
        5: {
          component: 'PagamentoResumo',
          name: 'Resumo',
        },
      },
      currentStep: 1,
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
      .then((response) => {
        this.$store.commit('pagamento/clear');
        this.$router.push({
          name: 'pagamento-id',
          params: {
            id: response.data.idPagamento,
          },
        });
      })
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao criar o Pagamento. ' + error.message);
        console.error(error);
      })
      .finally(() => {
        this.criandoPagamento = false;
      });
    },
  },
  destroyed () {
    this.$store.commit('pagamento/clear');
  },
}
</script>
