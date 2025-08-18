const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const Action = require("../../models/action.model");

const MONGODB_URI = process.env.mongodb_URL;

const actions = [
  { name: "dashboard", path: "/dashboard" },
  { name: "add-user", path: "/dashboard/users/add" },
  { name: "edit-user", path: "/dashboard/users/edit/:id" },
  { name: "view-user", path: "/dashboard/users/view/:id" },
  { name: "delete-user", path: "/dashboard/users/delete/:id" },
  { name: "add-role", path: "/dashboard/roles/add" },
  { name: "edit-role", path: "/dashboard/roles/edit/:id" },
  { name: "view-role", path: "/dashboard/roles/view/:id" },
  { name: "delete-role", path: "/dashboard/roles/delete/:id" },
];

async function seedActions() {
  try {
    await mongoose.connect(MONGODB_URI);

    for (const action of actions) {
      const exists = await Action.findOne({ name: action.name });
      if (!exists) {
        await Action.create(action);
      }
    }

    process.exit();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("seedActions error:", err);
    }
    process.exit(1);
  }
}

seedActions();
