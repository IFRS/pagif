<template>
  <v-container>
    <PageTitle>Consultar Pagamento para {{ configStore.unidade?.nome }}</PageTitle>

    <v-form
      ref="form"
      lazy-validation
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
        class="required"
      >
        <template #append>
          <v-btn
            type="submit"
            size="x-large"
            variant="text"
            icon
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </template>
      </v-text-field>
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
    if (form.value.validate()) {
      await navigateTo({ name: 'consulta-id', params: { id: idPagamento.value } });
    }
  });
}
</script>
