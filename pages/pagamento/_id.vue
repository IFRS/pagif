<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card :loading="$fetchState.pending" :disabled="$fetchState.pending">
          <v-card-title primary-title>
            Pagamento {{ $store.getters['pagamento/idPagamento'] }}
          </v-card-title>
          <v-card-text>
            <p>Pagamento no valor de <strong>R$ {{ $format.intToMoeda(valorPrincipal) }}</strong> para <strong>{{ nomeUnidade }}</strong> pelo produto/servi&ccedil;o <strong>{{ nomeServico }} ({{ codigoServico }})</strong>.</p>
            <p>Em nome de <strong>{{ nomeContribuinte }}<template v-if="cnpjCpf">&nbsp;({{ $format.cnpjCpf(cnpjCpf) }})</template></strong>.</p>

            <v-alert
              type="warning"
              text
            >Atenção! Após clicar em <strong>Pagar</strong> não será possível voltar para realizar o pagamento posteriormente.</v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="secondary"
              plain
              :to="{ name: 'pagamento' }"
            >Voltar</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="situacao?.codigo === 'CRIADO' && !mostrarPagamento"
              text
              color="primary"
              @click="mostrarPagamento = true"
            >Pagar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card v-if="mostrarPagamento">
          <v-alert
            type="info"
            text
          >
            Confira os dados que aparecerão na tela abaixo antes de efetuar o pagamento.
          </v-alert>
          <iframe
            v-resize="{ heightCalculationMethod: 'documentElementOffset' }"
            class="iframe-epag"
            scrolling="no"
            :src="$store.state.pagamento.proximaUrl + '&btnConcluir=true' + (!$store.getters['config/darkMode'] ? '&tema=tema-light' : '')"
          ></iframe>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import iframeResize from 'iframe-resizer/js/iframeResizer';
import { mapGetters } from 'vuex';

export default {
  name: 'Pagamento',
  head: {
    title: 'Pagamento',
  },
  directives:  {
    resize: {
      bind (el, { value = {} }) {
        el.addEventListener('load', () => iframeResize(value, el))
      }
    },
  },
  data() {
    return {
      mostrarPagamento: false,
    }
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
    }
  },
  async fetch() {
    await this.$store.dispatch('pagamento/show', this.$route.params.id)
    .catch((error) => {
      console.error(error);
      this.$toast.error('Ocorreu um erro ao buscar o Pagamento. ' + error.message);
      this.$router.push({ name: 'pagamento' });
    });
  },
  mounted () {
    window.addEventListener('message', this.retornoPagtesouro, false);
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
  destroyed () {
    this.$store.commit('pagamento/clear');
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
