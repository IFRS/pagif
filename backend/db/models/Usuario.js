import mongoose from 'mongoose';

const Usuario = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  nome: { type: String },
  foto: { type: String },
  abilities: [{}],
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
  },
});

export default mongoose.model('Usuario', Usuario);
