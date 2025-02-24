<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-toolbar-title>Administra&ccedil;&atilde;o do Sistema de Pagamentos</v-toolbar-title>

      <v-spacer />

      <DarkMode />
      <UserMenu admin />
    </v-app-bar>
    <v-navigation-drawer
      :rail="miniVariant"
      expand-on-hover
    >
      <v-list nav>
        <v-list-item
          v-for="(item, i) in itemsEnabled"
          :key="i"
          :to="item.to"
          :exact="item.exact || false"
          router
          :prepend-icon="item.icon"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <template #append>
        <v-list>
          <v-list-item
            density="compact"
            :prepend-icon="(miniVariant) ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'"
            @click.stop="miniVariant = !miniVariant"
          >
            <v-list-item-title>{{ (miniVariant) ? 'Expandir menu' : 'Recolher menu' }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main>
      <slot />
      <Toast />
      <v-snackbar
        v-if="loaded"
        :model-value="showNoSettings"
        :timeout="-1"
        location="top"
        multi-line
        vertical
        color="error"
      >
        A <em>sigla</em> e o <em>nome</em> do órgão ainda não foram preenchidos.
        <br>
        Por favor, vá até o menu <NuxtLink
          :to="{ path: '/admin/config' }"
          class="text-white font-weight-bold"
        >Configurações</NuxtLink> para definir esses valores.
      </v-snackbar>
    </v-main>
    <v-footer
      app
      class="bg-surface text-body-2 justify-space-between"
    >
      <span>
        <a
          href="https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro"
          target="_blank"
          class="text-decoration-none text-grey"
          :class="{ 'text-grey-darken-2': !darkMode }"
        >
          PagIF - Sistema de Pagamentos integrado ao PagTesouro
          <v-icon size="x-small">mdi-open-in-new</v-icon>
        </a>
      </span>
      <span>
        <a
          href="https://github.com/IFRS/pagif"
          target="_blank"
          class="text-decoration-none text-grey"
          :class="{ 'text-grey-darken-2': !darkMode }"
        >
          Desenvolvido por Instituto Federal do Rio Grande do Sul
          <v-icon size="x-small">mdi-open-in-new</v-icon>
        </a>
      </span>
    </v-footer>
  </v-app>
</template>

<script setup>
const store = useMainStore()
const configStore = useConfigStore()

const { darkMode, sigla, orgao } = storeToRefs(configStore)

const showNoSettings = computed(() => {
  return useACL().can('manage', 'Settings') && (!sigla || !orgao)
})

const loaded = ref(false)

const miniVariant = ref(false)

const items = [
  {
    icon: 'mdi-apps',
    title: 'Início',
    to: '/admin',
    exact: true,
    enabled: true,
  },
  {
    icon: 'mdi-office-building-marker',
    title: 'Unidades',
    to: '/admin/unidades',
    enabled: useACL().can('read', 'Unidade'),
  },
  {
    icon: 'mdi-basket',
    title: 'Serviços',
    to: '/admin/servicos',
    enabled: useACL().can('read', 'Servico'),
  },
  {
    icon: 'mdi-credit-card-outline',
    title: 'Pagamentos',
    to: '/admin/pagamentos',
    enabled: useACL().can('read', 'Pagamento'),
  },
  {
    icon: 'mdi-account-multiple',
    title: 'Usuários',
    to: '/admin/usuarios',
    enabled: useACL().can('read', 'Usuario'),
  },
  {
    icon: 'mdi-cog',
    title: 'Configurações',
    to: '/admin/config',
    enabled: useACL().can('manage', 'Config'),
  },
]

const itemsEnabled = computed(() => {
  return items.filter((item) => {
    return item.enabled
  })
})

onMounted(() => {
  loaded.value = true
})

onUnmounted(() => {
  store.$reset()
})
</script>
