<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Novo Pagamento</h2>
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
              <component :is="step.component"></component>

              <v-btn
                text
                v-if="currentStep >= numberOfSteps"
                @click="currentStep = currentStep - 1"
              >
                Anterior
              </v-btn>

              <v-btn
                color="primary"
                v-if="currentStep < numberOfSteps"
                @click="currentStep = currentStep + 1"
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
          name: 'Código do Serviço',
        },
        2: {
          component: 'PagamentoNomeContribuinte',
          name: 'Nome do Contribuinte',
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
}
</script>
