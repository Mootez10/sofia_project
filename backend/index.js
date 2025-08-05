const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');
const db = require('./src/database/config/db');
const roleRoutes = require('./src/routes/role.routes');
const userRoutes = require('./src/routes/user');
const authRedirectRoute = require('./src/routes/authRedirect');
const actionRoutes = require('./src/routes/action.routes');



const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


//app.use('/api', userRoutes);
app.use('/api/uploads', express.static('uploads'));
app.use('/api', authRedirectRoute);
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/user'));
app.use('/api/roles', roleRoutes);
app.use('/api/actions', actionRoutes);




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
