<template>
  <v-form ref="form" @submit.prevent="handleSubmit()">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            label="Nome"
            hint="Nome da Unidade Gestora, que será apresentado no pagamento."
            v-model="nome"
            :rules="validation.nome"
            required
            @blur="slugify()"
          ></v-text-field>
          <v-row no-gutters align="center">
            <v-col>
              <v-text-field
                :disabled="!isEditSlug"
                label="Slug"
                hint="O slug é gerado automaticamente usando o nome da Unidade. Se preferir, é possível editá-lo no botão ao lado do campo."
                persistent-hint
                v-model="slug"
                ref="slug"
                :rules="validation.slug"
                required
              >
              </v-text-field>
            </v-col>
            <v-col cols="1" sm="auto">
              <v-btn
                v-if="!isEditSlug"
                color="secondary"
                icon
                @click="editSlug()"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-else
                color="success"
                small
                text
                @click="slugify()"
              >
                Ok
              </v-btn>
            </v-col>
          </v-row>
          <v-textarea
            label="Token do PagTesouro"
            hint="Token de acesso gerado no SISGRU."
            v-model="token"
            :rules="validation.token"
            :loading="tokenLoading"
            auto-grow
            required
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col v-if="imagem" cols="2">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 1 : 0"
            >
              <v-img
                :src="imagem"
                contain
              ></v-img>
              <v-btn
                v-show="hover"
                absolute
                right
                bottom
                icon
                large
                color="transparent"
                style="transform: translate(50%, 50%);"
                @click="imagem = null"
              >
                <v-icon color="error">
                  mdi-close-circle
                </v-icon>
              </v-btn>
            </v-card>
          </v-hover>
        </v-col>
        <v-col v-else>
          <v-file-input
            ref="upload"
            :value="arquivo"
            label="Imagem"
            hint="Marca ou Logo da Unidade. Máximo de 1MB."
            persistent-hint
            prepend-icon="mdi-image"
            accept="image/*"
            show-size
            filled
            @change="handleUpload"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="link_url"
            label="URL do Link"
            hint="Endereço para site da Unidade."
            :rules="validation.link_url"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="link_titulo"
            label="Título do Link"
            hint="Título do link para o site da Unidade."
            :rules="validation.link_titulo"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <tiptap-vuetify
            v-model="contato"
            :extensions="tiptapExtensions"
            :toolbar-attributes="{ dark: $store.getters['config/darkMode'], color: ($store.getters['config/darkMode']) ? 'dark' : 'grey lighten-4' }"
            :card-props="{ dark: $store.getters['config/darkMode'] }"
            placeholder="Informações de Contato"
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
  let slug = require('slug');
  import {
    TiptapVuetify,
    Heading,
    Bold,
    Italic,
    Underline,
    Paragraph,
    BulletList,
    OrderedList,
    ListItem,
    Link,
    Blockquote,
    History
  } from 'tiptap-vuetify';

  export default {
    name: 'FormUnidade',
    components: {
      TiptapVuetify,
    },
    props: {
      tokenLoading: {
        type: Boolean,
        default: false,
      },
      submitting: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        arquivo: null,
        submitText: this.id ? 'Atualizar' : 'Salvar',
        isEditSlug: false,
        validation: {
          nome: [
            v => !!v || 'Nome é obrigatório.',
            v => !(/^\d/).test(v) || 'Nome não pode iniciar com um número.'
          ],
          token: [
            v => !!v || 'Token é obrigatório.',
            v => !(/\s/).test(v) || 'Token não pode conter espaços.',
          ],
          link_url: [
            v => !v || (/^(https?:\/\/){1}([\da-z\.-]+\.[a-z\.]{2,6}|[\d\.]+)([\/:?=&#]{1}[\da-z\.-]+)*[\/\?]?$/igm).test(v) || 'O endereço precisa ser uma URL válida, iniciando com http:// ou https://',
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
        ],
      }
    },
    computed: {
      id: {
        ...mapGetters({ get: 'unidade/id' }),
        ...mapMutations({ set: 'unidade/id' }),
      },
      nome: {
        ...mapGetters({ get: 'unidade/nome' }),
        ...mapMutations({ set: 'unidade/nome' }),
      },
      slug: {
        ...mapGetters({ get: 'unidade/slug' }),
        ...mapMutations({ set: 'unidade/slug' }),
      },
      token: {
        ...mapGetters({ get: 'unidade/token' }),
        ...mapMutations({ set: 'unidade/token' }),
      },
      imagem: {
        ...mapGetters({ get: 'unidade/imagem' }),
        ...mapMutations({ set: 'unidade/imagem' }),
      },
      link_url: {
        ...mapGetters({ get: 'unidade/link_url' }),
        ...mapMutations({ set: 'unidade/link_url' }),
      },
      link_titulo: {
        ...mapGetters({ get: 'unidade/link_titulo' }),
        ...mapMutations({ set: 'unidade/link_titulo' }),
      },
      contato: {
        ...mapGetters({ get: 'unidade/contato' }),
        ...mapMutations({ set: 'unidade/contato' }),
      },
    },
    methods: {
      handleUpload(fileObject) {
        if (fileObject) {
          if (fileObject.size > 1000000) {
            this.$refs.upload.reset();
            this.$toast.error('Arquivo excedeu o limite de 1MB de tamanho.');
            return;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagem = e.target.result;
            this.$refs.upload.reset();
          };
          reader.readAsDataURL(fileObject);
        }
      },
      editSlug() {
        this.isEditSlug = true;
        setTimeout(() => {
          this.$refs.slug.$refs.input.focus();
        }, 100);
      },
      slugify() {
        if (this.slug === undefined || this.slug === '') {
          this.slug = slug(this.nome || '');
        } else {
          this.slug = slug(this.slug);
        }
        this.isEditSlug = false;
      },
      handleSubmit() {
        this.slugify();
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
