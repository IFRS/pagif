import { Mask } from "maska"
import useFilters from "./useFilters"

export default (ref) => ({
  get() {
    if (ref.value) {
      const mask = new Mask({ mask: '9.99#,##', tokens: { 9: { pattern: '[0-9]', repeated: true } }, reversed: true })
      return mask.masked(String(ref.value).padStart(3, '0'))
    }

    return null
  },
  set(val) {
    ref.value = useFilters().real_to_int(val) ?? null
  }
})
