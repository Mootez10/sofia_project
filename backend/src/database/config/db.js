const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

mongoose
  .connect(process.env.mongodb_URL)
  console.log("connected")
  .then(() => {})
  .catch((err) => {
    if (process.env.NODE_ENV === "development") {
      console.error("MongoDB connection error:", err);
    }
  });
