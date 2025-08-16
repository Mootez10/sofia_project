const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Role = require('../../models/role.model');
const Action = require('../../models/action.model');

const MONGODB_URI = process.env.mongodb_URL;

async function seedRoles() {
  try {
    await mongoose.connect(MONGODB_URI);

    await Role.deleteMany({});

    const allActions = await Action.find({});
    const allActionNames = allActions.map(action => action.name);

    const roles = [
      {
        name: 'admin',
        description: 'Full access to all features',
        actions: allActionNames
      },
      {
        name: 'developer',
        description: 'Developer role with limited management rights',
        actions: ['add-user', 'view-user', 'role-management']
      },
      {
        name: 'user',
        description: 'Basic user role with dashboard access only',
        actions: ['dashboard']
      }
    ];

    await Role.insertMany(roles);
    process.exit();
  } catch (err) {
    process.exit(1);
  }
}

seedRoles();
