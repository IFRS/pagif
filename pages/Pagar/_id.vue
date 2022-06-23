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
          :src="$store.state.pagamento.proximaUrl"
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
