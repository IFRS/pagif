<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <PageTitle>Escolha uma Unidade para Pagamento</PageTitle>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col
        v-for="(unidade, i) in $store.getters['unidades']"
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
import { definePageMeta, navigateTo } from '#app';
import { useMainStore } from '~/store';
import { useConfigStore } from '~/store/config';

definePageMeta({
  title: 'Escolha uma Unidade',
});

const store = useMainStore();

try {
  await store.fetchUnidades();
} catch (error) {
  this.$toast.error('Ocorreu um erro ao carregar as Unidades: ' + error.message);
  console.error(error);
}

function escolha(unidade) {
  useConfigStore().unidade = unidade;
  navigateTo({ path: this.$route.query.returnPath || '/' });
}
</script>
