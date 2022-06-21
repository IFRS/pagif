const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Servico = new Schema({
  unidade: { type: Schema.Types.ObjectId, ref: 'Unidade' },
  codigo: {type: Number, required: true },
  nome: { type: String, required: true },
  desc: { type: String },
  vencimentoDias: { type: Number },
  valorPadrao: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Servico', Servico);
