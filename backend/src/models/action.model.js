const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  path: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Action', actionSchema);
