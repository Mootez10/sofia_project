const { registerUser, loginUser } = require('../services/auth.service');
const MSG = require('../constants/messages');

// ✅ Handle user registration
// ✅ Handle user registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role: roleName } = req.body; // ⬅️ include role
    const picture = req.file ? req.file.filename : null;

    const user = await registerUser({ name, email, password, picture, roleName }); // ⬅️ pass roleName

    res.status(201).json({ message: MSG.USER_REGISTERED_SUCCESS, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// ✅ Handle user login
// ✅ Handle user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    if (!result || !result.token) {
      return res.status(400).json({ message: MSG.INVALID_LOGIN_RESPONSE });
    }

    // ✅ ONLY token
    return res.json({ token: result.token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


