<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col>
          <!-- Unidade -->
          <v-autocomplete
            prepend-icon="mdi-office-building-marker"
            label="Unidade Gestora"
            :rules="validation.unidade"
            :loading="$fetchState.pending"
            :disabled="$fetchState.pending"
            :items="$store.state.admin.unidades"
            item-text="nome"
            item-value="_id"
            required
            @change="fetchServicos"
          ></v-autocomplete>
        </v-col>
        <v-col>
          <!-- Código do Serviço -->
          <v-autocomplete
            prepend-icon="mdi-basket"
            label="Serviço"
            v-model="codigoServico"
            :rules="validation.codigoServico"
            :loading="loadingServicos"
            :disabled="loadingServicos || $store.state.admin.servicos.length === 0"
            :items="$store.state.admin.servicos"
            item-text="nome"
            item-value="codigo"
            required
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title>{{ item.codigo }} - {{ item.nome }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Referência -->
          <v-text-field
            prepend-icon="mdi-numeric"
            label="Número de Referência"
            v-model="referencia"
            :rules="validation.referencia"
            :counter="20"
          ></v-text-field>
        </v-col>
        <v-col>
          <!-- Competência -->
          <v-menu
            :close-on-click="true"
            :close-on-content-click="true"
            :return-value="competencia"
            transition="scale-transition"
            offset-y
            max-width="auto"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="competenciaFormatted"
                label="Competência"
                prepend-icon="mdi-calendar-month"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="competencia"
              type="month"
              no-title
              scrollable
            />
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <!-- Vencimento -->
          <v-menu
            :close-on-click="true"
            :close-on-content-click="true"
            :return-value="vencimento"
            transition="scale-transition"
            offset-y
            max-width="auto"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="vencimentoFormatted"
                label="Vencimento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="validation.vencimento"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="vencimento"
              no-title
              scrollable
            />
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Nome do Contribuinte -->
          <v-text-field
            prepend-icon="mdi-text-short"
            label="Nome do Contribuinte"
            v-model="nomeContribuinte"
            :rules="validation.nomeContribuinte"
            :counter="45"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <!-- CPF / CNPJ -->
          <v-text-field
            prepend-icon="mdi-card-account-details"
            label="CPF / CNPJ"
            v-model="cnpjCpf"
            :rules="validation.cnpjCpf"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Valor Principal -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Principal"
            hint="Valor do pagamento."
            v-model="valorPrincipal"
            :rules="validation.valorPrincipal"
            required
          ></v-currency-field>
        </v-col>
        <v-col>
          <!-- Valor Descontos -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Descontos"
            hint="Valor dos descontos."
            v-model="valorDescontos"
          ></v-currency-field>
        </v-col>
        <v-col>
          <!-- Valor Deduções -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Deduções"
            hint="Valor de outras deduções."
            v-model="valorOutrasDeducoes"
          ></v-currency-field>
        </v-col>
        <v-col>
          <!-- Valor Multa -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Multa"
            hint="Valor da multa."
            v-model="valorMulta"
          ></v-currency-field>
        </v-col>
        <v-col>
          <!-- Valor Juros -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Juros"
            hint="Valor dos juros."
            v-model="valorJuros"
          ></v-currency-field>
        </v-col>
        <v-col>
          <!-- Valor Acréscimos -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Acréscimos"
            hint="Valor de outros acréscimos."
            v-model="valorOutrosAcrescimos"
          ></v-currency-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="primary"
            type="submit"
            :loading="submitting"
            :disabled="submitting"
          >
            Salvar
          </v-btn>
          <v-btn
            color="secondary"
            @click="handleCancel()"
            :disabled="submitting"
          >
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  const dayjs = require('dayjs');
  const customParseFormat = require('dayjs/plugin/customParseFormat')
  const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
  dayjs.extend(customParseFormat)
  dayjs.extend(isSameOrAfter);

  export default {
    name: 'FormPagamento',
    async fetch() {
      await this.$store.dispatch('admin/fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
        console.log(error);
      });
    },
    props: {
      submitting: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        validation: {
          unidade: [
            v => !!v || 'Selecione uma Unidade.',
          ],
          codigoServico: [
            v => !!v || 'Selecione um Serviço.',
          ],
          referencia: [
            v => !v || (/^\d+$/).test(v) || 'Número de Referência precisa ser um número.',
            v => !v || v?.length <= 20 || 'Número de Referência deve ter no máximo 20 dígitos.',
          ],
          vencimento: [
            v => {
              if (!v) return true;

              const hoje = dayjs();
              const vencimento = dayjs(v, 'DD/MM/YYYY');

              if (vencimento.isSameOrAfter(hoje, 'day')) {
                return true;
              }

              return 'O Vencimento precisa ser em data posterior à data de hoje.';
            },
          ],
          nomeContribuinte: [
            v => !!v || 'O Nome do Contribuinte é obrigatório.',
            v => v?.length <= 45 || 'Nome do Contribuinte precisa ter no máximo 45 caracteres.',
          ],
          cnpjCpf: [
            v => !v || (this.validaCPF(v) || this.validaCNPJ(v)) || 'CPF / CNPJ deve ser válido.',
          ],
          valorPrincipal: [
            v => !!v || 'Valor Principal é obrigatório.',
          ],
        },
        loadingServicos: false,
      }
    },
    computed: {
      codigoServico: {
        ...mapGetters({ get: 'admin/pagamento/codigoServico' }),
        ...mapMutations({ set: 'admin/pagamento/codigoServico' }),
      },
      referencia: {
        ...mapGetters({ get: 'admin/pagamento/referencia' }),
        ...mapMutations({ set: 'admin/pagamento/referencia' }),
      },
      competencia: {
        ...mapGetters({ get: 'admin/pagamento/competencia' }),
        ...mapMutations({ set: 'admin/pagamento/competencia' }),
      },
      competenciaFormatted() {
        if (!this.competencia) return null;

        return dayjs(this.competencia).format('MM/YYYY');
      },
      vencimento: {
        ...mapGetters({ get: 'admin/pagamento/vencimento' }),
        ...mapMutations({ set: 'admin/pagamento/vencimento' }),
      },
      vencimentoFormatted() {
        if (!this.vencimento) return null;

        return dayjs(this.vencimento).format('DD/MM/YYYY');
      },
      nomeContribuinte: {
        ...mapGetters({ get: 'admin/pagamento/nomeContribuinte' }),
        ...mapMutations({ set: 'admin/pagamento/nomeContribuinte' }),
      },
      cnpjCpf: {
        ...mapGetters({ get: 'admin/pagamento/cnpjCpf' }),
        ...mapMutations({ set: 'admin/pagamento/cnpjCpf' }),
      },
      valorPrincipal: {
        ...mapGetters({ get: 'admin/pagamento/valorPrincipal' }),
        ...mapMutations({ set: 'admin/pagamento/valorPrincipal' }),
      },
      valorDescontos: {
        ...mapGetters({ get: 'admin/pagamento/valorDescontos' }),
        ...mapMutations({ set: 'admin/pagamento/valorDescontos' }),
      },
      valorOutrasDeducoes: {
        ...mapGetters({ get: 'admin/pagamento/valorOutrasDeducoes' }),
        ...mapMutations({ set: 'admin/pagamento/valorOutrasDeducoes' }),
      },
      valorMulta: {
        ...mapGetters({ get: 'admin/pagamento/valorMulta' }),
        ...mapMutations({ set: 'admin/pagamento/valorMulta' }),
      },
      valorJuros: {
        ...mapGetters({ get: 'admin/pagamento/valorJuros' }),
        ...mapMutations({ set: 'admin/pagamento/valorJuros' }),
      },
      valorOutrosAcrescimos: {
        ...mapGetters({ get: 'admin/pagamento/valorOutrosAcrescimos' }),
        ...mapMutations({ set: 'admin/pagamento/valorOutrosAcrescimos' }),
      },
    },
    methods: {
      async fetchServicos(unidade_id) {
        this.loadingServicos = true;
        await this.$store.dispatch('admin/fetchServicos', {unidade: unidade_id})
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
          console.log(error);
        })
        .finally(() => {
          this.loadingServicos = false;
        });
      },
      handleSubmit() {
        if (this.$refs.form.validate()) {
          this.$emit('ok');
        }
      },
      handleCancel() {
        this.$refs.form.reset();
        this.$emit('cancel');
      },
      validaCPF(value) {
        let cpf = value.replace(/[^\d]+/g, '');

        if (cpf === '') return false;

        if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999") return false;

        let add = 0;

        for (let i=0; i < 9; i ++) {
          add += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) {
          rev = 0;
        }

        if (rev != parseInt(cpf.charAt(9))) return false;

        add = 0;
        for (let i = 0; i < 10; i ++) {
          add += parseInt(cpf.charAt(i)) * (11 - i);
        }

        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11) {
          rev = 0;
        }
        if (rev != parseInt(cpf.charAt(10))) return false;

        return true;
      },
      validaCNPJ(value) {
        let cnpj = value.replace(/[^\d]+/g, '');

        if (cnpj === '') return false;

        if (cnpj.length != 14) return false;

        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999") return false;


        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }

        let resultado = (soma % 11 < 2) ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2) {
            pos = 9;
          }
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;

        return true;
      },
    },
  }
</script>
