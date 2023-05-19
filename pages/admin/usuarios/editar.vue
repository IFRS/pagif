<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Novo Usu&aacute;rio</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUsuario
          :submitting="submitting"
          @ok="handleSubmit"
          @cancel="handleCancel"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    layout: 'admin',
    validate({ app }) {
      return app.$acl.can('update', 'Usuario');
    },
    data() {
      return {
        submitting: false,
      }
    },
    head: {
      title: 'Edição de Usuário',
    },
    unmounted () {
      this.$store.commit('usuario/clear');
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('usuario/update')
        .then(() => {
          this.$toast.success('Usuário atualizado com sucesso!');
          this.$router.push({
            path: '/admin/usuarios',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao atualizar o Usuário. ' + error.message);
          console.error(error);
        })
        .finally(() => {
          this.submitting = false;
        });
      },
      handleCancel() {
        this.$toast.info('Edição do Usuário cancelada.');
        this.$router.push({
          path: '/admin/usuarios',
        });
      },
    },
  }
</script>
