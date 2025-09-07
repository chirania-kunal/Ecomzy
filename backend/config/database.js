const mongoose = require("mongoose");
require("dotenv").config();

// Database connection
const connectWithDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectWithDB;
