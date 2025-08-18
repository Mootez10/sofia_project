// services/role.service.js
const mongoose = require("mongoose");

const MSG = require("../constants/messages");
const Action = require("../models/action.model");
const Role = require("../models/role.model");
const RoleAction = require("../models/role_action.model");

// ✅ Create role
// Input: { name, description, actions }
// Output: role object or throws error
exports.createRole = async (data) => {
  try {
    const exists = await Role.findOne({ name: data.name });
    if (exists) throw new Error(MSG.ROLE_ALREADY_EXISTS);

    const role = new Role({
      name: data.name,
      description: data.description,
      actions: data.actions || [],
    });

    return await role.save();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("createRole error:", err);
    }
    throw err;
  }
};

// ✅ Get all roles
// Input: none
// Output: array of roles
exports.getAllRoles = async () => {
  try {
    return Role.find();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("getAllRoles error:", err);
    }
    throw err;
  }
};

// ✅ Get role by ID
// Input: id
// Output: role object
exports.getRoleById = async (id) => {
  try {
    return Role.findById(id);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("getRoleById error:", err);
    }
    throw err;
  }
};

// ✅ Update role
// Input: id, updateData
// Output: updated role object
exports.updateRole = async (id, updateData) => {
  try {
    return await Role.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("updateRole error:", err);
    }
    throw err;
  }
};

// ✅ Delete role
// Input: id
// Output: deleted role object
exports.deleteRole = async (id) => {
  try {
    return Role.findByIdAndDelete(id);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("deleteRole error:", err);
    }
    throw err;
  }
};

// ✅ Create role with actions (transaction)
// Input: roleName, description, actionIds[]
// Output: { role, actions } or throws error
exports.createRoleWithActions = async (
  roleName,
  description,
  actionIds = [],
) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const exists = await Role.findOne({ name: roleName }).session(session);
      if (exists) throw new Error(MSG.ROLE_ALREADY_EXISTS);

      const role = await Role.create([{ name: roleName, description }], {
        session,
      });
      const createdRole = role[0];

      // Validate actions
      const ids = actionIds.map((id) => new mongoose.Types.ObjectId(id));
      const validActions = await Action.find({ _id: { $in: ids } }).session(
        session,
      );
      if (validActions.length !== ids.length) {
        throw new Error(MSG.FAILED_TO_LOAD_ACTIONS);
      }

      // Link RoleAction docs
      const links = validActions.map((a) => ({
        roleId: createdRole._id,
        actionId: a._id,
      }));
      if (links.length) {
        await RoleAction.insertMany(links, { session });
      }
    });

    // Return created role + actions after commit
    const role = await Role.findOne({ name: roleName });
    const actions = await Action.find({ _id: { $in: actionIds } });
    return { role, actions };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("createRoleWithActions error:", err);
    }
    throw err;
  } finally {
    session.endSession();
  }
};

// ✅ Get role with actions
// Input: roleId
// Output: { role, actions } or throws error
exports.getRoleWithActionsById = async (roleId) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) throw new Error(MSG.ROLE_NOT_FOUND);

    const roleActions = await RoleAction.find({ roleId }).populate("actionId");
    let actions = roleActions.map((ra) => ra.actionId).filter(Boolean);

    if (!actions.length && Array.isArray(role.actions) && role.actions.length) {
      actions = await Action.find({ name: { $in: role.actions } });
    }

    return { role, actions };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("getRoleWithActionsById error:", err);
    }
    throw err;
  }
};
