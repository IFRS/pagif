<template>
  <UserMenu v-if="authStore.user" />

  <v-progress-circular
    v-else-if="loading"
    color="primary"
    indeterminate
    :size="48"
  />

  <GoogleLogin
    v-else
    :client-id="config.public.googleClientId"
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
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const config = useRuntimeConfig()

const loading = ref(false)

async function handleGoogle(response) {
  loading.value = true
  const { pending, data, error } = await useFetch('/api/auth/google/login', { method: 'POST', body: { ...response } })
  loading.value = pending
  if (error.value) {
    useToast().error('Ocorreu um erro ao logar com o Google.')
    console.error(error.value)
  }
  authStore.user = data.value;
  navigateTo('/')
}
</script>

<style lang="scss" scoped>
  .google-login {
    color-scheme: normal // Fix para bug do fundo branco no botão renderizado pelo script do Google
  }
</style>
