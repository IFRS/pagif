<template>
  <v-form ref="form" @submit.prevent="handleSubmit()">
    <v-container>
      <v-row>
        <v-col>
          <v-autocomplete
            prepend-icon="mdi-office-building-marker"
            label="Unidade Gestora"
            v-model="unidade_id"
            :rules="validation.unidade_id"
            :loading="$fetchState.pending"
            :items="$store.state.admin.unidades"
            item-text="nome"
            item-value="_id"
            required
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="2">
          <v-text-field
            prepend-icon="mdi-identifier"
            label="Código do Serviço"
            hint="Deve existir no cadastro de serviços da UG e não estar excluído."
            v-model="codigo"
            :rules="validation.codigo"
            :counter="5"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            prepend-icon="mdi-text-short"
            label="Nome"
            hint="Nome do Serviço, que será apresentado no pagamento."
            v-model="nome"
            :rules="validation.nome"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4" lg="3" xl="2">
          <v-switch
            v-model="enableVencimentoPadrao"
            label="Vencimento Padrão?"
          ></v-switch>
          <v-text-field
            prepend-icon="mdi-calendar-today"
            label="Número de Dias"
            hint="Número de dias para o vencimento. Esses dias serão adicionados a data do pagamento."
            v-model="vencimentoDias"
            :rules="validation.vencimentoDias"
            :disabled="!enableVencimentoPadrao"
            :required="enableVencimentoPadrao"
          ></v-text-field>

          <v-switch
            v-model="enableValorFixo"
            label="Valor Fixo?"
          ></v-switch>
          <v-currency-field
            prepend-icon="mdi-currency-brl"
            label="Valor"
            hint="Valor padrão do Serviço. Esse valor não poderá ser alterado pelo usuário."
            v-model="valorPadrao"
            :rules="validation.valorPadrao"
            :disabled="!enableValorFixo"
            :required="enableValorFixo"
          ></v-currency-field>
        </v-col>
        <v-col>
          <v-textarea
            label="Descrição"
            v-model="desc"
            :rules="validation.desc"
            prepend-icon="mdi-text"
            :counter="999"
            rows="8"
          ></v-textarea>
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
            {{ submitText }}
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
  export default {
    name: 'FormServico',
    async fetch() {
      await this.$store.dispatch('admin/fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.message);
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
        submitText: this.$store.state.admin.servico._id ? 'Atualizar' : 'Salvar',
        validation: {
          unidade_id: [
            v => !!v || 'Selecione uma Unidade Gestora.',
          ],
          codigo: [
            v => !!v || 'Código do Serviço é obrigatório.',
            v => (/^\d+$/).test(v) || 'Código do Serviço precisa ser um número.',
            v => v?.length <= 5 || 'Código do Serviço deve ter no máximo 5 dígitos.',
          ],
          nome: [
            v => !!v || 'Nome é obrigatório.',
          ],
          desc: [
            v => (!v || v?.length <= 999) || 'Descrição deve ter até 999 caracteres.',
          ],
          vencimentoDias: [
            v => ((/^\d+$/).test(v) || !v) || 'Número de Dias precisa ser um número.',
          ],
        },
        enableVencimentoPadrao: false,
        enableValorFixo: false,
      }
    },
    computed: {
      unidade_id: {
        get() {
          return this.$store.state.admin.servico.unidade;
        },
        set(value) {
          this.$store.commit('admin/setServico', { ...this.$store.state.admin.servico, unidade: value });
        }
      },
      codigo: {
        get() {
          return this.$store.state.admin.servico.codigo;
        },
        set(value) {
          this.$store.commit('admin/setServico', { ...this.$store.state.admin.servico, codigo: value });
        }
      },
      nome: {
        get() {
          return this.$store.state.admin.servico.nome;
        },
        set(value) {
          this.$store.commit('admin/setServico', { ...this.$store.state.admin.servico, nome: value });
        }
      },
      desc: {
        get() {
          return this.$store.state.admin.servico.desc;
        },
        set(value) {
          this.$store.commit('admin/setServico', { ...this.$store.state.admin.servico, desc: value });
        }
      },
      vencimentoDias: {
        get() {
          return this.$store.state.admin.servico.vencimentoDias;
        },
        set(value) {
          this.$store.commit('admin/setServico', { ...this.$store.state.admin.servico, vencimentoDias: value });
        }
      },
      valorPadrao: {
        get() {
          return this.$store.state.admin.servico.valorPadrao;
        },
        set(value) {
          this.$store.commit('admin/setServico', { ...this.$store.state.admin.servico, valorPadrao: value });
        }
      },
    },
    watch: {
      enableVencimentoPadrao(newValue) {
        if (newValue === false) {
          this.vencimentoPadrao = undefined;
        }
      },
      enableValorFixo(newValue) {
        if (newValue === false) {
          this.valorPadrao = undefined;
        }
      },
    },
    methods: {
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
