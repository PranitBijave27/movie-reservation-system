const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Distributed Movie Ticketing System",
      version: "1.0.0",
      description: "API documentation for Distributed Movie Ticketing System",
      contact: {
        name: "Your Name",
        url: "https://github.com/PranitBijave27"
      }
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:3000/api',
        description: 'Active server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      }
    }
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;