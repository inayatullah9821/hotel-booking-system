const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const allRoutes = require("./src/routes/allRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// all routes at one place
app.use("/api", allRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json("Health ok, Hotel Booking System is running");
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
