<template>
  <v-container>
    <PageTitle>Consultar Pagamento para {{ configStore.unidade?.nome }}</PageTitle>

    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="submitConsulta"
    >
      <v-row dense>
        <v-col>
          <v-text-field
            v-model="idPagamento"
            label="Código do Pagamento"
            hint="Insira um código de pagamento em andamento."
            clearable
            variant="filled"
            :rules="validation"
            required
            class="required"
          />
        </v-col>
        <v-col cols="auto">
          <v-btn
            type="submit"
            icon
            size="x-large"
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { navigateTo } from '#app';
import { nextTick } from 'vue';
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
