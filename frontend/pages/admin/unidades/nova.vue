<template>
  <v-container>
    <v-row>
      <v-col>
        <PageTitle>Nova Unidade Gestora</PageTitle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUnidade
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
      return app.$acl.can('create', 'Unidade');
    },
    data() {
      return {
        submitting: false,
      }
    },
    head: {
      title: 'Cadastro de Nova Unidade',
    },
    unmounted () {
      this.$store.commit('unidade/clear');
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('unidade/save')
        .then(() => {
          this.$toast.success('Unidade Gestora cadastrada com sucesso!');
          this.$router.push({
            path: '/admin/unidades',
          });
        })
        .catch((error) => {
          this.$toast.error('Ocorreu um erro ao cadastrar a Unidade Gestora. ' + error.message);
          console.error(error);
        })
        .finally(() => {
          this.submitting = false;
        });
      },
      handleCancel() {
        this.$toast.info('Cadastro de Unidade Gestora cancelado.');
        this.$router.push({
          path: '/admin/unidades',
        });
      },
    },
  }
</script>
