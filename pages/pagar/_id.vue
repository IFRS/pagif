<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Pagar</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-skeleton-loader
          v-if="$fetchState.pending"
          type="image"
          min-height="600"
        />
        <iframe
          v-else
          v-resize="{ heightCalculationMethod: 'documentElementOffset' }"
          class="iframe-epag"
          scrolling="no"
          :src="$store.state.pagamento.proximaUrl + '&btnConcluir=true'"
        ></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import iframeResize from 'iframe-resizer/js/iframeResizer';

export default {
  name: 'Pagar',
  directives:  {
    resize: {
      bind (el, { value = {} }) {
        el.addEventListener('load', () => iframeResize(value, el))
      }
    },
  },
  async fetch() {
    await this.$store.dispatch('fetchPagamento', this.$route.params.id)
    .catch((error) => {
      this.$toast.error('Ocorreu um erro ao carregar o Pagamento: ' + error.message);
      console.log(error);
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
        // TODO: redirecionar para uma página de conclusão de pagamento
      }
    },
  },
  destroyed () {
    this.$store.commit('admin/pagamento/clear');
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
