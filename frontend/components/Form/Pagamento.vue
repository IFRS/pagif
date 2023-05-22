<template>
  <v-form
    ref="form"
    @submit.prevent="handleSubmit"
  >
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
            item-title="nome"
            item-value="_id"
            required
            @update:model-value="fetchServicos"
          />
        </v-col>
        <v-col>
          <!-- Código do Serviço -->
          <v-autocomplete
            v-model="codigoServico"
            prepend-icon="mdi-basket"
            label="Serviço"
            validate-on="blur"
            :rules="validation.codigoServico"
            :loading="loadingServicos"
            :disabled="loadingServicos || $store.getters['servicos'].length === 0"
            :items="$store.getters['servicos']"
            item-title="nome"
            item-value="codigo"
            required
          >
            <template #item="{ item }">
              <v-list-item-title>{{ item.codigo }} - {{ item.nome }}</v-list-item-title>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Referência -->
          <v-text-field
            v-model="referencia"
            prepend-icon="mdi-numeric"
            label="Número de Referência"
            :rules="validation.referencia"
            :counter="20"
          />
        </v-col>
        <v-col>
          <!-- Competência -->
          <v-menu
            :persistent="!(true)"
            :close-on-content-click="true"
            :model-value="competencia"
            transition="scale-transition"
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
              />
            </template>
            <v-date-picker
              v-model="competencia"
              type="month"
              no-title
              scrollable
            />
          </v-menu>
        </v-col>
        <v-col>
          <!-- Vencimento -->
          <v-menu
            :persistent="!(true)"
            :close-on-content-click="true"
            :model-value="vencimento"
            transition="scale-transition"
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
                :rules="validation.vencimento"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="vencimento"
              no-title
              scrollable
            />
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Nome do Contribuinte -->
          <v-text-field
            v-model="nomeContribuinte"
            prepend-icon="mdi-text-short"
            label="Nome do Contribuinte"
            :rules="validation.nomeContribuinte"
            :counter="45"
            required
          />
        </v-col>
        <v-col>
          <!-- CPF / CNPJ -->
          <v-text-field
            v-model="cnpjCpfFormatted"
            v-maska="cnpjCpfMask"
            prepend-icon="mdi-card-account-details"
            label="CPF / CNPJ"
            :rules="validation.cnpjCpf"
            validate-on="blur"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Valor Principal -->
          <v-currency-field
            v-model="valorPrincipal"
            prepend-icon="mdi-currency-brl"
            label="Valor Principal"
            hint="Valor do pagamento."
            :rules="validation.valorPrincipal"
            required
          />
        </v-col>
        <v-icon size="small">
          mdi-minus
        </v-icon>
        <v-col>
          <!-- Valor Descontos -->
          <v-currency-field
            v-model="valorDescontos"
            prepend-icon="mdi-currency-brl"
            label="Valor Descontos"
            hint="Valor dos descontos."
          />
        </v-col>
        <v-icon size="small">
          mdi-minus
        </v-icon>
        <v-col>
          <!-- Valor Deduções -->
          <v-currency-field
            v-model="valorOutrasDeducoes"
            prepend-icon="mdi-currency-brl"
            label="Valor Deduções"
            hint="Valor de outras deduções."
          />
        </v-col>
        <v-icon size="small">
          mdi-plus
        </v-icon>
        <v-col>
          <!-- Valor Multa -->
          <v-currency-field
            v-model="valorMulta"
            prepend-icon="mdi-currency-brl"
            label="Valor Multa"
            hint="Valor da multa."
          />
        </v-col>
        <v-icon size="small">
          mdi-plus
        </v-icon>
        <v-col>
          <!-- Valor Juros -->
          <v-currency-field
            v-model="valorJuros"
            prepend-icon="mdi-currency-brl"
            label="Valor Juros"
            hint="Valor dos juros."
          />
        </v-col>
        <v-icon size="small">
          mdi-plus
        </v-icon>
        <v-col>
          <!-- Valor Acréscimos -->
          <v-currency-field
            v-model="valorOutrosAcrescimos"
            prepend-icon="mdi-currency-brl"
            label="Valor Acréscimos"
            hint="Valor de outros acréscimos."
          />
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
            :disabled="submitting"
            @click="handleCancel()"
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
  const customParseFormat = require('dayjs/plugin/customParseFormat');
  const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');

  export default {
    props: {
      submitting: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['ok', 'cancel'],
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

              const hoje = this.$dayjs();
              const vencimento = this.$dayjs(v, 'DD/MM/YYYY');

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
            v => !!v || 'CPF / CNPJ é obrigatório.',
            v => !v || (this.$validation.CPF(v) || this.$validation.CNPJ(v)) || 'CPF / CNPJ deve ser válido.',
          ],
          valorPrincipal: [
            v => !!v || 'Valor Principal é obrigatório.',
          ],
        },
        loadingServicos: false,
      }
    },
    async fetch() {
      await this.$store.dispatch('fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
        console.error(error);
      });
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

        return this.$dayjs(this.competencia).format('MM/YYYY');
      },
      vencimento: {
        ...mapGetters({ get: 'pagamento/vencimento' }),
        ...mapMutations({ set: 'pagamento/vencimento' }),
      },
      vencimentoFormatted() {
        if (!this.vencimento) return null;

        return this.$dayjs(this.vencimento).format('DD/MM/YYYY');
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
    created () {
      this.$dayjs.extend(customParseFormat);
      this.$dayjs.extend(isSameOrAfter);
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
