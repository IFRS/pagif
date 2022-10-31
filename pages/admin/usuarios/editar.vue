<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Novo Usu&aacute;rio</h2>
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
    name: 'EditarUsuario',
    layout: 'admin',
    head: {
      title: 'Edição de Usuário',
    },
    data() {
      return {
        submitting: false,
      }
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
    destroyed () {
      this.$store.commit('usuario/clear');
    },
  }
</script>
