<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          :loading="$fetchState.pending"
          :disabled="$fetchState.pending"
        >
          <v-card-title primary-title>
            Pagamento {{ $store.getters['pagamento/idPagamento'] }}
          </v-card-title>
          <v-card-text>
            <p>
              Pagamento no valor de <strong>R$ {{ $filter.int_to_real(valorPrincipal) }}</strong> para <strong>{{ nomeUnidade }}</strong> pelo servi&ccedil;o <strong>{{ nomeServico }} ({{ codigoServico }})</strong>.
            </p>
            <p>
              O pagamento <template v-if="competencia">
                referente ao m&ecirc;s <strong>{{ $dayjs(competencia, 'YYYY-MM').format('MM/YYYY') }}</strong>&nbsp;
              </template>est&aacute; em nome de <strong>{{ nomeContribuinte }}<template v-if="cnpjCpf">&nbsp;({{ $filters.cnpj_cpf(cnpjCpf) }})</template></strong>.
            </p>
            <p v-if="referencia">
              O n&uacute;mero de refer&ecirc;ncia atrelado a esse pagamento &eacute; <strong>{{ referencia }}</strong>.
            </p>
            <p>
              Vencimento em
              <strong>
                <template v-if="vencimento">
                  {{ $dayjs(vencimento).format('DD/MM/YYYY') }}
                </template>
                <template v-else>
                  {{ $dayjs(dataCriacao).add(1, 'day').format('DD/MM/YYYY') }}
                </template>
              </strong>.
            </p>

            <v-alert
              v-if="situacao?.codigo === 'INICIADO' || situacao?.codigo === 'SUBMETIDO'"
              type="info"
              text
            >
              Pagamento n&atilde;o pode ser realizado por j&aacute; ter sido iniciado. Verifique mais informa&ccedil;&otilde;es sobre esse Pagamento na <NuxtLink :to="{ name: 'consulta-id', params: { id: idPagamento } }">
                p&aacute;gina de consulta
              </NuxtLink>.
            </v-alert>

            <v-alert
              v-else-if="situacao?.codigo === 'CONCLUIDO'"
              type="info"
              text
            >
              Pagamento n&atilde;o pode ser realizado por j&aacute; ter sido conclu&iacute;do. Verifique mais informa&ccedil;&otilde;es sobre esse Pagamento na <NuxtLink :to="{ name: 'consulta-id', params: { id: idPagamento } }">
                p&aacute;gina de consulta
              </NuxtLink>.
            </v-alert>

            <v-alert
              v-else-if="situacao?.codigo === 'REJEITADO' || situacao?.codigo === 'CANCELADO'"
              type="info"
              text
            >
              Pagamento n&atilde;o pode ser realizado por j&aacute; ter sido finalizado. Verifique mais informa&ccedil;&otilde;es sobre esse Pagamento na <NuxtLink :to="{ name: 'consulta-id', params: { id: idPagamento } }">
                p&aacute;gina de consulta
              </NuxtLink>.
            </v-alert>

            <v-alert
              v-else
              type="error"
              text
            >
              Aten&ccedil;&atilde;o! Ao clicar em &quot;<strong>Pagar Agora</strong>&quot; voc&ecirc; iniciar&aacute; um processo de <strong>acesso &uacute;nico</strong>. Ou seja, a tela para pagamento s&oacute; ser&aacute; exibida uma &uacute;nica vez.
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              variant="text"
              :to="{ name: 'pagamento' }"
            >
              Voltar
            </v-btn>
            <v-btn
              v-if="situacao?.codigo === 'CRIADO'"
              :disabled="mostrarPagamento"
              variant="text"
              color="primary"
              @click="mostrarPagamento = true"
            >
              Pagar Agora
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="mostrarPagamento">
      <v-col>
        <v-card>
          <v-alert
            type="info"
            text
          >
            Confira os dados que aparecer&atilde;o na tela abaixo antes de efetuar o pagamento.
          </v-alert>
          <iframe
            v-resize-iframe="{ heightCalculationMethod: 'documentElementOffset' }"
            class="iframe-epag"
            scrolling="no"
            :src="$store.getters['pagamento/proximaUrl'] + '&btnConcluir=true' + (!$store.getters['config/darkMode'] ? '&tema=tema-light' : '')"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import { mapGetters } from 'vuex';

export default {
  directives: {
    'resize-iframe': {
      bind(el, { value = {} }) {
        el.addEventListener('load', () => iFrameResize(value, el));
      },
      unbind: function (el) {
        el.iFrameResizer.removeListeners();
      }
    },
  },
  data() {
    return {
      mostrarPagamento: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('pagamento/show_public', this.$route.params.id)
    .catch((error) => {
      console.error(error);
      this.$toast.error('Ocorreu um erro ao buscar o Pagamento. ' + error.message);
      this.$router.push({ name: 'pagamento' });
    });
  },
  head: {
    title: 'Pagamento',
  },
  computed: {
    idPagamento: {
      ...mapGetters({ get: 'pagamento/idPagamento' }),
    },
    valorPrincipal: {
      ...mapGetters({ get: 'pagamento/valorPrincipal' }),
    },
    nomeUnidade: {
      ...mapGetters({ get: 'pagamento/nomeUnidade' }),
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
    cnpjCpf: {
      ...mapGetters({ get: 'pagamento/cnpjCpf' }),
    },
    situacao: {
      ...mapGetters({ get: 'pagamento/situacao' }),
    },
    referencia: {
      ...mapGetters({ get: 'pagamento/referencia' }),
    },
    competencia: {
      ...mapGetters({ get: 'pagamento/competencia' }),
    },
    vencimento: {
      ...mapGetters({ get: 'pagamento/vencimento' }),
    },
    dataCriacao: {
      ...mapGetters({ get: 'pagamento/dataCriacao' }),
    },
  },
  mounted() {
    window.addEventListener('message', this.retornoPagtesouro, false);
  },
  unmounted() {
    this.$store.commit('pagamento/clear');
  },
  methods: {
    retornoPagtesouro(event) {
      // Só confiar em eventos oriundos do PagTesouro.
      if (event.origin !== this.$config.pagtesouroURL) return;

      // Evento disparado pelos botões Fechar/Concluir.
      if (event.data === "EPAG_FIM") {
        this.$toast.info('Pagamento finalizado.');
        this.$router.push({ name: 'index' });
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe-epag {
  margin: 0;
  padding: 0;
  border: 0;
  width: 1px;
  min-width: 100%;
}
</style>