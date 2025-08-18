const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const upload = require("../middlewares/upload");

// ✅ Register (with optional profile picture)
router.post("/signup", upload.single("picture"), authController.register);

// ✅ Login
router.post("/signin", authController.login);

module.exports = router;
