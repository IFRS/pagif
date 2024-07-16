<template>
  <v-container>
    <PageTitle>Consultar Pagamento para {{ configStore.unidade?.nome }}</PageTitle>

    <v-form
      ref="form"
      lazy-validation
      class="d-flex flex-nowrap justify-center align-start ga-3"
      @submit.prevent="submitConsulta"
    >
      <v-text-field
        v-model="idPagamento"
        label="Código do Pagamento"
        hint="Insira um código de pagamento em andamento."
        clearable
        variant="filled"
        :rules="validation"
        required
      />
      <v-btn
        type="submit"
        variant="text"
        size="large"
        :rounded="false"
        icon
      >
        <v-icon size="x-large">
          mdi-arrow-right
        </v-icon>
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { useConfigStore } from '~/store/config';

definePageMeta({
  title: 'Consulta Pagamento',
});

const configStore = useConfigStore();
const form = ref(null);
const idPagamento = ref(null);
const validation = ref([]);

function submitConsulta() {
  validation.value = [
    v => !!v || 'Código do Pagamento é obrigatório.',
    v => (/^[A-Za-z0-9]+$/).test(v) || 'Código do Pagamento só pode conter letras e números.',
  ];

  nextTick(async () => {
    const { valid } = await form.value.validate()
    if (valid) {
      await navigateTo({ name: 'consulta-id', params: { id: idPagamento.value } });
    }
  });
}
</script>
