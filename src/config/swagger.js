const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Booking API",
      version: "1.0.0",
      description: "API documentation for Hotel Booking System"
    },
    servers: [
      {
        url: process.env.HOST
          ? `${process.env.HOST}/api` // If HOST env is set (like in production)
          : "http://localhost:3000/api" // Default for local dev
      }
    ]
  },
  
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
