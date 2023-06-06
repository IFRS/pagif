<template>
  <UserMenu v-if="authStore.user" />

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

const handleGoogle = (response) => {
  console.log(response)
}
</script>

<style lang="scss" scoped>
  .google-login {
    color-scheme: normal // Fix para bug do fundo branco no botão renderizado pelo script do Google
  }
</style>
