<template>
  <v-form
    ref="form"
    @submit.prevent="handleSubmit()"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="unidade"
            prepend-icon="mdi-office-building-marker"
            label="Unidade Gestora"
            :rules="validation.unidade"
            :loading="$fetchState.pending"
            :disabled="$fetchState.pending"
            :items="$store.getters['unidades']"
            item-title="nome"
            item-value="_id"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="2"
        >
          <v-text-field
            v-model="codigo"
            prepend-icon="mdi-identifier"
            label="Código do Serviço"
            hint="Deve existir no cadastro de serviços da UG e não estar excluído."
            :rules="validation.codigo"
            :counter="5"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="nome"
            prepend-icon="mdi-text-short"
            label="Nome"
            hint="Nome do Serviço, que será apresentado no pagamento."
            :rules="validation.nome"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model="desc"
            label="Descrição"
            :rules="validation.desc"
            prepend-icon="mdi-text"
            :counter="999"
            rows="9"
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
            {{ submitText }}
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
        submitText: this.$store.getters['servico/id'] ? 'Atualizar' : 'Salvar',
        validation: {
          unidade: [
            v => !!v || 'Selecione uma Unidade Gestora.',
          ],
          codigo: [
            v => !!v || 'Código do Serviço é obrigatório.',
            v => (/^\d+$/).test(v) || 'Código do Serviço precisa ser um número.',
            v => v?.toString().length <= 5 || 'Código do Serviço deve ter no máximo 5 dígitos.',
          ],
          nome: [
            v => !!v || 'Nome é obrigatório.',
          ],
          desc: [
            v => (!v || v?.length <= 999) || 'Descrição deve ter até 999 caracteres.',
          ],
        },
      }
    },
    async fetch() {
      await this.$store.dispatch('fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.message);
        console.error(error);
      });
    },
    computed: {
      id: {
        ...mapGetters({ get: 'servico/id' }),
        ...mapMutations({ set: 'servico/id' }),
      },
      unidade: {
        ...mapGetters({ get: 'servico/unidade' }),
        ...mapMutations({ set: 'servico/unidade' }),
      },
      codigo: {
        ...mapGetters({ get: 'servico/codigo' }),
        ...mapMutations({ set: 'servico/codigo' }),
      },
      nome: {
        ...mapGetters({ get: 'servico/nome' }),
        ...mapMutations({ set: 'servico/nome' }),
      },
      desc: {
        ...mapGetters({ get: 'servico/desc' }),
        ...mapMutations({ set: 'servico/desc' }),
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
