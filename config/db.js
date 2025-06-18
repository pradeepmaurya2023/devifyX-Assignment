const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To DB");
  } catch (err) {
    throw new Error("Error in Connecting DB :- ", err.message);
  }
}

module.exports = connectDB;