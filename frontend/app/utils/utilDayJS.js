import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

export default function (...extensions) {
  extensions.forEach((extension) => {
    dayjs.extend(extension)
  })

  dayjs.locale('pt-br')

  return dayjs
}
