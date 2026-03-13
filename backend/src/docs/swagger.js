const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CineBook — Movie Ticketing System",
      version: "1.0.0",
      description: "Backend API for Movie Ticketing System",
    },
    servers: [
      {
        url: "https://movie-reservation-api-2ub6.onrender.com",
        description: "Production server"
      },
      {
        url: "http://localhost:3000",
        description: "Development server"
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
  apis: ["./src/docs/*.js"] 
};

module.exports = swaggerJsdoc(options);