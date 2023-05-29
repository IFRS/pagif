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
      <v-row dense>
        <v-col>
          <v-text-field
            v-model="idPagamento"
            label="Código do Pagamento"
            hint="Insira um código de pagamento já cadastrado."
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
import { navigateTo } from '#app';
import { nextTick } from 'vue';
import { useConfigStore } from '~/store/config';

definePageMeta({ title: 'Pagamento' })

const configStore = useConfigStore();

const form = ref(null);
const idPagamento = ref(null);
let validation = ref([]);

function submitPagamento() {
  validation = [
    v => !!v || 'Código do Pagamento é obrigatório.',
    v => (/^[A-Za-z0-9]+$/).test(v) || 'Código do Pagamento só pode conter letras e números.',
  ];

  nextTick(() => {
    if (form.value.validate()) {
      navigateTo({ name: 'pagamento-id', params: { id: idPagamento.value } });
    }
  });
}
</script>
