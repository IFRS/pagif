<template>
  <v-card
    flat
    tag="fieldset"
  >
    <v-card-subtitle tag="legend">
      Datas
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col>
          <!-- Datas -->
          <v-menu
            :persistent="!(true)"
            :close-on-content-click="false"
            :model-value="datas"
            transition="scale-transition"
            max-width="auto"
            min-width="auto"
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="datasFormatted"
                v-bind="props"
                label="Selecione um intervalo de datas"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                :rules="validation.datas"
              />
            </template>
            <v-date-picker
              v-model="datas"
              :max="dayjs().toISOString()"
              range
              show-adjacent-months
            />
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

const dayjs = useDayjs(customParseFormat, isSameOrBefore)

const validation = {
  datas: [
    v => {
      if (!v) return true

      const hoje = dayjs()
      const datas = v.split(' ~ ')

      const datas_sao_anteriores = datas.every((data) => {
        data = dayjs(data, 'DD/MM/YYYY')
        return data.isSameOrBefore(hoje, 'day')
      })

      if (datas_sao_anteriores) return true

      return 'A Data precisa ser anterior à data de hoje.'
    },
  ],
}

const datas = ref([])

watch(datas, (newDatas) => {
  if (newDatas.length === 2) {
      const dataInicial = dayjs(newDatas[0])
      const dataFinal = dayjs(newDatas[1])

      if (dataFinal.isBefore(dataInicial, 'day')) newDatas.reverse()
    }

    $parent.emit('filtro', { datas: newDatas })
})

const datasFormatted = computed({
  get() {
    if (!datas.value || datas.value.length === 0) return null

    const formatted = datas.value.map((data) => {
      return dayjs(data).format('DD/MM/YYYY')
    });

    return formatted.join(' ~ ')
  },
  set(value) {
    datas.value = value?.split(' ~ ') ?? []
  }
})
</script>
