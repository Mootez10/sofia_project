// services/user.service.js
const MSG = require("../constants/messages");
const User = require("../models/User.model");

// ✅ Create user
// Input: { name, email, password, role, description, picture }
// Output: user object (without password) or throws error
async function createUser({
  name,
  email,
  password,
  role,
  description,
  picture,
}) {
  try {
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
      role: role || "user",
      description: description || "",
      picture: picture || null,
    });

    // Never expose password
    const obj = user.toObject();
    delete obj.password;
    return obj;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("createUser error:", err);
    }
    throw err;
  }
}

// ✅ Get all users
// Input: none
// Output: array of users (without password)
async function getAllUsers() {
  try {
    return User.find().select("-password");
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("getAllUsers error:", err);
    }
    throw err;
  }
}

// ✅ Get user by ID
// Input: id
// Output: user object (without password)
async function getUserById(id) {
  try {
    return User.findById(id).select("-password");
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("getUserById error:", err);
    }
    throw err;
  }
}

// ✅ Update user
// Input: id, fields
// Output: updated user object (without password)
async function updateUser(id, fields) {
  try {
    // If password is provided, ensure it is hashed (should be hashed in controller)
    if (fields?.password && !fields.password.startsWith("$2b$")) {
      throw new Error("Password must be hashed before updateUser");
    }

    const user = await User.findByIdAndUpdate(id, fields, {
      new: true,
      runValidators: true,
    }).select("-password");

    return user;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("updateUser error:", err);
    }
    throw err;
  }
}

// ✅ Delete user
// Input: id
// Output: deleted user object (without password)
async function deleteUser(id) {
  try {
    return User.findByIdAndDelete(id).select("-password");
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("deleteUser error:", err);
    }
    throw err;
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
