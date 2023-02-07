const logger = require('../logger');
const _ = require('lodash');
const axios = require('axios');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

function valor_formatter(valor) {
  valor_formatted = String(valor).padStart(3, '0');
  valor_formatted = valor_formatted.split('');
  valor_formatted.splice(-2, 0, '.');
  valor_formatted = valor_formatted.join('');
  return valor_formatted;
}

const pagtesouro = axios.create({
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

      let data = Object.keys(rawData)
      .filter((key => allowed_fields.includes(key)))
      .reduce((obj, key) => {
        obj[key] = rawData[key];
        return obj;
      }, {});

      data.urlRetorno = process.env.SERVER_BASE_URL + '/';
      data.urlNotificacao = process.env.SERVER_BASE_URL + '/api/notifica';

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
  transformResponse: axios.defaults.transformResponse.concat(
    (rawData) => {
      if (rawData.hasOwnProperty('dataCriacao') && rawData.dataCriacao) {
        let dataUTC = dayjs.tz(rawData.dataCriacao, 'America/Sao_Paulo').toISOString();

        if (dataUTC) {
          rawData.dataCriacao = dataUTC;
        } else {
          rawData.dataCriacao = null;
        }
      }

      if (rawData.hasOwnProperty('situacao') && rawData.situacao.hasOwnProperty('data') && rawData.situacao.data) {
        let dataUTC = dayjs.tz(rawData.situacao.data, 'America/Sao_Paulo').toISOString();

        if (dataUTC) {
          rawData.situacao.data = dataUTC;
        } else {
          rawData.situacao.data = null;
        }
      }

      if (rawData.hasOwnProperty('valor') && rawData.valor) {
        let valor = parseFloat(rawData.valor) * 100; // Converte o valor que chega em FLOAT em centavos.
        valor = String((valor)).replace('.', ''); // Retira o ponto, caso ainda tenha.
        valor = parseInt(valor); // Por fim, transforma em INT.
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
  logger.info("[PagTesouro Request] %o", _.pick(config, ['url', 'method', 'baseURL', 'headers', 'params', 'data', 'timeout', 'withCredentials', 'auth', 'responseType', 'responseEncoding', 'xsrfCookieName', 'xsrfHeaderName', 'maxContentLength', 'maxBodyLength', 'maxRedirects']));
  return config;
}, function (error) {
  logger.error("[PagTesouro Request Error] %o", error);
  return Promise.reject(error);
});

pagtesouro.interceptors.response.use(function (response) {
  logger.info("[PagTesouro Response] Status: %s; StatusText: %s; Data: %o; Headers: %o", response.status, response.statusText, response.data, response.headers);
  return response;
}, function (error) {
  logger.error("[PagTesouro Response Error] %o", error);
  return Promise.reject(error);
});

module.exports = pagtesouro;
