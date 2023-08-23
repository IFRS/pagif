<template>
  <v-container>
    <PagamentoDetalhes :loading="pending">
      <v-btn
        color="primary"
        variant="plain"
        :to="{ name: 'consulta' }"
      >
        Voltar
      </v-btn>
    </PagamentoDetalhes>
  </v-container>
</template>

<script setup>
import { useRoute } from '#app';
import { usePagamentoStore } from '~/store/pagamento';


const pagamentoStore = usePagamentoStore();
const route = useRoute();
const { pending, error } = await pagamentoStore.show_public(route.params.id);

if (error.value) {
  useToast().error('Ocorreu um erro ao buscar o Pagamento.');
  console.error(error.value);
  await navigateTo({ name: 'consulta' });
}

onUnmounted(() => {
  pagamentoStore.$reset();
})
</script>
