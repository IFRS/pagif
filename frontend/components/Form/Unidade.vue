<template>
  <v-form
    ref="formEl"
    @submit.prevent="handleSubmit()"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="nome"
            label="Nome"
            hint="Nome da Unidade Gestora, que será apresentado no pagamento."
            :rules="validation.nome"
            required
            @blur="slugify()"
          />
        </v-col>
      </v-row>
      <v-row
        no-gutters
        align="center"
      >
        <v-col>
          <v-text-field
            ref="slugEl"
            v-model="slug"
            :disabled="!isEditSlug"
            label="Slug"
            hint="O slug é gerado automaticamente usando o nome da Unidade. Se preferir, é possível editá-lo no botão ao lado do campo."
            persistent-hint
            :rules="validation.slug"
            required
          />
        </v-col>
        <v-col
          cols="1"
          sm="auto"
        >
          <v-btn
            v-if="!isEditSlug"
            color="secondary"
            variant="text"
            icon
            @click="editSlug()"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-else
            color="success"
            size="small"
            variant="text"
            @click="slugify()"
          >
            Ok
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model="token"
            label="Token do PagTesouro"
            hint="Token de acesso gerado no SISGRU."
            :rules="validation.token"
            :loading="tokenLoading"
            auto-grow
            required
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          v-if="imagem"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <p class="text-caption text-center">
            Pré-visualização da imagem no site.
          </p>
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 1 : 0"
              rounded="0"
              color="footer"
              class="pa-5"
            >
              <v-img :src="imagem" />
              <v-overlay
                :model-value="isHovering"
                contained
                class="align-center justify-center"
              >
                <v-btn
                  color="transparent"
                  icon
                  block
                  @click="imagem = null"
                >
                  <v-icon
                    color="grey-lighten-3"
                    size="50"
                  >
                    mdi-image-remove
                  </v-icon>
                </v-btn>
              </v-overlay>
            </v-card>
          </v-hover>
        </v-col>
        <v-col v-else>
          <v-file-input
            ref="uploadEl"
            :model-value="arquivo"
            label="Imagem"
            hint="Marca ou Logo da Unidade. Máximo de 1MB."
            persistent-hint
            prepend-icon="mdi-image"
            accept="image/*"
            show-size
            variant="filled"
            @update:model-value="handleUpload"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="link_url"
            label="URL do Link"
            hint="Endereço para site da Unidade."
            :rules="validation.link_url"
          />
        </v-col>
        <v-col>
          <v-text-field
            v-model="link_titulo"
            label="Título do Link"
            hint="Título do link para o site da Unidade."
            :rules="validation.link_titulo"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ClientOnly>
            <VuetifyTiptap
              v-model="contato"
              title="Informações de Contato"
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
import libSlug from 'slug'

defineProps({
  tokenLoading: {
    type: Boolean,
    default: false,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['ok', 'cancel'])

const formEl = ref(null)
const slugEl = ref(null)
const uploadEl = ref(null)

const unidadeStore = useUnidadeStore()

const {
  id,
  nome,
  slug,
  token,
  imagem,
  link_url,
  link_titulo,
  contato,
} = storeToRefs(unidadeStore)

const arquivo = ref(null)
const isEditSlug = ref(false)
const validation = {
  nome: [
    v => !!v || 'Nome é obrigatório.',
    v => !(/^\d/).test(v) || 'Nome não pode iniciar com um número.',
  ],
  token: [
    v => !!v || 'Token é obrigatório.',
    v => !(/\s/).test(v) || 'Token não pode conter espaços.',
  ],
  link_url: [
    v => !v || (/^(https?:\/\/){1}([\da-z.-]+\.[a-z.]{2,6}|[\d.]+)([/:?=&#]{1}[\da-z.-]+)*[/?]?$/igm).test(v) || 'O endereço precisa ser uma URL válida, iniciando com http:// ou https://',
  ],
}

function handleUpload(fileObject) {
  if (fileObject[0]) {
    if (fileObject[0].size > 1000000) {
      uploadEl.value.reset()
      useToast().error('Arquivo excedeu o limite de 1MB de tamanho.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      imagem.value = e.target.result
      uploadEl.value.reset()
    }
    reader.readAsDataURL(fileObject[0])
  }
}

function editSlug() {
  isEditSlug.value = true

  nextTick(() => {
    slugEl.value.focus()
  })
}

function slugify() {
  return new Promise((resolve, reject) => {
    try {
      if (slug.value === undefined || slug.value === '') {
        slug.value = libSlug(nome.value || '')
      } else {
        slug.value = libSlug(slug.value)
      }
      resolve(true)
    } catch (error) {
      reject(error)
    }

    isEditSlug.value = false
  })
}

async function handleSubmit() {
  await slugify()

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
