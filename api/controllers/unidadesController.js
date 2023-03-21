const Unidade = require('../../db/models/Unidade');
const validator = require('express-validator');
import { createMongoAbility } from '@casl/ability';

module.exports.listPublic = function(req, res) {
  const query = Unidade.find({});

  query.select('-token');

  query.sort('nome');

  query.exec(function(err, unidades) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro obtendo Unidades.',
      });
    }
    return res.json(unidades.map(doc => doc.toJSON()));
  });
};

module.exports.list = function(req, res) {
  const ability = createMongoAbility(req.user.abilities);
  let fields = req.query.fields?.split(',');

  const query = Unidade.find({}).accessibleBy(ability);

  if (Array.isArray(fields)) {
    query.select(fields);
  }

  query.select('-token');

  query.sort('nome');

  query.exec(function(err, unidades) {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: 'Erro obtendo Unidades.',
      });
    }
    return res.json(unidades.map(doc => doc.toJSON()));
  });
};

module.exports.showPublic = function(req, res) {
  const query = Unidade.findById(req.params.id);

  query.select('-token');

  query.exec(function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo a Unidade.',
      });
    }

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.toJSON());
  });
};

module.exports.show = function(req, res) {
  let fields = req.query.fields?.split(',');

  const query = Unidade.findById(req.params.id);

  if (Array.isArray(fields)) {
    query.select(fields);
  }

  query.select('-token');

  query.exec(function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo a Unidade.',
      });
    }

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.toJSON());
  });
};

module.exports.token = function(req, res) {
  Unidade.findById(req.params.id).select('token').exec(function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro obtendo o token da Unidade.',
      });
    }

    if (!unidade) {
      return res.status(404).json({
        message: 'Unidade não encontrada.',
      });
    }

    return res.json(unidade.token);
  });
};

module.exports.save = [
  validator.body('nome', '')
    .trim()
    .notEmpty(),
  validator.body('slug', '')
    .trim()
    .notEmpty()
    .isSlug(),
  validator.body('token', '')
    .trim()
    .notEmpty(),
  validator.body('imagem', '')
    .optional({ checkFalsy: true })
    .isDataURI(),
  validator.body('link_url', '')
    .trim()
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['http','https'], require_protocol: true }),
  validator.body('link_titulo', '')
    .trim()
    .optional({ checkFalsy: true })
    .isString(),
  validator.body('contato', '')
    .optional({ checkFalsy: true })
    .isString(),
  function(req, res) {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const data = {
      nome: req.body.nome,
      slug: req.body.slug,
      token: req.body.token,
      imagem: req.body.imagem,
      link_url: req.body.link_url,
      link_titulo: req.body.link_titulo,
      contato: req.body.contato,
    };

    if (req.params.id) {
      Unidade.findByIdAndUpdate(
        req.params.id,
        data,
        { returnDocument: 'after' },
        function(err, unidade) {
          if (!unidade) {
            return res.status(404).json({
              message: 'Unidade não encontrada.',
            });
          }

          if (err) {
            return res.status(500).json({
              message: 'Erro atualizando Unidade.',
            });
          }

          return res.json(unidade.toJSON());
        }
      );
    } else {
      let unidade = new Unidade(data);

      unidade.save(function(err, unidade) {
        if (err) {
          return res.status(500).json({
            message: 'Erro ao adicionar a Unidade.',
            error: err,
          });
        }

        return res.json(unidade.toJSON());
      });
    }
  }
];

module.exports.delete = function(req, res) {
  Unidade.findByIdAndRemove(req.params.id, function(err, unidade) {
    if (err) {
      return res.status(500).json({
        message: 'Erro ao remover a Unidade.',
      });
    }

    return res.json(unidade.toJSON());
  });
};
