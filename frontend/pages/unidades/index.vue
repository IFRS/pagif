<template>
  <v-container>
    <PageTitle>Escolha uma Unidade para Pagamento</PageTitle>

    <v-btn-group
      color="primary"
      variant="tonal"
      rounded="pill"
    >
      <v-btn
        v-for="(unidade, i) in store.unidades"
        :key="i"
        size="x-large"
        rounded="0"
        @click="escolha(unidade)"
      >
        {{ unidade.nome }}
      </v-btn>
    </v-btn-group>
  </v-container>
</template>

<script setup>
import { useMainStore } from '~/store';
import { useConfigStore } from '~/store/config';

useHeadSafe({
  title: 'Escolha uma Unidade',
});

const store = useMainStore();
const configStore = useConfigStore();

const { error } = await store.fetchUnidades(true);
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades.');
  console.error(error);
}

const route = useRoute();
async function escolha(unidade) {
  configStore.unidade = unidade;
  await navigateTo({ path: route.query.returnPath || '/' });
}
</script>
