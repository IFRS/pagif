<template>
  <v-form
    ref="form"
    @submit.prevent="handleSubmit()"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="email"
            prepend-icon="mdi-text-short"
            label="E-mail"
            hint="E-mail da conta Google para acesso."
            :rules="validation.email"
            validate-on="blur"
            :disabled="!!id"
            required
          />
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
          <v-card tag="fieldset">
            <v-card-title tag="legend">
              Permiss&otilde;es Gerais
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-if="$acl.can('manage', 'all')">
                  <strong>Administra&ccedil;&atilde;o</strong>
                  <v-switch
                    v-model="abilities"
                    label="super admin"
                    :value="JSON.stringify({ action: 'manage', subject: 'all' })"
                    :disabled="user_is_me"
                  />
                </v-col>
                <v-col
                  v-for="(actions, subject) in all_abilities.geral"
                  :key="subject"
                >
                  <strong>{{ subject }}</strong>
                  <v-switch
                    v-for="(action, a) in actions"
                    :key="subject + '_' + a"
                    v-model="abilities"
                    :label="action"
                    :value="JSON.stringify({ action: action, subject: subject })"
                    :disabled="user_is_me"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <h3 class="mt-6">
        Permiss&otilde;es por Unidade Gestora
      </h3>

      <v-row>
        <v-col
          v-for="(unidade, i) in $store.getters['unidades']"
          :key="i"
          cols="auto"
          md="6"
          lg="4"
          xl="3"
        >
          <v-card tag="fieldset">
            <v-card-title tag="legend">
              {{ unidade.nome }}
            </v-card-title>
            <v-card-text>
              <v-switch
                v-model="abilities"
                label="read"
                :value="JSON.stringify({ action: 'read', subject: 'Unidade', conditions: { '_id': unidade._id } })"
                :disabled="user_is_me"
              />
              <template
                v-for="(actions, subject) in all_abilities.porUnidade"
                :key="subject"
              >
                <strong>{{ subject }}</strong>
                <v-switch
                  v-for="(action, a) in actions"
                  :key="subject + '_' + i + '_' + a"
                  v-model="abilities"
                  :label="action"
                  :value="JSON.stringify({ action: action, subject: subject, conditions: { 'unidade': unidade._id } })"
                  :disabled="user_is_me"
                />
              </template>
            </v-card-text>
          </v-card>
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
  import all_abilities from '~/db/abilities';

  export default {
    name: 'FormUsuario',
    props: {
      submitting: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['ok', 'cancel'],
    data() {
      return {
        submitText: this.$store.getters['usuario/id'] ? 'Atualizar' : 'Salvar',
        validation: {
          email: [
            v => !!v || 'E-mail é obrigatório.',
            v => !!v || v.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) || 'E-mail precisa ser válido.',
          ],
        },
        all_abilities: all_abilities,
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
      user_is_me() {
        return this.id === this.$store.getters['auth/user']?._id;
      },
      id: {
        ...mapGetters({ get: 'usuario/id' }),
        ...mapMutations({ set: 'usuario/id' }),
      },
      email: {
        ...mapGetters({ get: 'usuario/email' }),
        ...mapMutations({ set: 'usuario/email' }),
      },
      abilities: {
        ...mapGetters({ get: 'usuario/abilities' }),
        ...mapMutations({ set: 'usuario/abilities' }),
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
