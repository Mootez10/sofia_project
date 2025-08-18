const mongoose = require("mongoose");
/**
 * Role schema
 *
 * Fields:
 * - name        : String (required, unique) – human-readable role name (e.g., "Admin").
 * - description : String (required) – brief summary of what the role can do.
 *
 * Notes:
 * - `unique: true` creates a unique index; ensure indexes are built in MongoDB.
 * - Consider `{ timestamps: true }` in schema options to add createdAt/updatedAt.
 * - If you manage permissions separately, you can relate them here
 *   (e.g., `permissions: [{ type: Schema.Types.ObjectId, ref: 'Action' }]`).
 */

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
