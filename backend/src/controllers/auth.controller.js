const { registerUser, loginUser } = require('../services/auth.service');

// ✅ Handle user registration
// ✅ Handle user registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role: roleName } = req.body; // ⬅️ include role
    const picture = req.file ? req.file.filename : null;

    const user = await registerUser({ name, email, password, picture, roleName }); // ⬅️ pass roleName

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({ message: error.message });
  }
};


// ✅ Handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    // Add this check 👇
    if (!result || !result.token || !result.user) {
      return res.status(400).json({ message: 'Invalid login response' });
    }

    // Send both token and user
    res.json({
      token: result.token,
      user: {
        role: result.user.role,
        name: result.user.name,
        email: result.user.email,
        id: result.user._id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
};

