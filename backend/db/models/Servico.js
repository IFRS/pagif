import mongoose from 'mongoose';

const Servico = new mongoose.Schema({
  unidade: { type: mongoose.Schema.Types.ObjectId, ref: 'Unidade' },
  codigo: { type: Number, required: true },
  nome: { type: String, required: true },
  desc: { type: String },
  referencia_required: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
  },
});

export default mongoose.model('Servico', Servico);
