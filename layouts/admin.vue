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
      <v-snackbar
        ref="snackbar"
        v-model="snackbarShow"
        :timeout="5000"
        :color="$store.state.snackbar.color"
        :multi-line="true"
      >
        <v-icon left>{{ $store.state.snackbar.icon }}</v-icon>
        {{ $store.state.snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="snackbarShow = false"
          >
            Fechar
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
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
  computed: {
    snackbarShow: {
      get() {
        return this.$store.state.snackbar.show;
      },
      set(value) {
        this.$store.commit('snackbar/updateShow', value);
      }
    },
  },
};
</script>
