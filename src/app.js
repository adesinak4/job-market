const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./utils/db");
const adminRoute = require("./routes/adminRoute");
// const userRoute = require("./routes/userRoute");

// Load environment variables from .env file
require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Routes
app.use("/api/v1/admin", adminRoute);
// app.use("/api/v1/users", userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
