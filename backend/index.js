const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

// Ensure DB connection is established before server starts
require("./src/database/config/db");

dotenv.config();

const actionRoutes = require("./src/routes/action.routes");
const authRedirectRoute = require("./src/routes/authRedirect.routes");
const roleRoutes = require("./src/routes/role.routes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

//app.use('/api', userRoutes);
app.use("/api/uploads", express.static("uploads"));
app.use("/api", authRedirectRoute);
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/users", require("./src/routes/user.routes"));
app.use("/api/roles", roleRoutes);
app.use("/api/actions", actionRoutes);

app.listen(port, () => {
  console.warn(`Server running at http://localhost:${port}`);
});

// Log uncaught errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
