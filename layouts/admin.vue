<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          v-if="item.enabled"
          :to="item.to"
          :exact="item.exact || false"
          router
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template slot="append">
        <v-list dense>
          <v-list-item
            dense
            @click.stop="miniVariant = !miniVariant"
          >
            <v-list-item-icon>
              <v-icon>{{ (miniVariant) ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left' }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="(miniVariant) ? 'Expandir menu' : 'Recolher menu'"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Administração do Sistema de Pagamentos</v-toolbar-title>

      <v-spacer></v-spacer>

      <DarkMode></DarkMode>
      <UserMenu admin></UserMenu>
    </v-app-bar>
    <v-main>
      <Nuxt></Nuxt>
      <Toast></Toast>
    </v-main>
    <v-footer app class="text-body-2 justify-space-between">
      <span><a href="https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro" class="text-decoration-none grey--text" :class="{ 'text--darken-2': !$store.getters['config/darkMode'] }">PagIF - Sistema de Pagamentos integrado ao PagTesouro</a></span>
      <span><a href="https://ifrs.edu.br/" class="text-decoration-none grey--text" :class="{ 'text--darken-2': !$store.getters['config/darkMode'] }">Desenvolvido por Instituto Federal do Rio Grande do Sul</a></span>
    </v-footer>
    <v-snackbar
      v-if="loaded"
      :value="$acl.can('manage', 'Settings') && (!$store.getters['config/sigla'] || !$store.getters['config/orgao'])"
      :timeout="-1"
      app
      top
      right
      multi-line
      vertical
      color="error"
    >
      A <em>sigla</em> e o <em>nome</em> do órgão ainda não foram preenchidos.
      <br>
      Por favor, vá até o menu <nuxt-link :to="{ name: 'admin-config' }" class="white--text font-weight-bold">Configurações</nuxt-link> para definir esses valores.
    </v-snackbar>
    <v-overlay :value="!loaded">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
export default {
  name: 'AdminLayout',
  middleware: ['auth', 'dark-mode'],
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
  mounted () {
    this.loaded = true;
  },
  destroyed () {
    this.$store.commit('clearUnidades');
    this.$store.commit('clearServicos');
    this.$store.commit('clearPagamentos');
    this.$store.commit('clearUsuarios');
  },
};
</script>
