<template>
  <v-form
    ref="form"
    @submit.prevent="handleSubmit"
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
          xl="3"
        >
          <v-text-field
            v-model="sigla"
            label="Sigla do Órgão"
            :loading="$fetchState.pending"
            :rules="validation.sigla"
            required
            class="required"
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
          xl="9"
        >
          <v-text-field
            v-model="orgao"
            label="Nome do Órgão"
            :loading="$fetchState.pending"
            :rules="validation.orgao"
            required
            class="required"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <label class="d-inline-block mb-1 font-weight-medium">Introdução</label>
          <tiptap-vuetify
            v-model="intro"
            :disabled="$fetchState.pending"
            :extensions="tiptapExtensions"
            :toolbar-attributes="{ dark: $store.getters['config/darkMode'], color: ($store.getters['config/darkMode']) ? 'dark' : 'grey lighten-4' }"
            :card-props="{ dark: $store.getters['config/darkMode'], loading: $fetchState.pending }"
            placeholder="Texto de Introdução"
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
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  History
} from 'tiptap-vuetify';

export default {
  components: {
    TiptapVuetify,
  },
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
        sigla: [
          v => !!v || 'Sigla é obrigatória.',
          v => !(/^\d/).test(v) || 'Sigla não pode iniciar com um número.'
        ],
        orgao: [
          v => !!v || 'Nome é obrigatório.',
          v => !(/^\d/).test(v) || 'Nome não pode iniciar com um número.'
        ],
      },
      tiptapExtensions: [
        History,
        Paragraph,
        [
          Heading,
          {
            options: {
              levels: [3, 4, 5],
            }
          },
        ],
        Bold,
        Italic,
        Underline,
        Link,
        Blockquote,
        ListItem,
        BulletList,
        OrderedList,
        Code,
      ],
    }
  },
  async fetch() {
    await this.$store.dispatch('settings/show')
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar as Configurações: ' + error.message);
      console.error(error);
    });
  },
  computed: {
    sigla: {
      ...mapGetters({ get: 'settings/sigla' }),
      ...mapMutations({ set: 'settings/sigla' }),
    },
    orgao: {
      ...mapGetters({ get: 'settings/orgao' }),
      ...mapMutations({ set: 'settings/orgao' }),
    },
    intro: {
      ...mapGetters({ get: 'settings/intro' }),
      ...mapMutations({ set: 'settings/intro' }),
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

<style lang="scss" scoped>
.tiptap-vuetify-editor::v-deep {
   .ProseMirror {
    min-height: 200px;
  }
}
</style>
