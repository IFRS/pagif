<template>
  <v-container>
    <v-form ref="form" v-on="$listeners">
      <v-text-field
        prepend-icon="mdi-numeric"
        label="Número de Referência"
        v-model="referencia"
        :rules="validation.referencia"
        :counter="20"
      ></v-text-field>

      <v-menu
        :close-on-click="true"
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
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="competencia"
          type="month"
          no-title
          scrollable
        ></v-date-picker>
      </v-menu>
    </v-form>
  </v-container>
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
