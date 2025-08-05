const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
const registerUser = async ({ name, email, password, picture, roleName }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUsers = await User.find();

  // First user becomes admin
  const role = existingUsers.length === 0 ? 'admin' : roleName;

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    picture: picture ? `/api/uploads/${picture}` : null,
    role,
  });

  await newUser.save();
  return newUser;
};

// Authenticate user and return JWT + full user object (including role)
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // ✅ Return full user object (at least name, email, role)
  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture
    }
  };
};

module.exports = { registerUser, loginUser };
