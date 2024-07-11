const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./Output/swagger.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "My API",
    description: "PolytechnicLibarary API",
  },
  host: "localhost:3000", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);
