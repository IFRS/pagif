<script setup>
import 'altcha'

const altchaWidget = ref(null)

const model = defineModel({
  type: String,
  required: true,
})

const i18n = computed(() => {
  return JSON.stringify({
    ariaLinkLabel: 'Visite Altcha.org',
    error: 'Falha na verificação. Tente novamente mais tarde.',
    expired: 'Verificação expirada. Tente novamente.',
    footer: 'Protegido por <a href="https://altcha.org/" target="_blank" aria-label="Visite Altcha.org">ALTCHA</a>',
    label: 'Não sou um robô',
    verified: 'Verificado',
    verifying: 'Verificando...',
    waitAlert: 'Verificando... por favor aguarde.',
  })
})

const onStateChange = (ev) => {
  if ('detail' in ev) {
    const { payload, state } = ev.detail
    if (state === 'verified' && payload) {
      model.value = payload
    } else {
      model.value = ''
    }
  }
}
</script>

<template>
  <!-- eslint-disable-next-line vue/html-self-closing -->
  <altcha-widget
    ref="altchaWidget"
    challengeurl="/api/altcha/challenge"
    hidelogo
    expire="60000"
    :strings="i18n"
    refetchonexpire="false"
    class="altcha-widget"
    @load="model = ''"
    @statechange="onStateChange"
  ></altcha-widget>
</template>

<style lang="scss" scoped>
.altcha-widget {
  --altcha-border-width: 1px;
  --altcha-border-radius: 4px;
  --altcha-color-base: #ffffff;
  --altcha-color-border: rgb(var(--v-border-color, #a0a0a0));
  --altcha-color-text: currentColor;
  --altcha-color-border-focus: currentColor;
  --altcha-color-error-text: rgb(var(--v-theme-error, #f23939));
  --altcha-color-footer-bg: rgb(var(--v-theme-surface-light, #f4f4f4));
  --altcha-max-width: 100%;
}
</style>
