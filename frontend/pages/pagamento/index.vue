<template>
  <v-container>
    <PageTitle>Pagamento para {{ configStore.unidade?.nome }}</PageTitle>

    <h3 class="mb-4 text-center">
      J&aacute; tenho o c&oacute;digo para Pagamento
    </h3>
    <v-form
      ref="form"
      class="mb-8"
      lazy-validation
      @submit.prevent="submitPagamento"
    >
      <v-text-field
        v-model="idPagamento"
        label="Código do Pagamento"
        hint="Insira um código de pagamento já cadastrado."
        clearable
        variant="filled"
        :rules="validation"
        required
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

    <div class="text-center">
      <h3 class="mb-4">
        ou, realizar um pagamento manualmente
      </h3>
      <v-btn
        class="mx-auto"
        size="x-large"
        color="primary"
        :to="{ name: 'pagamento-novo' }"
      >
        Novo Pagamento
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { useConfigStore } from '~/store/config';

definePageMeta({ title: 'Pagamento' })

const configStore = useConfigStore();

const form = ref(null);
const idPagamento = ref(null);
const validation = ref([]);

function submitPagamento() {
  validation.value = [
    v => !!v || 'Código do Pagamento é obrigatório.',
    v => (/^[A-Za-z0-9]+$/).test(v) || 'Código do Pagamento só pode conter letras e números.',
  ];

  nextTick(async () => {
    if (form.value.validate()) {
      await navigateTo({ name: 'pagamento-id', params: { id: idPagamento.value } });
    }
  });
}
</script>
