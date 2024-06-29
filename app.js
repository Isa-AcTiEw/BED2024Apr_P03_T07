require('dotenv').config();
const sql = require("mssql");
const express = require("express");
const dbConfig = require("./config/db_Config");

//controller
const controller = require("./controller/controller");
const bookingController = require("./controller/bookingController");
const registrationController = require("./controller/registrationController");
const facilitiesController = require("./controller/facilitiesController");

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

// dirname gets the path of the file in html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Admin/adminpage.html');
});

// implement our routes 
app.get('/Announcements', controller.getAllAnnouncements)
app.get('/EventMgr/:id',controller.getAllEventsByEventMgrID);
app.delete('/EventMgr/:id',controller.deleteEvent);

// Booking
app.get("/booking", bookingController.getAllBookings);
app.get("/booking/:id", bookingController.getBookingById);

// Registration
app.get("/registration", registrationController.getAllRegistrations);
app.get("/registration/:id", registrationController.getRegistrationById)

// Facilities
app.get("/facilities", facilitiesController.getAllFacilities);
app.get("/facilities/:id", facilitiesController.getFacilityById);

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



