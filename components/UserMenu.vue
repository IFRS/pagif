<template>
  <v-menu
    :close-on-content-click="false"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        class="mr-3"
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-avatar
          dark
          color="primary"
          size="38"
        >
          <img
            v-if="usuario.foto"
            :src="usuario.foto"
            :alt="'Foto de ' + usuario.nome"
            referrerpolicy="no-referrer"
          >
          <v-icon
            v-else
            dark
          >
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">
            {{ usuario.nome }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ usuario.email }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider />

        <v-list-item
          v-if="admin"
          :to="{ path: '/' }"
        >
          <v-list-item-title>Site</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-else
          :to="{ name: 'admin' }"
        >
          <v-list-item-title>Administração</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item
          href="/api/auth/logout"
        >
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UserMenu',
  props: {
    admin: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    usuario: {
      ...mapGetters({ get: 'auth/user' }),
    },
  }
}
</script>
