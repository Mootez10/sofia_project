// services/user.service.js
const User = require('../models/User.model');
const MSG = require('../constants/messages');

async function createUser({ name, email, password, role, description, picture }) {
  // Validate required fields (controller already validates, but double-check here)
  if (!name || !email || !password) {
    throw new Error(MSG.NAME_EMAIL_PASSWORD_REQUIRED);
  }

  // Unique by email
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error(MSG.EMAIL_ALREADY_USED);
  }

  // Create user (password is already hashed by controller)
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user',
    description: description || '',
    picture: picture || null,
  });

  // Never expose password
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

async function getAllUsers() {
  return User.find().select('-password');
}

async function getUserById(id) {
  return User.findById(id).select('-password');
}

async function updateUser(id, fields) {
  // If password is provided, ensure it is hashed (should be hashed in controller)
  if (fields?.password && !fields.password.startsWith('$2b$')) {
    throw new Error('Password must be hashed before updateUser');
  }

  const user = await User.findByIdAndUpdate(id, fields, {
    new: true,
    runValidators: true,
  }).select('-password');

  return user;
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id).select('-password');
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
