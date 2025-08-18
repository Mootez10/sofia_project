const bcrypt = require("bcrypt");

const MSG = require("../constants/messages");
const User = require("../models/User.model");
const userService = require("../services/user.service");

// ✅ Create a new user
// Input: req.body { name, email, password, role, description }, req.file (picture)
// Output: 201 { message, user } or error
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, description } = req.body;
    const picture = req.file ? `/api/uploads/${req.file.filename}` : null;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: MSG.NAME_EMAIL_PASSWORD_REQUIRED });
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

    return res.status(201).json({ message: MSG.USER_CREATED_SUCCESS, user });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("createUser error:", err);
    }
    // duplicate key (email already exists)
    if (err && (err.code === 11000 || err.message?.includes("duplicate key"))) {
      return res.status(400).json({ message: MSG.EMAIL_ALREADY_USED });
    }
    // mongoose validation errors
    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    // our own thrown messages
    if (
      err?.message === MSG.EMAIL_ALREADY_USED ||
      err?.message === MSG.NAME_EMAIL_PASSWORD_REQUIRED
    ) {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Get all users
// Input: none
// Output: 200 [users] or error
exports.getUsers = async (_req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("getUsers error:", error);
    }
    return res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Get single user by ID
// Input: req.params.id
// Output: 200 {user} or 404/500 error
exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: MSG.USER_NOT_FOUND });
    return res.json(user);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("getUser error:", error);
    }
    return res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Update user (name, email, picture)
// Input: req.params.id, req.body { name, email, role, description, password }, req.file (picture)
// Output: 200 { message, user } or error
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
    if (!updatedUser)
      return res.status(404).json({ message: MSG.USER_NOT_FOUND });

    return res
      .status(200)
      .json({ message: MSG.USER_UPDATED_SUCCESS, user: updatedUser });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("updateUser error:", error);
    }
    return res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Delete user by ID
// Input: req.params.id
// Output: 200 { message } or error
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: MSG.USER_NOT_FOUND });
    return res.json({ message: MSG.USER_DELETED_SUCCESS });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("deleteUser error:", error);
    }
    return res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Get current authenticated user's profile
// Input: req.user.userId
// Output: 200 { user } or error
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: MSG.USER_NOT_FOUND });
    return res.status(200).json({ user });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("getUserProfile error:", error);
    }
    return res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};
