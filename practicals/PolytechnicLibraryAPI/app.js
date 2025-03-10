const express = require("express");
const sql = require("mssql");
const dbConfig = require("./config/DbConfigPractical");
const bodyParser = require("body-parser");
const verifyJWT = require('./middleware/authorizeTokenAndRoles');
const userController = require('./controller/userController');
const booksController = require('./controller/booksController');
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./Output/swagger.json"); // Import generated spec
const app = express();
const port = process.env.PORT || 2000;

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling


// Routes
app.post('/register', userController.registerUser); // user registration route
app.post('/login',  userController.login);
app.get('/books', verifyJWT, booksController.getAllBooks);
app.put('/books/:bookId/:availability', verifyJWT, booksController.updateAvailability);

// swagger api docs

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});
