<template>
  <v-form
    ref="formNode"
    @submit.prevent="handleSubmit()"
  >
    <v-container>
      <v-row>
        <v-col>
          <v-text-field
            v-model="email"
            prepend-icon="mdi-text-short"
            label="E-mail"
            hint="E-mail da conta Google para acesso."
            :rules="validation.email"
            validate-on="blur"
            :disabled="!!_id"
            required
          />
        </v-col>
        <v-col v-if="foto && nome">
          <v-list-item>
            <template #prepend>
              <v-avatar
                :image="foto"
              />
            </template>
            <v-list-item-title class="font-weight-bold">
              {{ nome }}
            </v-list-item-title>
          </v-list-item>
        </v-col>
      </v-row>

      <v-row v-if="!foto && !nome">
        <v-col>
          <v-alert
            type="info"
            variant="text"
          >
            O <strong>nome</strong> e a <strong>foto</strong> do usuário serão recuperados do <em>Google</em> no primeiro login.
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <h3 class="mb-3">
            Permiss&otilde;es Gerais
          </h3>
          <v-card tag="fieldset">
            <v-card-text>
              <v-row>
                <v-col v-if="useACL().can('manage', 'all')">
                  <strong>Administra&ccedil;&atilde;o</strong>
                  <v-switch
                    v-model="abilities"
                    label="super admin"
                    :value="JSON.stringify({ action: 'manage', subject: 'all' })"
                    :disabled="user_is_me"
                    color="success"
                  />
                </v-col>
                <v-col
                  v-for="(actions, subject) in all_abilities.geral"
                  :key="subject"
                >
                  <strong>{{ subject }}</strong>
                  <v-switch
                    v-for="(action, a) in actions"
                    :key="subject + '_' + a"
                    v-model="abilities"
                    :label="action"
                    :value="JSON.stringify({ action: action, subject: subject })"
                    :disabled="user_is_me"
                    color="accent"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <h3 class="mt-6 mb-3">
        Permiss&otilde;es por Unidade Gestora
      </h3>

      <v-progress-linear
        v-if="pending"
        indeterminate
        color="primary"
      />

      <v-expansion-panels
        v-else
        variant="accordion"
        class="mb-6"
      >
        <v-expansion-panel
          v-for="(unidade, i) in store.unidades"
          :key="i"
        >
          <v-expansion-panel-title>
            <h4>{{ unidade.nome }}</h4>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-switch
              v-model="abilities"
              label="read"
              :value="JSON.stringify({ action: 'read', subject: 'Unidade', conditions: { _id: unidade._id } })"
              :disabled="user_is_me"
              color="primary"
            />
            <v-row>
              <template
                v-for="(actions, subject) in all_abilities.porUnidade"
                :key="subject"
              >
                <v-col>
                  <strong>{{ subject }}</strong>
                  <v-switch
                    v-for="(action, a) in actions"
                    :key="subject + '_' + i + '_' + a"
                    v-model="abilities"
                    :label="action"
                    :value="JSON.stringify({ action: action, subject: subject, conditions: { unidade: unidade._id } })"
                    :disabled="user_is_me"
                    color="primary"
                  />
                </v-col>
              </template>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

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
            {{ _id ? 'Atualizar' : 'Salvar' }}
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
  email: [
    v => !!v || 'E-mail é obrigatório.',
    v => !!v || v.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) || 'E-mail precisa ser válido.',
  ],
}

const all_abilities = {
  geral: {
    Usuario: [
      'create',
      'read',
      'update',
      'delete',
    ],
    Unidade: [
      'create',
      'read',
      'update',
      'delete',
    ],
  },
  porUnidade: {
    Servico: [
      'create',
      'read',
      'update',
      'delete',
    ],
    Pagamento: [
      'create',
      'read',
      'update',
      'delete',
    ],
  },
}

const store = useMainStore()
const authStore = useAuthStore()
const usuarioStore = useUsuarioStore()

const {
  _id,
  email,
  nome,
  foto,
} = storeToRefs(usuarioStore)

const abilities = computed({
  get() {
    return usuarioStore.getAbilities
  },
  set(value) {
    usuarioStore.setAbilities(value)
  },
})

const { error, pending } = await store.fetchUnidades()
if (error.value) {
  useToast().error('Ocorreu um erro ao carregar as Unidades Gestoras: ' + error.value.message)
  console.error(error)
}

const user_is_me = computed(() => (_id === authStore.user?.id))

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
