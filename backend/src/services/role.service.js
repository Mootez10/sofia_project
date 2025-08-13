// services/role.service.js
const mongoose = require('mongoose');             // ✅ ADD THIS LINE
const Role = require('../models/role.model');
const Action = require('../models/action.model');
const RoleAction = require('../models/role_action.model');

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
exports.getAllRoles = async () => Role.find();

// ✅ Get a role by ID
exports.getRoleById = async (id) => Role.findById(id);

// ✅ Update a role
exports.updateRole = async (id, updateData) => {
  return await Role.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

// ✅ Delete a role
exports.deleteRole = async (id) => Role.findByIdAndDelete(id);

// ✅ Create role + link action IDs (atomic with transaction)
exports.createRoleWithActions = async (roleName, description, actionIds = []) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const exists = await Role.findOne({ name: roleName }).session(session);
      if (exists) throw new Error('Role already exists');

      const role = await Role.create([{ name: roleName, description }], { session });
      const createdRole = role[0];

      // Validate actions
      const ids = actionIds.map(id => new mongoose.Types.ObjectId(id));
      const validActions = await Action.find({ _id: { $in: ids } }).session(session);
      if (validActions.length !== ids.length) {
        throw new Error('One or more actions are invalid');
      }

      // Link RoleAction docs
      const links = validActions.map(a => ({
        roleId: createdRole._id,
        actionId: a._id
      }));
      if (links.length) {
        await RoleAction.insertMany(links, { session });
      }
    });

    // Return created role + actions after commit
    const role = await Role.findOne({ name: roleName });
    const actions = await Action.find({ _id: { $in: actionIds } });
    return { role, actions };
  } finally {
    session.endSession();
  }
};

// ✅ Fetch role + actions via RoleAction; fallback to Role.actions (names)
exports.getRoleWithActionsById = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) throw new Error('Role not found');

  const roleActions = await RoleAction.find({ roleId }).populate('actionId');
  let actions = roleActions.map(ra => ra.actionId).filter(Boolean);

  if (!actions.length && Array.isArray(role.actions) && role.actions.length) {
    actions = await Action.find({ name: { $in: role.actions } });
  }

  return { role, actions };
};
