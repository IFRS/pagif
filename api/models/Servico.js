const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Servico = new Schema({
  unidade: { type: Schema.Types.ObjectId, ref: 'Unidade' },
  codigo: {type: Number, required: true },
  nome: { type: String, required: true },
  desc: { type: String },
  vencimento_dias: { type: Number },
  valor_fixo: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Servico', Servico);
