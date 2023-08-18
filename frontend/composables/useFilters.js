export default function() {
  return {
    real_to_int(valor) {
      if (!valor) return 0;

      valor = String(valor);
      valor = valor.replace(/\D/g,'');
      valor = parseInt(valor);

      return valor;
    },
    int_to_real(valor, prefixo = false) {
      if (!valor) return null;

      valor = String(valor);
      valor = valor.padStart(3, '0');
      valor = valor.split('');
      valor.splice(-2, 0, ',');

      if (prefixo) {
        valor.unshift(' ');
        valor.unshift('$');
        valor.unshift('R');
      }

      valor = valor.join('');

      return valor;
    },
    cnpj_cpf(cnpjCpf) {
      if (!cnpjCpf) return null;

      cnpjCpf = String(cnpjCpf);

      if (cnpjCpf.length === 11) {
        cnpjCpf = cnpjCpf.replace(/(.{3})(.{3})(.{3})(.{2})/, "$1.$2.$3-$4");
      } else if (cnpjCpf.length === 14) {
          cnpjCpf = cnpjCpf.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, "$1.$2.$3/$4-$5");
      }

      return cnpjCpf;
    },
  }
}
