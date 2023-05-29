<template>
  <v-form
    ref="form"
    v-bind="$attrs"
  >
    <v-text-field
      prepend-icon="mdi-office-building-marker"
      label="Unidade"
      disabled
      :model-value="configStore.unidade?.nome"
    />

    <v-autocomplete
      v-model="servico"
      prepend-icon="mdi-basket"
      label="Serviço"
      no-data-text="Nenhum Serviço encontrado na Unidade atual."
      :rules="validation"
      :loading="pending"
      :disabled="pending"
      :items="store.servicos"
      :item-title="item => `${item.nome} (${item.codigo})`"
      :item-value="item => ({ codigo: item.codigo, nome: item.nome })"
      required
      class="required"
    />
  </v-form>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useMainStore } from '~/store';
import { useConfigStore } from '~/store/config';
import { usePagamentoStore } from '~/store/pagamento';


const validation = [
  v => !!v || 'Selecione um Serviço.',
  v => (v === Object(v) && !!v.codigo && !!v.nome) || 'Selecione um Serviço.',
]

const store = useMainStore();
const configStore = useConfigStore()
const { pending, error } = await store.fetchServicos({ isPublic: true, unidade: this.$store.getters['config/unidade']?._id })
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar os Serviços.');
  console.error(error);
}

const { codigoServico, nomeServico } = storeToRefs(usePagamentoStore())

const servico = computed({
  get() {
    return { codigo: codigoServico, nome: nomeServico };
  },
  set(value) {
    codigoServico = value?.codigo;
    nomeServico = value?.nome;
  }
})
</script>
