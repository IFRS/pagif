export default (valor) => {
  if (!valor) return 0

  valor = String(valor)
  valor = valor.replace(/\D/g, '')
  valor = parseInt(valor)

  return valor
}
