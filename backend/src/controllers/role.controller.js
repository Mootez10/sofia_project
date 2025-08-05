const roleService = require('../services/role.service');

// ✅ Create new role
exports.createRole = async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (err) {
    console.error('Create role error:', err);
    if (err.message === 'Role already exists') {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err) {
    console.error('Fetch roles error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get role by ID
exports.getRole = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (err) {
    console.error('Get role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update role
exports.updateRole = async (req, res) => {
  try {
    const updatedRole = await roleService.updateRole(req.params.id, req.body);
    if (!updatedRole) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role updated successfully', role: updatedRole });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete role
exports.deleteRole = async (req, res) => {
  try {
    const deleted = await roleService.deleteRole(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    console.error('Delete role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
