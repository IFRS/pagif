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
            :items="$store.getters['unidades']"
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
            validate-on-blur
            :rules="validation.codigoServico"
            :loading="loadingServicos"
            :disabled="loadingServicos || $store.getters['servicos'].length === 0"
            :items="$store.getters['servicos']"
            item-text="nome"
            item-value="codigo"
            required
          >
            <template #item="{ item }">
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
            <template #activator="{ on, attrs }">
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
            ></v-date-picker>
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
            <template #activator="{ on, attrs }">
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
            ></v-date-picker>
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
            v-model="cnpjCpfFormatted"
            :rules="validation.cnpjCpf"
            v-mask="cnpjCpfMask"
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
        <v-icon small>mdi-minus</v-icon>
        <v-col>
          <!-- Valor Descontos -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Descontos"
            hint="Valor dos descontos."
            v-model="valorDescontos"
          ></v-currency-field>
        </v-col>
        <v-icon small>mdi-minus</v-icon>
        <v-col>
          <!-- Valor Deduções -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Deduções"
            hint="Valor de outras deduções."
            v-model="valorOutrasDeducoes"
          ></v-currency-field>
        </v-col>
        <v-icon small>mdi-plus</v-icon>
        <v-col>
          <!-- Valor Multa -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Multa"
            hint="Valor da multa."
            v-model="valorMulta"
          ></v-currency-field>
        </v-col>
        <v-icon small>mdi-plus</v-icon>
        <v-col>
          <!-- Valor Juros -->
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor Juros"
            hint="Valor dos juros."
            v-model="valorJuros"
          ></v-currency-field>
        </v-col>
        <v-icon small>mdi-plus</v-icon>
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
  import { mapGetters, mapMutations } from 'vuex';
  const dayjs = require('dayjs');
  const customParseFormat = require('dayjs/plugin/customParseFormat');
  const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
  dayjs.extend(customParseFormat);
  dayjs.extend(isSameOrAfter);

  export default {
    name: 'FormPagamento',
    async fetch() {
      await this.$store.dispatch('fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
        console.error(error);
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
            v => (v?.length >= 2 && v?.length <= 45) || 'Nome do Contribuinte precisa ter entre 2 e 45 caracteres.',
          ],
          cnpjCpf: [
            v => !v || (this.$validation.CPF(v) || this.$validation.CNPJ(v)) || 'CPF / CNPJ deve ser válido.',
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
        ...mapGetters({ get: 'pagamento/codigoServico' }),
        ...mapMutations({ set: 'pagamento/codigoServico' }),
      },
      referencia: {
        ...mapGetters({ get: 'pagamento/referencia' }),
        ...mapMutations({ set: 'pagamento/referencia' }),
      },
      competencia: {
        ...mapGetters({ get: 'pagamento/competencia' }),
        ...mapMutations({ set: 'pagamento/competencia' }),
      },
      competenciaFormatted() {
        if (!this.competencia) return null;

        return dayjs(this.competencia).format('MM/YYYY');
      },
      vencimento: {
        ...mapGetters({ get: 'pagamento/vencimento' }),
        ...mapMutations({ set: 'pagamento/vencimento' }),
      },
      vencimentoFormatted() {
        if (!this.vencimento) return null;

        return dayjs(this.vencimento).format('DD/MM/YYYY');
      },
      nomeContribuinte: {
        ...mapGetters({ get: 'pagamento/nomeContribuinte' }),
        ...mapMutations({ set: 'pagamento/nomeContribuinte' }),
      },
      cnpjCpf: {
        ...mapGetters({ get: 'pagamento/cnpjCpf' }),
        ...mapMutations({ set: 'pagamento/cnpjCpf' }),
      },
      cnpjCpfFormatted: {
        get() {
          if (this.cnpjCpf) return this.$options.filters.VMask(this.cnpjCpf, this.cnpjCpfMask);
          return '';
        },
        set(value) {
          value = String(value);
          value = value.replace(/\D/g, '');
          this.cnpjCpf = value;
        }
      },
      cnpjCpfMask() {
        if (this.cnpjCpf && this.cnpjCpf.length > 11) {
          return '##.###.###/####-##';
        }
        return '###.###.###-##';
      },
      valorPrincipal: {
        ...mapGetters({ get: 'pagamento/valorPrincipal' }),
        ...mapMutations({ set: 'pagamento/valorPrincipal' }),
      },
      valorDescontos: {
        ...mapGetters({ get: 'pagamento/valorDescontos' }),
        ...mapMutations({ set: 'pagamento/valorDescontos' }),
      },
      valorOutrasDeducoes: {
        ...mapGetters({ get: 'pagamento/valorOutrasDeducoes' }),
        ...mapMutations({ set: 'pagamento/valorOutrasDeducoes' }),
      },
      valorMulta: {
        ...mapGetters({ get: 'pagamento/valorMulta' }),
        ...mapMutations({ set: 'pagamento/valorMulta' }),
      },
      valorJuros: {
        ...mapGetters({ get: 'pagamento/valorJuros' }),
        ...mapMutations({ set: 'pagamento/valorJuros' }),
      },
      valorOutrosAcrescimos: {
        ...mapGetters({ get: 'pagamento/valorOutrosAcrescimos' }),
        ...mapMutations({ set: 'pagamento/valorOutrosAcrescimos' }),
      },
    },
    methods: {
      async fetchServicos(unidade_id) {
        this.loadingServicos = true;
        this.$store.commit('pagamento/codigoServico', null);
        await this.$store.dispatch('fetchServicos', {unidade: unidade_id})
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao carregar os Serviços: ' + error.message);
          console.error(error);
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
    },
  }
</script>
