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
            <v-date-picker
              v-model="datas"
              show-adjacent-months
              multiple="range"
              hide-header
              @click:cancel="showDatas = false"
              @click:save="showDatas = false"
            >
              <template #actions>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="[showDatas = false, datas = []]"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="showDatas = false"
                >
                  Ok
                </v-btn>
              </template>
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
  let newDatas = toRaw(newValue)

  if (newDatas.length > 1) {
    newDatas = newDatas.filter((data, index, array) => {
      return index === 0 || index === array.length - 1
    })

    showDatas.value = false
  }

  newDatas = newDatas.map((data) => {
    return dayjs(data).toISOString()
  })

  emit('filtro', { datas: newDatas })
}, { deep: true })

const datasFormatted = computed({
  get() {
    if (!datas.value || datas.value.length === 0) return null

    const formatted = datas.value.map((data) => {
      return dayjs(data).format('DD/MM/YYYY')
    }).filter((data, index, array) => {
      return index === 0 || index === array.length - 1
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
