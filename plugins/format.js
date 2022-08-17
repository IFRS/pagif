export default ({ app }, inject) => {
  inject('format', {
    moedaToInt (valor) {
      if (!valor) return 0;

      valor = String(valor);
      valor = valor.replace(/\D/g,'');
      valor = parseInt(valor);

      return valor;
    },
    intToMoeda (valor, prefixo) {
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
    cnpjCpf(cnpjCpf, hide = false) {
      if (!cnpjCpf) return null;

      cnpjCpf = String(cnpjCpf);
      cnpjCpf = cnpjCpf.replace(/\D/g, '');

      if (cnpjCpf.length === 11) {
        if (hide) {
          cnpjCpf = cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.$2.$3-**");
        } else {
          cnpjCpf = cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        }
      }

      if (cnpjCpf.length === 14) {
        if (hide) {
          cnpjCpf = cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "**.***.$3/$4-**");
        } else {
          cnpjCpf = cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        }
      }

      return cnpjCpf;
    },
  });
};
