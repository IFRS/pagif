const Pagamento = require('../../db/models/Pagamento');
const validator = require('express-validator');

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

    const authorization_header = req.headers['authorization'];
    let bearer_token = null;

    if (authorization_header) {
      const bearer = authorization_header.split(' ');

      if (bearer[0] === 'Bearer') {
        bearer_token = bearer[1];
      }
    }

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

      if (pagamento.token && pagamento.token !== bearerToken) {
        return res.status(422).json([{
          codigo: 'C0035',
          descricao: 'Token de autenticação inválido ou inexistente.',
        }]);
      }

      next();
    });
  }
];
