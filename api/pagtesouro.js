const axios = require('axios');
const dayjs = require('dayjs');

function valor_formatter(valor) {
  valor_formatted = String(valor).padStart(3, '0');
  valor_formatted = valor_formatted.split('');
  valor_formatted.splice(-2, 0, '.');
  valor_formatted = valor_formatted.join('');
  return valor_formatted;
}

module.exports = axios.create({
  baseURL: process.env.PAGTESOURO_URL,
  transformRequest: [
    (rawData, headers) => {
      if (!rawData) return rawData;

      const allowed_fields = [
        'codigoServico',
        'referencia',
        'competencia',
        'vencimento',
        'expiracaoPix',
        'cnpjCpf',
        'nomeContribuinte',
        'valorPrincipal',
        'valorDescontos',
        'valorOutrasDeducoes',
        'valorMulta',
        'valorJuros',
        'valorOutrosAcrescimos',
      ];

      const data = Object.keys(rawData)
      .filter((key => allowed_fields.includes(key)))
      .reduce((obj, key) => {
        obj[key] = rawData[key];
        return obj;
      });

      data.urlRetorno = process.env.SERVER_BASE_URL + '/';

      if (data.hasOwnProperty('competencia') && data.competencia) {
        let competencia = dayjs(data.competencia).format('MMYYYY');
        if (competencia) {
          data.competencia = competencia;
        } else {
          data.competencia = null;
        }
      }

      if (data.hasOwnProperty('vencimento') && data.vencimento) {
        let vencimento = dayjs(data.vencimento).format('DDMMYYYY');
        if (vencimento) {
          data.vencimento = vencimento;
        } else {
          data.vencimento = null;
        }
      }

      if (data.hasOwnProperty('valorPrincipal') && data.valorPrincipal) {
        let valorPrincipal = valor_formatter(data.valorPrincipal);

        if (valorPrincipal) {
          data.valorPrincipal = valorPrincipal;
        } else {
          data.valorPrincipal = null;
        }
      }

      if (data.hasOwnProperty('valorDescontos') && data.valorDescontos) {
        let valorDescontos = valor_formatter(data.valorDescontos);

        if (valorDescontos) {
          data.valorDescontos = valorDescontos;
        } else {
          data.valorDescontos = null;
        }
      }

      if (data.hasOwnProperty('valorOutrasDeducoes') && data.valorOutrasDeducoes) {
        let valorOutrasDeducoes = valor_formatter(data.valorOutrasDeducoes);

        if (valorOutrasDeducoes) {
          data.valorOutrasDeducoes = valorOutrasDeducoes;
        } else {
          data.valorOutrasDeducoes = null;
        }
      }

      if (data.hasOwnProperty('valorMulta') && data.valorMulta) {
        let valorMulta = valor_formatter(data.valorMulta);

        if (valorMulta) {
          data.valorMulta = valorMulta;
        } else {
          data.valorMulta = null;
        }
      }

      if (data.hasOwnProperty('valorJuros') && data.valorJuros) {
        let valorJuros = valor_formatter(data.valorJuros);

        if (valorJuros) {
          data.valorJuros = valorJuros;
        } else {
          data.valorJuros = null;
        }
      }

      if (data.hasOwnProperty('valorOutrosAcrescimos') && data.valorOutrosAcrescimos) {
        let valorOutrosAcrescimos = valor_formatter(data.valorOutrosAcrescimos);

        if (valorOutrosAcrescimos) {
          data.valorOutrosAcrescimos = valorOutrosAcrescimos;
        } else {
          data.valorOutrosAcrescimos = null;
        }
      }

      return data;
    }
  ].concat(axios.defaults.transformRequest),
});
