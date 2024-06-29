require('dotenv').config();
const sql = require("mssql");
const express = require("express");
const dbConfig = require("./config/db_Config");

//controller
const controller = require("./controller/controller");
const registrationController = require("./controller/registrationController");
const facilitiesController = require("./controller/facilitiesController");
const annController = require("./controller/annController");

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
app.get('/EventMgr/:id',controller.getAllEventsByEventMgrID);
app.delete('/EventMgr/:id',controller.deleteEvent);

// Announcments
app.get('/announcements', annController.getAllAnnouncements);
app.get('/announcements/:id', annController.getAnnouncementById);
app.post('/announcements', annController.createAnnouncement);
app.put('/announcements/:id', annController.updateAnnouncement);
app.delete('/announcements/:id', annController.deleteAnnouncement);

// Registration
app.get("/registration", registrationController.getAllRegistration);
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



