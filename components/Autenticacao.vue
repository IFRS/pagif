<template>
  <UserMenu v-if="$store.getters['auth/user']" />

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

<script>
export default {
  name: 'Autenticacao',
}
</script>
