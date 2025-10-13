export default (cnpjCpf) => {
  if (!cnpjCpf) return null

  cnpjCpf = String(cnpjCpf)

  if (cnpjCpf.length === 11) {
    cnpjCpf = cnpjCpf.replace(/(.{3})(.{3})(.{3})(.{2})/, '$1.$2.$3-$4')
  } else if (cnpjCpf.length === 14) {
    cnpjCpf = cnpjCpf.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, '$1.$2.$3/$4-$5')
  }

  return cnpjCpf
}
