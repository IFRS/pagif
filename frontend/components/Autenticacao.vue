<template>
  <UserMenu v-if="authStore.user" />

  <v-btn
    v-else
    color="primary"
    variant="elevated"
    size="small"
    class="text-none"
    href="/api/auth/google"
  >
    Entrar com&nbsp;<strong>Google</strong>
  </v-btn>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
</script>
