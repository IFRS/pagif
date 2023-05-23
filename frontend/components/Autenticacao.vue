<template>
  <UserMenu v-if="store.user" />

  <v-btn
    v-else
    color="primary"
    size="small"
    class="text-none"
    href="/api/auth/google"
  >
    Entrar com&nbsp;<strong>Google</strong>
  </v-btn>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';
const store = useAuthStore();
</script>
