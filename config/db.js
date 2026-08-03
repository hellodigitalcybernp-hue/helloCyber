const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  console.log("Connecting to MongoDB...");

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:");
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;