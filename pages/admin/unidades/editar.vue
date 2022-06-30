<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Editar Unidade Gestora "{{ this.$store.state.admin.unidade.nome }}"</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <FormUnidade @ok="handleSubmit" @cancel="handleCancel" :submitting="submitting"></FormUnidade>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'EditarUnidade',
    layout: 'admin',
    head: {
      title: 'Edição de Unidade',
    },
    data() {
      return {
        submitting: false,
      }
    },
    methods: {
      async handleSubmit() {
        this.submitting = true;
        await this.$store.dispatch('admin/unidade/update')
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
    destroyed () {
      this.$store.commit('admin/unidade/clear');
    },
  }
</script>
