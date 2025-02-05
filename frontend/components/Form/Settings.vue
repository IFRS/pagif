<template>
  <v-form
    ref="formNode"
    @submit.prevent="handleSubmit"
  >
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
          xl="3"
        >
          <v-text-field
            v-model="sigla"
            label="Sigla do Órgão"
            :loading="pending"
            :rules="validation.sigla"
            required
          />
        </v-col>
        <v-col
          cols="12"
          md="8"
          xl="9"
        >
          <v-text-field
            v-model="orgao"
            label="Nome do Órgão"
            :loading="pending"
            :rules="validation.orgao"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ClientOnly>
            <VuetifyTiptap
              v-model="intro"
              title="Texto de Introdução"
              class="mb-3"
            />
          </ClientOnly>
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
            Salvar
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
defineProps({
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['ok', 'cancel'])

const formNode = ref(null)

const validation = {
  sigla: [
    v => !!v || 'Sigla é obrigatória.',
    v => !(/^\d/).test(v) || 'Sigla não pode iniciar com um número.',
  ],
  orgao: [
    v => !!v || 'Nome é obrigatório.',
    v => !(/^\d/).test(v) || 'Nome não pode iniciar com um número.',
  ],
}

const settingsStore = useSettingsStore()
const {
  sigla,
  orgao,
  intro,
} = storeToRefs(settingsStore)

const { readSettings } = useFetchSettings()
const { error, pending } = useAsyncData(() => readSettings())

watch(error, (newError) => {
  useToast().error('Ocorreu um erro ao carregar as Configurações: ' + newError.message)
  console.error(newError)
})

async function handleSubmit() {
  const { valid } = await formNode.value.validate()

  if (valid) {
    emit('ok')
  }
}

function handleCancel() {
  formNode.value.reset()
  emit('cancel')
}
</script>
