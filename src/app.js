const express = require("express");
const helmet = require("helmet");
const connectDB = require("./utils/db");
const logger = require("./utils/logger");
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

// Routes
app.use("/api/v1/admin", adminRoute);
// app.use("/api/v1/users", userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
