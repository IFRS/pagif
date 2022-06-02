<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
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
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'AdminLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Início',
          to: '/admin',
        },
        {
          icon: 'mdi-office-building-marker',
          title: 'Unidades',
          to: '/admin/unidades',
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
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
    }
  },
};
</script>
