<template>
  <v-menu
    :close-on-content-click="true"
  >
    <template #activator="{ props }">
      <v-btn
        class="mr-3"
        icon
        v-bind="props"
      >
        <KeepAlive>
          <v-avatar
            color="primary"
            size="38"
          >
            <img
              v-if="user.foto"
              :src="user.foto"
              :alt="'Foto de ' + user.nome"
              class="w-100 h-auto"
              referrerpolicy="no-referrer"
            >
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </KeepAlive>
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-h6">
            {{ user.nome }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item>

        <v-divider />

        <v-list-item
          v-if="admin"
          @click="navigateTo({ path: '/' }, { external: true })"
        >
          <template #prepend>
            <v-icon>mdi-web</v-icon>
          </template>

          <v-list-item-title>Site</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-else
          @click="navigateTo({ path: '/admin' }, { external: true })"
        >
          <template #prepend>
            <v-icon>mdi-application-cog-outline</v-icon>
          </template>
          <v-list-item-title>Administra&ccedil;&atilde;o</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item
          @click="logout()"
        >
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

defineProps({
  admin: {
    type: Boolean,
    default: false,
  },
})

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

const logout = async () => {
  const { error } = await useFetch('/api/auth/google/logout')
  if (error.value) {
    useToast().error('Erro ao tentar deslogar.')
    console.error(error.value)
  } else {
    user.value = null
    useToast().info('Você saiu com sucesso!')
    await navigateTo('/', { external: true })
  }
}
</script>
