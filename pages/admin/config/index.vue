<template>
  <v-container>
    <PageTitle>Configurações</PageTitle>
    <FormSettings @ok="handleSubmit" @cancel="handleCancel" :submitting="submitting"></FormSettings>
  </v-container>
</template>

<script>
export default {
  name: 'AdminConfig',
  layout: 'admin',
  head: {
    title: 'Configurações',
  },
  data() {
    return {
      submitting: false,
    }
  },
  methods: {
    async handleSubmit() {
      this.submitting = true;
      await this.$store.dispatch('settings/save')
      .then(() => {
        this.$toast.success('Configurações salvas com sucesso!');
      })
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao salvar as Configurações. ' + error.message);
        console.error(error);
      })
      .finally(() => {
        this.submitting = false;
      });
    },
    handleCancel() {
      this.$toast.info('Edição das Configurações cancelada.');
      this.$router.push({ path: '/admin' });
    },
  },
  destroyed () {
    this.$store.commit('settings/clear');
  },
  validate({ app }) {
    return app.$acl.can('edit', 'Settings');
  },
}
</script>
