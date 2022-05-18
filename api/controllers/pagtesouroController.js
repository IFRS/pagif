const validator = require('express-validator');
const pagtesouro = require('../pagtesouro');

module.exports.pagar = [
  validator.body('codigoServico', '').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 1, max: 5 }),
  validator.body('referencia', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 1, max: 20 }),
  validator.body('competencia', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 6, max: 6 }).isDate({ format: 'MMYYYY' }),
  validator.body('vencimento', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 8, max: 8 }).isDate({ format: 'DDMMYYYY' }),
  validator.body('expiracaoPix', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 1, max: 2 }).isIn({ min: 1, max: 23 }),
  validator.body('cnpjCpf', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 14, max: 14 }),
  validator.body('nomeContribuinte', '').notEmpty().isAlphanumeric().isLength({ min: 1, max: 45 }),
  validator.body('valorPrincipal', '').notEmpty().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 17 }),
  validator.body('valorDescontos', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 17 }),
  validator.body('valorOutrasDeducoes', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 17 }),
  validator.body('valorMulta', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 17 }),
  validator.body('valorJuros', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 17 }),
  validator.body('valorOutrosAcrescimos', '').optional().isNumeric({ no_symbols: true }).isLength({ min: 3, max: 17 }),
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
      console.error(error);
      return res.json({});
    });
  }
];
