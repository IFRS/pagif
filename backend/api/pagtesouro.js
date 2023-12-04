const {loggerPagTesouro} = require('../logger');
const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

function valor_formatter(valor) {
  let valor_formatted = String(valor).padStart(3, '0');
  valor_formatted = valor_formatted.split('');
  valor_formatted.splice(-2, 0, '.');
  valor_formatted = valor_formatted.join('');
  return valor_formatted;
}

const pagtesouro = axios.create({
  baseURL: process.env.PAGTESOURO_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [
    (rawData) => {
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

      let data = Object.keys(rawData)
      .filter((key => allowed_fields.includes(key)))
      .reduce((obj, key) => {
        obj[key] = rawData[key];
        return obj;
      }, {});

      data.urlRetorno = process.env.APP_URL + '/';
      data.urlNotificacao = process.env.APP_URL + '/api/notifica';

      if (Object.prototype.hasOwnProperty.call(data, 'competencia') && data.competencia) {
        let competencia = dayjs(data.competencia).format('MMYYYY');
        if (competencia) {
          data.competencia = competencia;
        } else {
          data.competencia = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'vencimento') && data.vencimento) {
        let vencimento = dayjs(data.vencimento).format('DDMMYYYY');
        if (vencimento) {
          data.vencimento = vencimento;
        } else {
          data.vencimento = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'valorPrincipal') && data.valorPrincipal) {
        let valorPrincipal = valor_formatter(data.valorPrincipal);

        if (valorPrincipal) {
          data.valorPrincipal = valorPrincipal;
        } else {
          data.valorPrincipal = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'valorDescontos') && data.valorDescontos) {
        let valorDescontos = valor_formatter(data.valorDescontos);

        if (valorDescontos) {
          data.valorDescontos = valorDescontos;
        } else {
          data.valorDescontos = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'valorOutrasDeducoes') && data.valorOutrasDeducoes) {
        let valorOutrasDeducoes = valor_formatter(data.valorOutrasDeducoes);

        if (valorOutrasDeducoes) {
          data.valorOutrasDeducoes = valorOutrasDeducoes;
        } else {
          data.valorOutrasDeducoes = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'valorMulta') && data.valorMulta) {
        let valorMulta = valor_formatter(data.valorMulta);

        if (valorMulta) {
          data.valorMulta = valorMulta;
        } else {
          data.valorMulta = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'valorJuros') && data.valorJuros) {
        let valorJuros = valor_formatter(data.valorJuros);

        if (valorJuros) {
          data.valorJuros = valorJuros;
        } else {
          data.valorJuros = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'valorOutrosAcrescimos') && data.valorOutrosAcrescimos) {
        let valorOutrosAcrescimos = valor_formatter(data.valorOutrosAcrescimos);

        if (valorOutrosAcrescimos) {
          data.valorOutrosAcrescimos = valorOutrosAcrescimos;
        } else {
          data.valorOutrosAcrescimos = null;
        }
      }

      loggerPagTesouro.info("[PagTesouro Request] %o", data);

      return data;
    }
  ].concat(axios.defaults.transformRequest),
  transformResponse: axios.defaults.transformResponse.concat(
    (rawData) => {
      loggerPagTesouro.info("[PagTesouro Response] %o", rawData);

      if (Object.prototype.hasOwnProperty.call(rawData, 'dataCriacao') && rawData.dataCriacao) {
        let dataUTC = dayjs.tz(rawData.dataCriacao, 'America/Sao_Paulo').toISOString();

        if (dataUTC) {
          rawData.dataCriacao = dataUTC;
        } else {
          rawData.dataCriacao = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(rawData, 'situacao') && Object.prototype.hasOwnProperty.call(rawData.situacao, 'data') && rawData.situacao.data) {
        let dataUTC = dayjs.tz(rawData.situacao.data, 'America/Sao_Paulo').toISOString();

        if (dataUTC) {
          rawData.situacao.data = dataUTC;
        } else {
          rawData.situacao.data = null;
        }
      }

      if (Object.prototype.hasOwnProperty.call(rawData, 'valor') && rawData.valor) {
        let valor = parseFloat(rawData.valor); // Coverte para FLOAT.
        valor = valor.toFixed(2); // Adiciona duas casas decimais ou ajusta as existentes para no máximo duas.
        valor = String((valor)).replace('.', ''); // Retira o ponto.
        valor = parseInt(valor); // Converte para INT.
        if (valor) {
          rawData.valor = valor;
        } else {
          rawData.valor = null;
        }
      }

      return rawData;
    },
  ),
});

/* Logs */
pagtesouro.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  loggerPagTesouro.error("[PagTesouro Request Error] %o", error);
  return Promise.reject(error);
});

pagtesouro.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  loggerPagTesouro.error("[PagTesouro Response Error] %o", error);
  return Promise.reject(error);
});

module.exports = pagtesouro;
