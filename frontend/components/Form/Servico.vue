<template>
  <v-form
    ref="formEl"
    @submit.prevent="handleSubmit()"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="unidade"
            prepend-icon="mdi-office-building-marker"
            label="Unidade Gestora"
            :rules="validation.unidade"
            :loading="pending"
            :disabled="pending"
            :items="store.unidades"
            item-title="nome"
            item-value="_id"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="4"
          lg="3"
        >
          <v-text-field
            v-model="codigo"
            prepend-icon="mdi-identifier"
            label="Código do Serviço"
            hint="Deve existir no cadastro de serviços da UG e não estar excluído."
            :rules="validation.codigo"
            :counter="5"
            required
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="nome"
            prepend-icon="mdi-text-short"
            label="Nome"
            hint="Nome do Serviço, que será apresentado no pagamento."
            :rules="validation.nome"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model="desc"
            label="Descrição"
            :rules="validation.desc"
            prepend-icon="mdi-text"
            :counter="999"
            rows="9"
          />
        </v-col>
      </v-row>
      <v-row
        justify="start"
        dense
      >
        <v-col cols="auto">
          <v-btn
            color="primary"
            type="submit"
            :loading="submitting"
            :disabled="submitting"
          >
            {{ id ? 'Atualizar' : 'Salvar' }}
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            color="secondary"
            :disabled="submitting"
            @click="handleCancel()"
          >
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import useToast from '~/composables/useToast'
import { useMainStore } from '~/store'
import { useServicoStore } from '~/store/servico'

defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['ok', 'cancel'])

const formEl = ref(null)

const store = useMainStore()
const { error, pending } = await store.fetchUnidades()
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.message);
  console.error(error);
}

const servicoStore = useServicoStore()
const {
  id,
  unidade,
  codigo,
  nome,
  desc,
} = storeToRefs(servicoStore)

const validation = {
  unidade: [
    v => !!v || 'Selecione uma Unidade Gestora.',
  ],
  codigo: [
    v => !!v || 'Código do Serviço é obrigatório.',
    v => (/^\d+$/).test(v) || 'Código do Serviço precisa ser um número.',
    v => v?.toString().length <= 5 || 'Código do Serviço deve ter no máximo 5 dígitos.',
  ],
  nome: [
    v => !!v || 'Nome é obrigatório.',
  ],
  desc: [
    v => (!v || v?.length <= 999) || 'Descrição deve ter até 999 caracteres.',
  ],
}

async function handleSubmit() {
  const { valid } = await formEl.value.validate()

  if (valid) {
    emit('ok')
  }
}

function handleCancel() {
  formEl.value.reset()
  emit('cancel')
}
</script>
