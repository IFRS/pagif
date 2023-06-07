<template>
  <v-menu
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        class="mr-3"
        icon
        v-bind="props"
      >
        <v-avatar
          color="primary"
          size="38"
        >
          <v-img
            v-if="user.foto"
            :src="user.foto"
            :alt="'Foto de ' + user.nome"
            referrerpolicy="no-referrer"
          />
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-avatar>
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
          @click="logout()"
        >
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
    navigateTo('/', { replace: true })
  }
}
</script>
