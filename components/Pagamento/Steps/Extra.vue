<template>
  <v-form
    ref="form"
    v-bind="$attrs"
  >
    <p class="text-body-2 text--secondary">
      As informações abaixo são opcionais.
    </p>

    <v-text-field
      v-model="referencia"
      prepend-icon="mdi-numeric"
      label="Número de Referência"
      :rules="validation.referencia"
      :counter="20"
    />

    <v-menu
      :persistent="!(true)"
      :close-on-content-click="true"
      :return-value="competencia"
      transition="scale-transition"
      offset-y
      max-width="auto"
      min-width="auto"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="competenciaFormatted"
          label="Competência"
          prepend-icon="mdi-calendar-month"
          readonly
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <v-date-picker
        v-model="competencia"
        type="month"
        no-title
        scrollable
      />
    </v-menu>
  </v-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Extra',
  data() {
    return {
      validation: {
        referencia: [
          v => !v || (/^\d+$/).test(v) || 'Número de Referência precisa ser um número.',
          v => !v || v?.length <= 20 || 'Número de Referência deve ter no máximo 20 dígitos.',
        ],
      },
    }
  },
  computed: {
    referencia: {
      ...mapGetters({ get: 'pagamento/referencia' }),
      ...mapMutations({ set: 'pagamento/referencia' }),
    },
    competencia: {
      ...mapGetters({ get: 'pagamento/competencia' }),
      ...mapMutations({ set: 'pagamento/competencia' }),
    },
    competenciaFormatted() {
      if (!this.competencia) return null;

      return this.$dayjs(this.competencia).format('MM/YYYY');
    },
  },
}
</script>
