<template>
  <v-menu>
    <template #activator="{ on: menu, attrs }">
      <v-tooltip location="left">
        <template #activator="{ on: tooltip }">
          <v-btn
            class="mr-3"
            color="primary"
            variant="text"
            :loading="!$store.unidades"
            :disabled="!$configStore.unidade"
            v-bind="attrs"
            v-on="{ ...tooltip, ...menu }"
          >
            {{ $configStore.unidade?.nome || 'Selecione uma Unidade' }}
            <v-icon end>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <span>Trocar Unidade</span>
      </v-tooltip>
    </template>
    <v-list v-model:selected="selectedUnidade">
      <v-list-subheader>Unidade Gestora</v-list-subheader>
      <v-list-item
        v-for="(u, i) in $store.unidades"
        :key="i"
        :value="selectedUnidade"
        mandatory
        color="primary"
      >
        <v-list-item-title>{{ u.nome }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { navigateTo, useNuxtApp } from '#app';
import { computed, onUnmounted } from 'vue';

const { $store, $configStore, $toast } = useNuxtApp()

try {
  await $store.fetchUnidades(true);
} catch (error) {
  $toast.error('Ocorreu um erro ao carregar a lista de Unidades: ' + error.message);
  console.error(error);
}

const selectedUnidade = computed({
  get() {
    return $store.unidades.findIndex((item) => {
      return item._id === $configStore.unidade?._id;
    });
  },
  set(index) {
    $configStore.unidade = $store.unidades[index];

    setTimeout(() => {
      navigateTo({ name: 'index' });
    }, 250);
  }
})

onUnmounted(() => {
  $store.clearUnidades();
})
</script>
