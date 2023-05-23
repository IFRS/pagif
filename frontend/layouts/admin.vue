<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :rail="miniVariant"
    >
      <v-list>
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
        <v-list density="compact">
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
    <v-app-bar>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Administração do Sistema de Pagamentos</v-toolbar-title>

      <v-spacer />

      <DarkMode />
      <UserMenu admin />
    </v-app-bar>
    <v-main>
      <slot />
      <Toast />
    </v-main>
    <v-footer
      app
      class="text-body-2 justify-space-between"
    >
      <span><a
        href="https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro"
        class="text-decoration-none text-grey"
        :class="{ 'text--darken-2': !$store.getters['config/darkMode'] }"
      >PagIF - Sistema de Pagamentos integrado ao PagTesouro</a></span>
      <span><a
        href="https://ifrs.edu.br/"
        class="text-decoration-none text-grey"
        :class="{ 'text--darken-2': !$store.getters['config/darkMode'] }"
      >Desenvolvido por Instituto Federal do Rio Grande do Sul</a></span>
    </v-footer>
    <v-snackbar
      v-if="loaded"
      :model-value="$acl.can('manage', 'Settings') && (!$store.getters['config/sigla'] || !$store.getters['config/orgao'])"
      :timeout="-1"
      location="top"
      multi-line
      vertical
      color="error"
    >
      A <em>sigla</em> e o <em>nome</em> do órgão ainda não foram preenchidos.
      <br>
      Por favor, vá até o menu <NuxtLink
        :to="{ name: 'admin-config' }"
        class="text-white font-weight-bold"
      >
        Configurações
      </NuxtLink> para definir esses valores.
    </v-snackbar>
    <v-overlay :model-value="!loaded">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  middleware: ['auth'],
  data () {
    return {
      loaded: false,
      drawer: true,
      miniVariant: false,
      items: [
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
          enabled: this.$acl.can('read', 'Unidade'),
        },
        {
          icon: 'mdi-basket',
          title: 'Serviços',
          to: '/admin/servicos',
          enabled: this.$acl.can('read', 'Servico'),
        },
        {
          icon: 'mdi-credit-card-outline',
          title: 'Pagamentos',
          to: '/admin/pagamentos',
          enabled: this.$acl.can('read', 'Pagamento'),
        },
        {
          icon: 'mdi-account-multiple',
          title: 'Usuários',
          to: '/admin/usuarios',
          enabled: this.$acl.can('read', 'Usuario'),
        },
        {
          icon: 'mdi-cog',
          title: 'Configurações',
          to: '/admin/config',
          enabled: this.$acl.can('manage', 'Config'),
        },
      ],
    }
  },
  computed: {
    itemsEnabled() {
      return this.items.filter((item) => {
        return item.enabled;
      })
    },
  },
  mounted () {
    this.loaded = true;
  },
  unmounted () {
    this.$store.commit('clearUnidades');
    this.$store.commit('clearServicos');
    this.$store.commit('clearPagamentos');
    this.$store.commit('clearUsuarios');
  },
};
</script>
