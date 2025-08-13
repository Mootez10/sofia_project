const mongoose = require('mongoose');

const roleActionSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  actionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Action',
    required: true
  }
}, {
  timestamps: true
});

roleActionSchema.index({ roleId: 1, actionId: 1 }, { unique: true });

module.exports = mongoose.model('RoleAction', roleActionSchema);
