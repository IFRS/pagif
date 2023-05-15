<template>
  <v-card flat tag="fieldset">
    <v-card-subtitle tag="legend">
      Datas
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col>
          <!-- Datas -->
          <v-menu
            :close-on-click="true"
            :close-on-content-click="false"
            :return-value="datas"
            transition="scale-transition"
            offset-y
            max-width="auto"
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="datasFormatted"
                label="Selecione um intervalo de datas"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                v-bind="attrs"
                v-on="on"
                :rules="validation.datas"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="datas"
              :max="$dayjs().toISOString()"
              range
              show-adjacent-months
              no-title
              scrollable
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

export default {
  name: 'FilterDatas',
  data() {
    return {
      datas: [],
      validation: {
        datas: [
          v => {
            if (!v) return true;

            const hoje = this.$dayjs();
            const datas = v.split(' ~ ');

            const datas_sao_anteriores = datas.every((data) => {
              data = this.$dayjs(data, 'DD/MM/YYYY');
              return data.isSameOrBefore(hoje, 'day');
            });

            if (datas_sao_anteriores) return true;

            return 'A Data precisa ser anterior à data de hoje.';
          },
        ],
      },
    }
  },
  computed: {
    datasFormatted: {
      get() {
        if (!this.datas || this.datas.length === 0) return null;

        let formatted = this.datas.map((data) => {
          return this.$dayjs(data).format('DD/MM/YYYY');
        });

        return formatted.join(' ~ ');
      },
      set(value) {
        this.datas = value?.split(' ~ ') ?? [];
      }
    },
  },
  watch: {
    datas(newDatas) {
      if (newDatas.length === 2) {
        let dataInicial = this.$dayjs(newDatas[0]);
        let dataFinal = this.$dayjs(newDatas[1]);

        if (dataFinal.isBefore(dataInicial, 'day')) newDatas.reverse();
      }

      this.$parent.$emit('filtro', { datas: newDatas });
    }
  },
  created () {
    this.$dayjs.extend(customParseFormat);
    this.$dayjs.extend(isSameOrBefore);
  },
}
</script>
