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
          <v-text-field
            label="Token do PagTesouro"
            hint="Token de acesso gerado no SISGRU."
            v-model="token"
            :rules="validation.token"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="primary"
            type="submit"
          >
            {{ submitText }}
          </v-btn>
          <v-btn
            color="secondary"
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
  let slug = require('slug');

  export default {
    name: 'FormUnidade',
    data() {
      return {
        submitText: this.$store.state.unidades.item._id ? 'Atualizar' : 'Salvar',
        isEditSlug: false,
        validation: {
          nome: [
            v => !!v || 'Nome é obrigatório.',
            v => !(/^\d/).test(v) || 'Nome não pode iniciar com um número.'
          ],
          slug: [],
          token: [
            v => !!v || 'Token é obrigatório.',
            v => !(/\s/).test(v) || 'Token não pode conter espaços.',
          ],
        },
      }
    },
    computed: {
      nome: {
        get() {
          return this.$store.state.unidades.item.nome;
        },
        set(value) {
          this.$store.commit('unidades/updateUnidade', { ...this.$store.state.unidades.item, nome: value });
        }
      },
      slug: {
        get() {
          return this.$store.state.unidades.item.slug;
        },
        set(value) {
          this.$store.commit('unidades/updateUnidade', { ...this.$store.state.unidades.item, slug: value });
        }
      },
      token: {
        get() {
          return this.$store.state.unidades.item.token;
        },
        set(value) {
          this.$store.commit('unidades/updateUnidade', { ...this.$store.state.unidades.item, token: value });
        }
      },
    },
    methods: {
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
