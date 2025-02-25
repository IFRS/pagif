export default (valor, prefixo = false) => {
  if (!valor) return null

  valor = String(valor)
  valor = valor.padStart(3, '0')
  valor = valor.split('')
  valor.splice(-2, 0, ',')

  if (prefixo) {
    valor.unshift(' ')
    valor.unshift('$')
    valor.unshift('R')
  }

  valor = valor.join('')

  return valor
}
