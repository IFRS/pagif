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
          :to="item.to"
          :exact="item.exact || false"
          router
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
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
              <v-icon>{{ (miniVariant) ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <Nuxt />
      <Toast />
    </v-main>
    <v-footer app class="text-body-2 justify-space-between">
      <span><a href="https://www.gov.br/tesouronacional/pt-br/gru-e-pag-tesouro/pagtesouro" class="text-decoration-none grey--text text--darken-2">Sistema Integrado ao PagTesouro</a></span>
      <span><a href="https://ifrs.edu.br/" class="text-decoration-none grey--text text--darken-2">Desenvolvido por Instituto Federal do Rio Grande do Sul</a></span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'AdminLayout',
  data () {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Início',
          to: '/admin',
          exact: true,
        },
        {
          icon: 'mdi-office-building-marker',
          title: 'Unidades',
          to: '/admin/unidades',
        },
        {
          icon: 'mdi-basket',
          title: 'Serviços',
          to: '/admin/servicos',
        },
        {
          icon: 'mdi-credit-card-outline',
          title: 'Pagamentos',
          to: '/admin/pagamentos',
        },
      ],
      miniVariant: false,
      title: 'IFpag',
    };
  },
};
</script>
