const validator = require('express-validator');
const pagtesouro = require('../pagtesouro');

function sanitizeValor(valor) {
  return valor.replace(',', '.');
}

module.exports.pagar = [
  validator.body('codigoServico', '')
    .notEmpty()
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 1, max: 5 }),
  validator.body('referencia', '')
    .optional()
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 1, max: 20 }),
  validator.body('competencia', '')
    .optional()
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 6, max: 6 })
    .isDate({ format: 'MMYYYY' }),
  validator.body('vencimento', '')
    .optional()
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 8, max: 8 })
    .isDate({ format: 'DDMMYYYY' }),
  validator.body('expiracaoPix', '')
    .optional()
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 1, max: 2 })
    .isIn({ min: 1, max: 23 }),
  validator.body('cnpjCpf', '')
    .optional()
    .trim()
    .isNumeric({ no_symbols: true })
    .isLength({ min: 11, max: 14 }),
  validator.body('nomeContribuinte', '')
    .notEmpty()
    .trim()
    .isAlpha('pt-BR', { ignore: ' _-' })
    .isLength({ min: 1, max: 45 }),
  validator.body('valorPrincipal', '')
    .notEmpty()
    .trim()
    .customSanitizer(sanitizeValor)
    .isDecimal({ decimal_digits: 2 })
    .isLength({ min: 4, max: 18 }),
  validator.body('valorDescontos', '')
    .optional()
    .trim()
    .customSanitizer(sanitizeValor)
    .isDecimal({ decimal_digits: 2 })
    .isLength({ min: 4, max: 18 }),
  validator.body('valorOutrasDeducoes', '')
    .optional()
    .trim()
    .customSanitizer(sanitizeValor)
    .isDecimal({ decimal_digits: 2 })
    .isLength({ min: 4, max: 18 }),
  validator.body('valorMulta', '')
    .optional()
    .trim()
    .customSanitizer(sanitizeValor)
    .isDecimal({ decimal_digits: 2 })
    .isLength({ min: 4, max: 18 }),
  validator.body('valorJuros', '')
    .optional()
    .trim()
    .customSanitizer(sanitizeValor)
    .isDecimal({ decimal_digits: 2 })
    .isLength({ min: 4, max: 18 }),
  validator.body('valorOutrosAcrescimos', '')
    .optional()
    .trim()
    .customSanitizer(sanitizeValor)
    .isDecimal({ decimal_digits: 2 })
    .isLength({ min: 4, max: 18 }),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    pagtesouro.post('/api/gru/solicitacao-pagamento', {
      'codigoServico': req.body.codigoServico,
      'nomeContribuinte': req.body.nomeContribuinte,
      'valorPrincipal': req.body.valorPrincipal,
    })
    .then((response) => {
      return res.json(response.data);
    })
    .catch((error) => {
      return res.json(error);
    });
  }
];
