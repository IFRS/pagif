<template>
  <v-form ref="form" @submit.prevent="handleSubmit()">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            prepend-icon="mdi-text-short"
            label="E-mail"
            hint="E-mail da conta Google para acesso."
            v-model="email"
            :rules="validation.email"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <h3>Permiss&otilde;es por Unidade Gestora</h3>

      <v-row>
        <v-col cols="auto" md="6" lg="4" xl="3" v-for="(unidade, i) in $store.getters['unidades']" :key="i">
          <v-card tag="fieldset">
            <v-card-title tag="legend">{{ unidade.nome }}</v-card-title>
            <v-card-text>
              <v-switch
                v-for="(role, j) in allroles"
                v-model="local_roles[unidade._id]"
                :key="j"
                :label="role.name"
                persistent-hint
                :hint="role.desc"
                :value="role.role"
              ></v-switch>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-alert type="info">
            O <strong>nome</strong> e a <strong>foto</strong> do usuário serão recuperados do Google no primeiro login.
          </v-alert>
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
  import { mapGetters, mapMutations } from 'vuex';
  import allroles from '~/db/roles';

  export default {
    name: 'FormServico',
    async fetch() {
      await this.$store.dispatch('fetchUnidades')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.message);
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
        submitText: this.id ? 'Atualizar' : 'Salvar',
        validation: {
          email: [
            v => !!v || 'E-mail é obrigatório.',
          ],
        },
        allroles: allroles,
        local_roles: {},
      }
    },
    computed: {
      id: {
        ...mapGetters({ get: 'usuario/id' }),
        ...mapMutations({ set: 'usuario/id' }),
      },
      email: {
        ...mapGetters({ get: 'usuario/email' }),
        ...mapMutations({ set: 'usuario/email' }),
      },
      roles: {
        ...mapGetters({ get: 'usuario/roles' }),
        ...mapMutations({ set: 'usuario/roles' }),
      },
    },
    methods: {
      handleSubmit() {
        if (this.$refs.form.validate()) {
          this.roles = this.local_roles;
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
