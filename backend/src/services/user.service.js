const User = require('../models/User');

// ✅ Create a new user
// Input:
//   - userData: { name, emailAdress, password, role, description, picture }
// Output:
//   - saved user object
exports.createUser = async (userData) => {
  const { emailAdress } = userData;

  // Check for existing user
  const existingUser = await User.findOne({ email: emailAdress });
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const newUser = new User({
    name: userData.name,
    email: emailAdress,
    password: userData.password, // You can hash here if needed
    role: userData.role || 'user',
    description: userData.description,
    picture: userData.picture || null,
  });

  return await newUser.save();
};

// Get all users from the database (excluding passwords)
// Input: none
// Output: Array of user objects without passwords
exports.getAllUsers = async () => {
  return await User.find().select('-password');
};

// Get a specific user by ID (excluding password)
// Input: id (String) - the ID of the user
// Output: user object without password, or null if not found
exports.getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

// Update a user by ID
// Input:
//   - userId (String): the ID of the user to update
//   - updateData (Object): fields to update (e.g., name, email, picture)
// Output: updated user object without password, or null if not found
exports.updateUser = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, {
    new: true, // return the updated document
    runValidators: true // apply schema validation
  }).select('-password');
};

// Delete a user by ID
// Input: id (String) - the ID of the user to delete
// Output: deleted user object, or null if not found
exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
