const Role = require('../models/role.model');

// ✅ Create a role
exports.createRole = async (data) => {
  const exists = await Role.findOne({ name: data.name });
  if (exists) throw new Error('Role already exists');

  const role = new Role({
    name: data.name,
    description: data.description,
    actions: data.actions || []
  });

  return await role.save();
};

// ✅ Get all roles
exports.getAllRoles = async () => {
  return await Role.find();
};

// ✅ Get a role by ID
exports.getRoleById = async (id) => {
  return await Role.findById(id);
};

// ✅ Update a role
exports.updateRole = async (id, updateData) => {
  return await Role.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

// ✅ Delete a role
exports.deleteRole = async (id) => {
  return await Role.findByIdAndDelete(id);
};
