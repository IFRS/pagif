import { computed } from "vue"
import { Mask } from "maska"

export default (ref) => {
  const cnpjCpfMask = computed(() => {
    if (ref.value && ref.value.length > 11) {
      return '##.###.###/####-##'
    }
    return '###.###.###-##'
  })

  return {
    get() {
      if (ref.value) {
        const mask = new Mask({ mask: cnpjCpfMask.value })
        return mask.masked(ref.value)
      }
      return ''
    },
    set(val) {
      val = String(val)
      val = val.replace(/\D/g, '')
      ref.value = val
    }
  }
}
