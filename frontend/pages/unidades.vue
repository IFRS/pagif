<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <PageTitle>Escolha uma Unidade para Pagamento</PageTitle>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col
        v-for="(unidade, i) in store.unidades"
        :key="i"
      >
        <v-btn
          size="x-large"
          @click="escolha(unidade)"
        >
          {{ unidade.nome }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { navigateTo } from '#app';
import { useMainStore } from '~/store';
import { useConfigStore } from '~/store/config';

definePageMeta({
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
function escolha(unidade) {
  configStore.unidade = unidade;
  navigateTo({ path: route.query.returnPath || '/' });
}
</script>
