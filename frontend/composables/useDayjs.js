import dayjs from 'dayjs'

export default function(...extensions) {
  extensions.forEach((extension) => {
    dayjs.extend(extension)
  })
  return dayjs
}
