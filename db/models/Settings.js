const mongoose = require('mongoose');

const Settings = new mongoose.Schema({
  sigla: {
    type: String,
    required: true
  },
  nome: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
},
{
  timestamps: false,
  toJSON: {
    versionKey: false,
  },
  capped: {
    max: 1,
    size: 999999,
  },
});

module.exports = mongoose.model('Settings', Settings);
