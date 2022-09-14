<template>
  <v-container>
    <v-skeleton-loader
      v-if="$fetchState.pending"
      type="heading, paragraph, image"
      min-height="600"
    />
    <template v-else>
      <v-row>
        <v-col>
          <h2>Pagando</h2>
          <p class="subtitle-1">Pagamento {{ $store.getters['pagamento/idPagamento'] }}</p>

          <v-alert type="info" text>
            Atenção! Não é possível voltar para realizar o pagamento posteriormente.
          </v-alert>

          <p>Confira os dados que aparecerão na tela abaixo antes de efetuar o pagamento.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn color="primary" v-if="!mostrarPagamento" @click="mostrarPagamento = true">Carregar Tela de Pagamento</v-btn>
          <v-card v-else>
            <iframe
              v-resize="{ heightCalculationMethod: 'documentElementOffset' }"
              class="iframe-epag"
              scrolling="no"
              :src="$store.state.pagamento.proximaUrl + '&btnConcluir=true' + (!$store.getters['config/darkMode'] ? '&tema=tema-light' : '')"
            ></iframe>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import iframeResize from 'iframe-resizer/js/iframeResizer';

export default {
  name: 'Pagar',
  head: {
    title: 'Pagando',
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
      pagamentoConcluido: false,
      mostrarPagamento: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('pagamento/show', this.$route.params.id)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar o Pagamento: ' + error.message);
      this.$router.push({ name: 'pagamento' });
    });
  },
  mounted () {
    window.addEventListener('message', this.retornoPagtesouro, false);
  },
  methods: {
    retornoPagtesouro(event) {
      // Só confiar em eventos oriundos do PagTesouro.
      if (event.origin !== process.env.PAGTESOURO_URL) return;

      // Evento disparado pelos botões Fechar/Concluir.
      if (event.data === 'EPAG_FIM') {
        this.$toast.success('Pagamento finalizado!');
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
