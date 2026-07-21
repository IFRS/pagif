function normalizeCpfCnpj(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, '')
}

function normalizeMaskedCpfCnpj(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-Z*]/g, '')
}

function formatCpf(cpf) {
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`
}

function formatCnpj(cnpj) {
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`
}

function formatCpfCnpj(value) {
  const hasMask = String(value).includes('*')
  const document = hasMask ? normalizeMaskedCpfCnpj(value) : normalizeCpfCnpj(value)

  if (document.length === 11 && (hasMask || /^\d{11}$/.test(document))) {
    return formatCpf(document)
  }

  if (document.length === 14 && (hasMask || /^[A-Z0-9]{12}\d{2}$/.test(document))) {
    return formatCnpj(document)
  }

  return document
}

export default (cnpjCpf) => {
  if (!cnpjCpf) return null

  return formatCpfCnpj(cnpjCpf)
}
