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
              ></component>

              <v-btn
                text
                :disabled="currentStep <= 1"
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
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NovoPagamento',
  data() {
    return {
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
  },
  destroyed () {
    this.$store.commit('pagamento/clear');
  },
}
</script>
