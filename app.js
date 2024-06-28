const sql = require("mssql");
const validateEvent = require("./middleware/validateEvent");
const express = require("express");
const dbConfig = require("./db_Config/db_Config");
const eventController = require("./controller/eventController");
const bodyParser = require("body-parser");
// Middleware to serve static files from the "public" directory
const staticMiddlewarePublic = express.static('./public');
// New variabe storing the port environment variable
const port = process.env.PORT || 3000;
const app = express();
// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddlewarePublic); // Mount the static middleware

// dirname gets the path of the file in html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// Testing our database connection
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

// implement our routes (delete,create and get works. Update (patch) not working)
app.get('/EventMgr/:id',eventController.getAllEventsByEventMgrID);
app.delete('/EventMgr/deleteEvents/:id',eventController.deleteEvent);
app.patch('/EventMgr/updateEvents/:id',eventController.updateEvent);
app.post('/EventMgr/createEvents', validateEvent,eventController.createEvent);

// http://localhost:3000/EventMgr/eventMgr.html


