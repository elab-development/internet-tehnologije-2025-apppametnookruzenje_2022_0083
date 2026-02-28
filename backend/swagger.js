
// backend/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Pametno Okruženje API",
    version: "1.0.0",
    description: "API dokumentacija za upravljanje pametnim uređajima, sobama i korisnicima.",
  },
  servers: [{ url: "http://localhost:4000", description: "Local/Docker" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  security: [{ bearerAuth: [] }],
};

module.exports = swaggerJSDoc({
  swaggerDefinition,
  apis: [
    path.join(__dirname, "routes", "*.js"),
    path.join(__dirname, "server.js"),
  ],
});