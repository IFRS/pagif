const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Unidade = new Schema({
  nome: { type: String, required: true },
  slug: { type: String, required: true, index: { unique: true } },
  token: { type: String, required: true, index: { unique: true } },
}, { timestamps: true });

module.exports = mongoose.model('Unidade', Unidade);
