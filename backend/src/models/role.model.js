const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  // actions: {
  //   type: [String], // Array of frontend interfaces/pages
  //   default: []
  // }
});

module.exports = mongoose.model('Role', roleSchema);
