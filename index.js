require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

// Importing Routes
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");

// Using Routes for
app.use("/api/user", userRoutes);
app.use("/api/files", fileRoutes);

// for testing
app.get("/", (req, res) => {
  res.send("Home Route");
});

async function main() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}.`);
    });
  } catch (err) {
    console.log("Error : ", err);
    process.exit(1);
  }
}

main();
