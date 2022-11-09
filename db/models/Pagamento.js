const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pagamento = new Schema({
  _id: { type: String, alias: 'idPagamento' },
  token: { type: String, immutable: true, required: true },
  unidade: { type: String, immutable: true, required: true },
  nomeUnidade: { type: String, immutable: true, required: true },
  nomeServico: { type: String, immutable: true, required: true },
  codigoServico: { type: Number, immutable: true, required: true },
  referencia: { type: Number, immutable: true },
  competencia: { type: String, immutable: true },
  vencimento: { type: String, immutable: true },
  nomeContribuinte: { type: String, immutable: true, required: true },
  cnpjCpf: { type: String, immutable: true },
  valorPrincipal: { type: Number, immutable: true, required: true, min: [0, 'valorPrincipal não pode ser um número negativo.'] },
  valorDescontos: { type: Number, immutable: true, min: [0, 'valorDescontos não pode ser um número negativo.'] },
  valorOutrasDeducoes: { type: Number, immutable: true, min: [0, 'valorOutrasDeducoes não pode ser um número negativo.'] },
  valorMulta: { type: Number, immutable: true, min: [0, 'valorMulta não pode ser um número negativo.'] },
  valorJuros: { type: Number, immutable: true, min: [0, 'valorJuros não pode ser um número negativo.'] },
  valorOutrosAcrescimos: { type: Number, immutable: true, min: [0, 'valorOutrosAcrescimos não pode ser um número negativo.'] },
  dataCriacao: { type: Date, immutable: true },
  proximaUrl: { type: String, immutable: true },
  situacao: {
    codigo: String,
    data: Date,
  },
  tipoPagamentoEscolhido: { type: String },
  valor: { type: Number },
  nomePSP: { type: String },
  transacaoPSP: { type: String },
}, {
  id: false,
  toJSON: {
    virtuals: true,
    versionKey: false,
  },
});

module.exports = mongoose.model('Pagamento', Pagamento);
