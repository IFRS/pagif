<template>
  <v-form  ref="form" @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" xl="3">
          <v-text-field
            v-model="sigla"
            label="Sigla do Órgão"
            :rules="validation.sigla"
            required
            class="required"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="8" xl="9">
          <v-text-field
            v-model="nome"
            label="Nome do Órgão"
            :rules="validation.nome"
            required
            class="required"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>Introdução</h3>
          <tiptap-vuetify v-model="intro" :extensions="tiptapExtensions" :card-props="tiptapCardProps" placeholder="Texto de Introdução"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>Contato</h3>
          <tiptap-vuetify v-model="contato" :extensions="tiptapExtensions" :card-props="tiptapCardProps" placeholder="Informações de Contato"/>
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
  name: 'FormSettings',
  components: {
    TiptapVuetify,
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
        sigla: [
          v => !!v || 'Sigla é obrigatória.',
          v => !(/^\d/).test(v) || 'Sigla não pode iniciar com um número.'
        ],
        nome: [
          v => !!v || 'Nome é obrigatório.',
          v => !(/^\d/).test(v) || 'Nome não pode iniciar com um número.'
        ],
      },
      tiptapCardProps: {
        minHeight: '100',
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
  computed: {
    sigla: {
      ...mapGetters({ get: 'settings/sigla' }),
      ...mapMutations({ set: 'settings/sigla' }),
    },
    nome: {
      ...mapGetters({ get: 'settings/nome' }),
      ...mapMutations({ set: 'settings/nome' }),
    },
    intro: {
      ...mapGetters({ get: 'settings/intro' }),
      ...mapMutations({ set: 'settings/intro' }),
    },
    contato: {
      ...mapGetters({ get: 'settings/contato' }),
      ...mapMutations({ set: 'settings/contato' }),
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
