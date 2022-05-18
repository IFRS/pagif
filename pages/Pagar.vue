<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="codigoServico"
            :rules="validation.codigoServico"
            :counter="20"
            label="Código do Serviço"
            required
          ></v-text-field>
          <v-text-field
            v-model="nomeContribuinte"
            :rules="validation.nomeContribuinte"
            :counter="45"
            label="Nome do Contribuinte"
            required
          ></v-text-field>
          <v-text-field
            v-model="valorPrincipal"
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
            @click="submitForm"
          >Enviar</v-btn>
        </v-col>
      </v-row>
    </v-container>
    {{res}}
  </v-form>
</template>

<script>
  export default {
    name: 'Pagar',
    data: () => ({
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
      codigoServico: '',
      nomeContribuinte: '',
      valorPrincipal: '',
      res: '',
    }),
    computed: {
      valorPrincipal_sanitized: function() {
        return this.valorPrincipal.replace(/\D/g, "");
      },
    },
    methods: {
      async submitForm() {
        await this.$axios.post('/api/pagar', {
          codigoServico: this.codigoServico,
          nomeContribuinte: this.nomeContribuinte,
          valorPrincipal: this.valorPrincipal_sanitized,
        }).then((response) => {
          this.res = response.data;
        }).catch((error) => {
          console.error(error);
        });
      },
    },
  }
</script>
