<template>
  <v-form
    ref="form"
    @submit.prevent="handleSubmit()"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="nome"
            label="Nome"
            hint="Nome da Unidade Gestora, que será apresentado no pagamento."
            :rules="validation.nome"
            required
            @blur="slugify()"
          />
          <v-row
            no-gutters
            align="center"
          >
            <v-col>
              <v-text-field
                ref="slug"
                v-model="slug"
                :disabled="!isEditSlug"
                label="Slug"
                hint="O slug é gerado automaticamente usando o nome da Unidade. Se preferir, é possível editá-lo no botão ao lado do campo."
                persistent-hint
                :rules="validation.slug"
                required
              />
            </v-col>
            <v-col
              cols="1"
              sm="auto"
            >
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
                size="small"
                variant="text"
                @click="slugify()"
              >
                Ok
              </v-btn>
            </v-col>
          </v-row>
          <v-textarea
            v-model="token"
            label="Token do PagTesouro"
            hint="Token de acesso gerado no SISGRU."
            :rules="validation.token"
            :loading="tokenLoading"
            auto-grow
            required
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          v-if="imagem"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <p class="text-caption text-center">
            Pré-visualização da imagem no site.
          </p>
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 1 : 0"
              rounded="0"
              color="footer"
              class="pa-5"
            >
              <v-img :src="imagem" />
              <v-overlay
                absolute
                :model-value="hover"
              >
                <v-btn
                  v-show="hover"
                  icon
                  min-width="100%"
                  min-height="100%"
                  color="transparent"
                  @click="imagem = null"
                >
                  <v-icon
                    color="grey-lighten-3"
                    size="50"
                  >
                    mdi-image-remove
                  </v-icon>
                </v-btn>
              </v-overlay>
            </v-card>
          </v-hover>
        </v-col>
        <v-col v-else>
          <v-file-input
            ref="upload"
            :model-value="arquivo"
            label="Imagem"
            hint="Marca ou Logo da Unidade. Máximo de 1MB."
            persistent-hint
            prepend-icon="mdi-image"
            accept="image/*"
            show-size
            variant="filled"
            @change="handleUpload"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="link_url"
            label="URL do Link"
            hint="Endereço para site da Unidade."
            :rules="validation.link_url"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="link_titulo"
            label="Título do Link"
            hint="Título do link para o site da Unidade."
            :rules="validation.link_titulo"
          />
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
  const slug = require('slug');
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
    emits: ['ok', 'cancel'],
    data() {
      return {
        arquivo: null,
        submitText: this.$store.getters['unidade/id'] ? 'Atualizar' : 'Salvar',
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

<style lang="scss" scoped>
.tiptap-vuetify-editor::v-deep {
   .ProseMirror {
    min-height: 200px;
  }
}
</style>
