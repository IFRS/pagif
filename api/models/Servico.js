const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Servico = new Schema({
  unidade: { type: Schema.Types.ObjectId, ref: 'Unidade' },
  codigo: { type: Number, required: true },
  nome: { type: String, required: true },
  desc: { type: String },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
  },
});

module.exports = mongoose.model('Servico', Servico);
