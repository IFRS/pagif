<template>
  <UserMenu v-if="$store.getters['auth/user']"></UserMenu>

  <v-btn
    v-else
    color="primary"
    small
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
