const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerDocs = require("./src/config/swagger");
const allRoutes = require("./src/routes/allRoutes");
const { statusCodes } = require("./src/utils/errorConstants");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// all routes at one place
app.use("/api", allRoutes);

swaggerDocs(app);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json("Health ok, Hotel Booking System is running");
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ statusCode: statusCodes.internalServerError, message: "Something went wrong!" });
});

module.exports = { app };
