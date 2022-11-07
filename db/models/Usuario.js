const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const Role = new Schema({
//   tipo: { type: String },
//   unidade: { type: Schema.Types.ObjectId, ref: 'Unidade' },
// }, {
//   _id : false,
//   toJSON: {
//     versionKey: false,
//   },
// });

const Usuario = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  nome: { type: String },
  foto: { type: String },
  // superadmin: { type: Boolean, default: false },
  // roles: [Role],
  abilities: [{}],
}, {
  timestamps: true,
  toJSON: {
    versionKey: false,
  },
});

module.exports = mongoose.model('Usuario', Usuario);
