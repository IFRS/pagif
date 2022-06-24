const Pagamento = require('../models/Pagamento');
const validator = require('express-validator');
const pagtesouro = require('../pagtesouro');

module.exports.handle = [
  validator.body('idPagamento', 'Identificador do Pagamento está num formato inválido.')
    .trim()
    .notEmpty()
    .isAlphanumeric()
    .isLength({ max: 50 }),
  function(req, res, next) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      let errorList = [];

      errors.array().forEach((error) => {
        errorList.push({
          codigo: 'C0007',
          descricao: error.msg,
        });
      })

      return res.status(422).json(errorList);
    }

    // TODO: Verificar se o token enviado no header confere com o da UG do Pagamento informado.

    Pagamento.findOne({ idPagamento: req.body.idPagamento }, (err, pagamento) => {
      if (err) {
        console.error('Erro buscando o Pagamento: ' + err);
        return res.status(500).json([{
          codigo: 'C0027',
          descricao: 'Falha ao verificar a situação do pagamento.',
        }]);
      }

      if (!pagamento) {
        return res.status(422).json([{
          codigo: 'C0023',
          descricao: 'Pagamento inexistente.',
        }]);
      }

      next();
    });
  }
];
