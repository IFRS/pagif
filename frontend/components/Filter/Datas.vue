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
            v-model="showDatas"
            :close-on-content-click="false"
            transition="scale-transition"
            max-width="auto"
            min-width="auto"
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="datasFormatted"
                v-bind="props"
                :rules="validation.datas"
                label="Selecione um intervalo de datas"
                prepend-icon="mdi-calendar"
                readonly
                clearable
                @click:clear="datas = []"
              />
            </template>
            <!-- TODO: Esse DatePicker precisa ser do tipo range. Talvez no Vuetify 3.5 essa opção esteja disponível. -->
            <v-date-picker
              v-model="datas"
              show-adjacent-months
              multiple
              @click:cancel="showDatas = false"
              @click:save="showDatas = false"
            >
              <template #header />
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

const emit = defineEmits(['filtro'])

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
    v => {
      if (!v) return true

      const datas = v.split(' ~ ')
      if (datas.length <= 2) return true

      return 'Selecione no máximo duas Datas.'
    },
  ],
}

const showDatas = ref(false)

const datas = ref([])

watch(datas, (newValue) => {
  const newDatas = toRaw(newValue)

  if (newDatas.length === 2) {
    const dataInicial = dayjs(newDatas[0])
    const dataFinal = dayjs(newDatas[1])

    if (dataFinal.isBefore(dataInicial, 'day')) newDatas.reverse()
  }

  emit('filtro', { datas: newDatas })
}, { deep: true })

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

function limpa() {
  datas.value = []
}

defineExpose({limpa})
</script>
