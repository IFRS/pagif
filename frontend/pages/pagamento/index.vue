<template>
  <v-container>
    <PageTitle>Pagamento para {{ configStore.unidade?.nome }}</PageTitle>

    <h3 class="mb-4 text-center">
      J&aacute; tenho o c&oacute;digo para Pagamento
    </h3>
    <v-form
      ref="form"
      lazy-validation
      class="mb-12 d-flex flex-nowrap justify-center align-start ga-3"
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

    <div class="text-center">
      <h3 class="separador">
        <span>ou, realizar um pagamento manualmente</span>
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
import { useConfigStore } from '~/store/config'
import colors from 'vuetify/util/colors'

useHeadSafe({
  title: 'Pagamento',
})

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
    const { valid } = await form.value.validate()
    if (valid) {
      await navigateTo({ name: 'pagamento-id', params: { id: idPagamento.value } })
    }
  });
}
</script>

<style lang="scss" scoped>
.separador {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  > span {
    flex: 1 0 auto;
  }

  &::before,
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: v-bind('colors.grey.lighten1');
    flex: 0 2 auto;
  }
}
</style>
