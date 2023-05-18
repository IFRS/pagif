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
          Voc&ecirc; pagar&aacute; a quantia de <strong>R$ {{ $filters.int_to_real(valorPrincipal) }}</strong> para <strong>{{ unidade?.nome }}</strong> pelo servi&ccedil;o <strong>{{ nomeServico }} ({{ codigoServico }})</strong>.
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
            <span>Devido a um problema no PagTesouro os pagamentos estão sendo cancelados após 1 hora, caso não tenham sido iniciados. No futuro esse tempo voltará a ser de 24 horas.</span>
          </v-tooltip>
          para realiz&aacute;-lo.
        </v-alert>
      </v-col>
      <v-col class="d-flex justify-center align-center">
        <recaptcha
          @success="$emit('recaptcha', true)"
          @error="$emit('recaptcha', false)"
          @expired="$emit('recaptcha', false)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Resumo',
  computed: {
    unidade: {
      ...mapGetters({ get: 'config/unidade' }),
    },
    valorPrincipal: {
      ...mapGetters({ get: 'pagamento/valorPrincipal' }),
    },
    nomeServico: {
      ...mapGetters({ get: 'pagamento/nomeServico' }),
    },
    codigoServico: {
      ...mapGetters({ get: 'pagamento/codigoServico' }),
    },
    nomeContribuinte: {
      ...mapGetters({ get: 'pagamento/nomeContribuinte' }),
    },
    competencia: {
      ...mapGetters({ get: 'pagamento/competencia' }),
    },
    cnpjCpf: {
      ...mapGetters({ get: 'pagamento/cnpjCpf' }),
    },
    referencia: {
      ...mapGetters({ get: 'pagamento/referencia' }),
    },
  },
}
</script>
