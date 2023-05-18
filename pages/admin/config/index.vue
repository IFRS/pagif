<template>
  <v-container>
    <PageTitle>Configurações</PageTitle>
    <FormSettings
      :submitting="submitting"
      @ok="handleSubmit"
      @cancel="handleCancel"
    />
  </v-container>
</template>

<script>
export default {
  name: 'AdminConfig',
  layout: 'admin',
  validate({ app }) {
    return app.$acl.can('edit', 'Settings');
  },
  data() {
    return {
      submitting: false,
    }
  },
  head: {
    title: 'Configurações',
  },
  unmounted () {
    this.$store.commit('settings/clear');
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
}
</script>
