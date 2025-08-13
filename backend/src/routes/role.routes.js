const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const authenticateUser = require('../middlewares/authenticateUser');

// 🔒 Protect all role routes
router.use(authenticateUser);

// ✅ Create a new role
// POST /api/roles
router.post('/', roleController.createRole);

// ✅ Get all roles
// GET /api/roles
router.get('/', roleController.getRoles);

// ✅ Get a role by ID
// GET /api/roles/:id
router.get('/:id', roleController.getRole);

// ✅ Update a role
// PUT /api/roles/:id
router.put('/:id', roleController.updateRole);

// ✅ Delete a role
// DELETE /api/roles/:id
router.delete('/:id', roleController.deleteRole);


router.post('/create-role-with-actions', roleController.createRoleWithActions);

router.get('/:id/actions', roleController.getRoleWithActions);

module.exports = router;
