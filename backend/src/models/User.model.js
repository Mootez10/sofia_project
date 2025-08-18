const mongoose = require("mongoose");

/**
 * User schema
 *
 * Fields:
 * - name        : String (required, unique) – display name/username.
 * - email       : String (required, unique) – login identifier.
 * - password    : String (required) – store a HASH, never plaintext.
 * - picture     : String (optional) – avatar URL or file path.
 * - role        : String (required) – e.g., 'admin', 'manager', 'user'.
 * - description : String (optional) – bio/notes.
 *
 * Notes:
 * - `unique: true` sets up a unique index; ensure indexes are built in MongoDB.
 * - Consider `{ timestamps: true }` in schema options for createdAt/updatedAt.
 * - Consider `select: false` on `password` to exclude it by default in queries.
 */

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String },
  role: {
    type: String,
    required: true,
  },
  description: String,
});

module.exports = mongoose.model("User", userSchema);
