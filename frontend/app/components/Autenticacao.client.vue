<template>
  <UserMenu v-if="authStore.user" />

  <v-progress-circular
    v-else-if="loading"
    color="primary"
    indeterminate
    :size="38"
  />

  <GoogleLogin
    v-else
    :client-id="googleClientId"
    :callback="handleGoogle"
    :button-config="{
      type: 'standard',
      theme: 'filled_blue',
      size: 'medium',
      text: 'signin_with',
      shape: 'pill',
    }"
    class="google-login me-3"
  />
</template>

<script setup>
import { GoogleLogin } from 'vue3-google-login'

const authStore = useAuthStore()
const { public: { googleClientId } } = useRuntimeConfig()

const loading = ref(false)

async function handleGoogle(response) {
  loading.value = true
  const { data, error } = await useFetch('/api/auth/google/login', { method: 'POST', body: response })
  if (error.value) {
    useToast().error('Ocorreu um erro ao logar com o Google. Verifique se você está utilizando um e-mail autorizado.')
    console.error(error.value)
  }
  authStore.user = data.value
  loading.value = false
  await navigateTo('/', { replace: true })
}
</script>

<style lang="scss" scoped>
  .google-login {
    color-scheme: normal // Fix para bug do fundo branco no botão renderizado pelo script do Google
  }
</style>
