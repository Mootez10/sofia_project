const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const User = require('../models/User');
const authenticateUser = require('../middlewares/authenticateUser'); // ✅ not destructured
const upload = require('../middlewares/upload');

// 🔒 Apply authentication to all user routes
router.use(authenticateUser);

router.post('/add', upload.single('picture'), userController.createUser);


// ✅ GET current user profile — GET /api/users/profile
router.get('/profile', authenticateUser, userController.getUserProfile);

// ✅ GET all users — GET /api/users
router.get('/', authenticateUser,userController.getUsers);

// ✅ GET single user by ID — GET /api/users/:id
router.get('/:id', authenticateUser,userController.getUser);

// ✅ UPDATE user (with optional image upload) — PUT /api/users/:id
router.put('/:id', authenticateUser,upload.single('picture'), userController.updateUser);

// ✅ DELETE user — DELETE /api/users/:id
router.delete('/:id', authenticateUser,userController.deleteUser);




module.exports = router;
