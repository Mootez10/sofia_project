const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');
const authController = require('../controllers/auth.controller');

// ✅ Register (with optional profile picture)
router.post('/signup', upload.single('picture'), authController.register);

// ✅ Login
router.post('/signin', authController.login);

module.exports = router;
