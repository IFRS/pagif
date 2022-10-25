const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  nome: { type: String },
  foto: { type: String },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
  },
});

module.exports = mongoose.model('Usuario', Usuario);
