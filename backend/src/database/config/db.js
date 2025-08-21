const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

mongoose
  .connect(process.env.mongodb_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    if (process.env.NODE_ENV === "development") {
      console.error("MongoDB connection error:", err);
    }
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose event: connected");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose event: error", err);
});
