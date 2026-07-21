import { defineNuxtPlugin } from '#app'

function normalizeCpfCnpj(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
}

function calculateCpfCheckDigit(cpf, factor) {
  const total = cpf
    .slice(0, factor - 1)
    .split('')
    .reduce((sum, digit, index) => sum + (parseInt(digit, 10) * (factor - index)), 0)

  const remainder = total % 11
  return remainder < 2 ? '0' : String(11 - remainder)
}

function isValidCpf(value) {
  const cpf = normalizeCpfCnpj(value)

  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) {
    return false
  }

  const firstCheckDigit = calculateCpfCheckDigit(cpf, 10)
  const secondCheckDigit = calculateCpfCheckDigit(cpf, 11)

  return cpf.slice(-2) === `${firstCheckDigit}${secondCheckDigit}`
}

function cnpjCharacterValue(char) {
  return char.charCodeAt(0) - 48
}

function calculateCnpjCheckDigit(cnpj, weights) {
  const total = cnpj
    .split('')
    .reduce((sum, char, index) => sum + (cnpjCharacterValue(char) * weights[index]), 0)

  const remainder = total % 11
  return remainder < 2 ? '0' : String(11 - remainder)
}

function isValidCnpj(value) {
  const cnpj = normalizeCpfCnpj(value)

  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
    return false
  }

  if (/^(\d)\1{13}$/.test(cnpj)) {
    return false
  }

  const firstCheckDigit = calculateCnpjCheckDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const secondCheckDigit = calculateCnpjCheckDigit(cnpj.slice(0, 12) + firstCheckDigit, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

  return cnpj.slice(-2) === `${firstCheckDigit}${secondCheckDigit}`
}

function isValidCpfOrCnpj(value) {
  const document = normalizeCpfCnpj(value)

  if (document.length === 11) {
    return isValidCpf(document)
  }

  if (document.length === 14) {
    return isValidCnpj(document)
  }

  return false
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      isCPF: isValidCpf,
      isCNPJ: isValidCnpj,
      isCpfCnpj: isValidCpfOrCnpj,
    },
  }
})
