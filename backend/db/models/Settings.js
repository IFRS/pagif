import mongoose from 'mongoose';

const Settings = new mongoose.Schema({
  sigla: { type: String, required: true },
  orgao: { type: String, required: true },
  intro: { type: String, required: true },
  vencimento: { type: Number, required: true, min: [0, 'vencimento não pode ser um número negativo.'] },
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

export default mongoose.model('Settings', Settings);
