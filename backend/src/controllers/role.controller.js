const roleService = require('../services/role.service');
const MSG = require('../constants/messages');

// ✅ Create new role
exports.createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json({ message: MSG.ROLE_CREATED_SUCCESS, role });
  } catch (err) {
    if (err.message === MSG.ROLE_ALREADY_EXISTS) {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};



// ✅ Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Get role by ID
exports.getRole = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: MSG.ROLE_NOT_FOUND });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Update role
exports.updateRole = async (req, res) => {
  try {
    const updatedRole = await roleService.updateRole(req.params.id, req.body);
    if (!updatedRole) return res.status(404).json({ message: MSG.ROLE_NOT_FOUND });
    res.json({ message: MSG.ROLE_UPDATED_SUCCESS, role: updatedRole });
  } catch (err) {
    res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};

// ✅ Delete role
exports.deleteRole = async (req, res) => {
  try {
    const deleted = await roleService.deleteRole(req.params.id);
    if (!deleted) return res.status(404).json({ message: MSG.ROLE_NOT_FOUND });
    res.json({ message: MSG.ROLE_DELETED_SUCCESS });
  } catch (err) {
    res.status(500).json({ message: MSG.SERVER_ERROR });
  }
};





// ✅ POST /api/roles/create-role-with-actions
exports.createRoleWithActions = async (req, res) => {
  try {
    const { roleName, description, actionIds } = req.body; // actionIds: string[]
    const result = await roleService.createRoleWithActions(roleName, description, actionIds || []);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ✅ GET /api/roles/:id/actions
exports.getRoleWithActions = async (req, res) => {
  try {
    const result = await roleService.getRoleWithActionsById(req.params.id);
    res.json(result);
  } catch (err) {
    const code = err.message === MSG.ROLE_NOT_FOUND ? 404 : 500;
    res.status(code).json({ message: err.message });
  }

};
