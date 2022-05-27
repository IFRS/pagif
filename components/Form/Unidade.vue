<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            label="Nome"
            hint="Nome da Unidade"
            v-model="nome"
            :rules="validation.nome"
            required
          ></v-text-field>
          <v-text-field
            label="Slug"
            v-model="slug"
            :rules="validation.slug"
            required
          ></v-text-field>
          <v-text-field
            label="Token"
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
            Salvar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'FormUnidade',
    props: {
      unidadeInicial: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        validation: {
          nome: [
            v => !!v || 'Nome é obrigatório.',
          ],
          slug: [
            v => !!v || 'Slug é obrigatório.',
            v => !(/\s/).test(v) || 'Slug não pode conter espaços.',
            v => (/^[a-z]+$/).test(v) || 'Slug pode conter somente letras.',
          ],
          token: [
            v => !!v || 'Token é obrigatório.',
            v => !(/\s/).test(v) || 'Token não pode conter espaços.',
          ],
        },
        nome: this.unidadeInicial.nome || '',
        slug: this.unidadeInicial.slug || '',
        token: this.unidadeInicial.token || '',
      };
    },
    methods: {
      handleSubmit() {
        this.$emit('salvar', {
          nome: this.nome,
          slug: this.slug,
          token: this.token,
        });
      },
    },
  }
</script>
