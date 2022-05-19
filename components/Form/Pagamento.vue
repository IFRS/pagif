<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="pagamento.codigoServico"
            :rules="validation.codigoServico"
            :counter="20"
            label="Código do Serviço"
            required
          ></v-text-field>
          <v-text-field
            v-model="pagamento.nomeContribuinte"
            :rules="validation.nomeContribuinte"
            :counter="45"
            label="Nome do Contribuinte"
            required
          ></v-text-field>
          <v-text-field
            v-model="pagamento.valorPrincipal"
            :rules="validation.valorPrincipal"
            label="Valor"
            prefix="R$"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            type="submit"
          >
            Enviar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'FormPagamento',
    props: {
      pagamentoInicial: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        validation: {
          codigoServico: [
            v => !!v || 'Código do Serviço é obrigatório.',
            v => v.length <= 5 || 'Código do Serviço precisa ser menor ou igual a 5 digitos.',
          ],
          nomeContribuinte: [
            v => !!v || 'O Nome do Contribuinte é obrigatório.',
            v => v.length <= 45 || 'Nome do Contribuinte precisa ter no máximo 45 caracteres.',
          ],
          valorPrincipal: [
            v => !!v || 'O Valor é obrigatório.',
            v => /^(?!0+,00)(\d{1,3}\.)*(\d)+\,(\d{2})/.test(v) || 'Valor precisa estar no formato 999.999,99',
          ],
        },
        pagamento: {
          codigoServico: this.pagamentoInicial.codigoServico || '',
          nomeContribuinte: this.pagamentoInicial.nomeContribuinte || '',
          valorPrincipal: this.pagamentoInicial.valorPrincipal || '',
        },
      }
    },
    methods: {
      handleSubmit() {
        this.$emit('enviar', { ...this.pagamento });
      }
    },
  }
</script>
