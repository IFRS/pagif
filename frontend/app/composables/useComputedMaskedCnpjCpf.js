import { Mask } from 'maska'

const cpfMask = new Mask({ mask: '###.###.###-##' })
const cnpjAlfaMask = new Mask({
  mask: '@@.@@@.@@@/@@@@-##',
  tokens: {
    '@': {
      pattern: /[0-9A-Z]/,
      transform: value => value.toUpperCase(),
    },
  },
})

function normalizeCpfCnpj(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
}

function formatCpfPartial(value) {
  return cpfMask.masked(String(value ?? '').slice(0, 11))
}

function formatCnpjPartial(value) {
  return cnpjAlfaMask.masked(String(value ?? '').slice(0, 14))
}

function formatCpfCnpjPartial(value) {
  const document = normalizeCpfCnpj(value)

  if (!document) {
    return ''
  }

  if (/^\d*$/.test(document) && document.length <= 11) {
    return formatCpfPartial(document)
  }

  return formatCnpjPartial(document)
}

export default (ref) => {
  return {
    get() {
      return formatCpfCnpjPartial(ref.value)
    },
    set(val) {
      ref.value = normalizeCpfCnpj(val)
    },
  }
}
