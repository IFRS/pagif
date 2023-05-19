<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Editar Unidade Gestora "{{ $store.getters['unidade/nome'] }}"</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUnidade
          :token-loading="$fetchState.pending"
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
      return app.$acl.can('update', 'Unidade');
    },
    data() {
      return {
        submitting: false,
      }
    },
    async fetch() {
      await this.$store.dispatch('unidade/fetchToken')
      .catch((error) => {
        this.$toast.error('Ocorreu um erro ao buscar o Token da Unidade: ' + error.message);
        console.error(error);
      });
    },
    head: {
      title: 'Edição de Unidade',
    },
    unmounted () {
      this.$store.commit('unidade/clear');
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('unidade/update')
        .then(() => {
          this.$toast.success('Unidade Gestora atualizada com sucesso!');
          this.$router.push({
            path: '/admin/unidades',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao atualizar a Unidade Gestora. ' + error.message);
          console.error(error);
        })
        .finally(() => {
          this.submitting = false;
        });
      },
      handleCancel() {
        this.$toast.info('Edição da Unidade Gestora cancelada.');
        this.$router.push({
          path: '/admin/unidades',
        });
      },
    },
  }
</script>
