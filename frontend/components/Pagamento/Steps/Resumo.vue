<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Confira o Resumo do Pagamento</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <p>
          Voc&ecirc; pagar&aacute; a quantia de <strong>R$ {{ $filters.int_to_real(valorPrincipal) }}</strong> para <strong>{{ configStore.unidade?.nome }}</strong> pelo servi&ccedil;o <strong>{{ nomeServico }} ({{ codigoServico }})</strong>.
        </p>
        <p>
          O pagamento <template v-if="competencia">
            referente ao m&ecirc;s <strong>{{ $dayjs(competencia, 'YYYY-MM').format('MM/YYYY') }}</strong>&nbsp;
          </template>ser&aacute; em nome de <strong>{{ nomeContribuinte }}<template v-if="cnpjCpf">&nbsp;({{ $filters.cnpj_cpf(cnpjCpf) }})</template></strong>.
        </p>
        <p v-if="referencia">
          O n&uacute;mero de refer&ecirc;ncia atrelado a esse pagamento &eacute; <strong>{{ referencia }}</strong>.
        </p>
        <br>
        <v-alert
          text
          type="info"
        >
          Ao clicar em "Concluir" o pagamento ser&aacute; gerado e voc&ecirc; ter&aacute;
          <v-tooltip location="bottom">
            <template #activator="{ on, attrs }">
              <span
                v-bind="attrs"
                class="text-decoration-underline"
                v-on="on"
              ><strong>1h</strong></span>
            </template>
            <span>Caso o pagamento n&atilde;o tenha sido iniciado, ser&aacute; cancelado ap&oacute;s 1h.</span>
          </v-tooltip>
          para realiz&aacute;-lo.
        </v-alert>
      </v-col>
      <v-col class="d-flex justify-center align-center">
        <!-- TODO: adicionar novamente o ReCaptcha -->
        <form
          action="?"
          method="POST"
        >
          <div
            class="g-recaptcha"
            :data-sitekey="v2SiteKey"
            :data-theme="configStore.darkMode ? 'dark' : 'light'"
          />
          <br>
          <input
            type="submit"
            value="Submit"
          >
        </form>

        <!-- <RecaptchaCheckbox
          v-model="response"
          :theme="darkMode ? 'dark' : 'light'"
        /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRuntimeConfig } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useConfigStore } from '~/store/config'
import { usePagamentoStore } from '~/store/pagamento'

useHeadSafe({
  script: [
    { src: 'https://www.google.com/recaptcha/api.js' }
  ]
}, { mode: 'client' })

const emit = defineEmits(['recaptcha'])

const { public: { recaptcha: { v2SiteKey } } } = useRuntimeConfig()
const response = ref(false)

const configStore = useConfigStore()
const pagamentoStore = usePagamentoStore()

const {
  valorPrincipal,
  nomeServico,
  codigoServico,
  nomeContribuinte,
  competencia,
  cnpjCpf,
  referencia,
} = storeToRefs(pagamentoStore)

watch(response, (newResponse) => {
  emit('recaptcha', newResponse)
})
</script>
