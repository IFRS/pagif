const mongoose = require('mongoose');

const Unidade = new mongoose.Schema({
  nome: { type: String, required: true },
  slug: { type: String, required: true, index: { unique: true } },
  token: { type: String, required: true, index: { unique: true } },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
  },
});

module.exports = mongoose.model('Unidade', Unidade);
