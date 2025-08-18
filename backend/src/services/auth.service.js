const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const MSG = require("../constants/messages");
const User = require("../models/User.model");

// ✅ Register user
// Input: { name, email, password, picture, roleName }
// Output: new user object or throws error
const registerUser = async ({ name, email, password, picture, roleName }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error(MSG.EMAIL_ALREADY_USED);

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUsers = await User.find();

    // First user becomes admin
    const role = existingUsers.length === 0 ? "admin" : roleName;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      picture: picture ? `/api/uploads/${picture}` : null,
      role,
    });

    await newUser.save();
    return newUser;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("registerUser error:", err);
    }
    throw err;
  }
};

// ✅ Login user
// Input: { email, password }
// Output: { token, user } or throws error
const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error(MSG.INVALID_LOGIN_RESPONSE);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error(MSG.INVALID_LOGIN_RESPONSE);

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("loginUser error:", err);
    }
    throw err;
  }
};

module.exports = { registerUser, loginUser };
