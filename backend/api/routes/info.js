const { Router } = require('express');
const requireAbility = require('../middleware/requireAbility');

const Unidade = require('../../db/models/Unidade');
const Servico = require('../../db/models/Servico');
const Pagamento = require('../../db/models/Pagamento');

const router = Router();

router.get('/info/count', requireAbility(), async (req, res) => {
  const unidades = Unidade.countDocuments().exec();
  const servicos = Servico.countDocuments().exec();
  const pagamentos = Pagamento.countDocuments().exec();

  await Promise.allSettled([ unidades, servicos, pagamentos ])
  .then(responses => {
    let result = {}
    if (responses[0].status === 'fulfilled') result.unidades = responses[0].value;
    if (responses[1].status === 'fulfilled') result.servicos = responses[1].value;
    if (responses[2].status === 'fulfilled') result.pagamentos = responses[2].value;
    res.json(result);
  });
});

module.exports = router;