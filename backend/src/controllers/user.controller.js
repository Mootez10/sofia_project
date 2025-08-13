const bcrypt = require('bcrypt'); // ✅ You were missing this
const userService = require('../services/user.service');
const User = require('../models/User.model');

// ✅ Create a new user
// Route: POST /api/users/add
// Access: Private (admin only or similar logic)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, description } = req.body;
    const picture = req.file ? `/api/uploads/${req.file.filename}` : null;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      description,
      picture,
    });

    return res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    // 👇 show the real reason in server logs
    console.error('Create user error:', err.stack || err);

    // duplicate key (email already exists)
    if (err && (err.code === 11000 || err.message?.includes('duplicate key'))) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    // mongoose validation errors
    if (err?.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    // our own thrown messages
    if (err?.message === 'Email already in use' || err?.message === 'Name, email, and password are required.') {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all users
exports.getUsers = async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get single user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update user (name, email, picture)
// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, description, password } = req.body;

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (role) updatedFields.role = role;
    if (description) updatedFields.description = description;
    if (password) updatedFields.password = await bcrypt.hash(password, 10);

    // ✅ use backticks
    if (req.file) updatedFields.picture = `/api/uploads/${req.file.filename}`;

    const updatedUser = await userService.updateUser(userId, updatedFields);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get current authenticated user's profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User Not Found' });
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
