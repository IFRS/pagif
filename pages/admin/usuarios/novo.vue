<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Usu&aacute;rio</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUsuario @ok="handleSubmit" @cancel="handleCancel" :submitting="submitting"></FormUsuario>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'NovoUsuario',
    layout: 'admin',
    head: {
      title: 'Cadastro de Novo Usuário',
    },
    data() {
      return {
        submitting: false,
      }
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('usuario/save')
        .then(() => {
          this.$toast.success('Usuário cadastrado com sucesso!');
          this.$router.push({
            path: '/admin/usuarios',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao cadastrar o Usuário. ' + error.message);
          console.error(error);
        })
        .finally(() => {
          this.submitting = false;
        });
      },
      handleCancel() {
        this.$toast.info('Cadastro de Usuário cancelado.');
        this.$router.push({
          path: '/admin/usuarios',
        });
      },
    },
    destroyed () {
      this.$store.commit('usuario/clear');
    },
    validate({ app }) {
      return app.$acl.can('create', 'Usuario');
    },
  }
</script>
