const sql = require("mssql");
const validateEvent = require("./middleware/validateEvent");
const express = require("express");
const dbConfig = require("./config/db_Config");

//controller
const accountController = require("./controller/accountController");
const adminController = require("./controller/adminController");
const eventController = require("./controller/eventController");
const bookingController = require("./controller/bookingController");
const registrationController = require("./controller/registrationController");
const facilitiesController = require("./controller/facilitiesController");
const annController = require("./controller/annController");
const fbkController = require("./controller/fbkController");
const authController = require("./controller/authController");

//middleware

const bodyParser = require("body-parser");
const validateBooking = require("./middleware/validateBooking");

// Middleware to serve static files from the "public" directory
const staticMiddlewarePublic = express.static('./public');

// New variabe storing the port environment variable
const port = process.env.PORT || 3000;
const app = express();

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddlewarePublic); // Mount the static middleware

// User routes
app.get('/retrieveEvents/All',eventController.getAllEvents);

// dirname gets the path of the file in html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Admin/adminpage.html');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/EventMgr/eventMgrPanel.html');
});

app.get('/facilitiesMgr', (req, res) => {
  res.sendFile(__dirname + '/public/Facilities/facilitiesMgrPanel.html');
});

// Login
app.post('/Login', authController.login);

// EventMgr and Event routes
app.get('/EventMgr/getEvents/:id',eventController.getAllEventsByEventMgrID);
app.delete('/EventMgr/deleteEvents/:id',eventController.deleteEvent);
app.post('/EventMgr/updateEvents/:id',validateEvent,eventController.updateEvent);
app.post('/EventMgr/createEvents', validateEvent,eventController.createEvent);

// Announcments
app.get('/announcements', annController.getAllAnnouncements);
app.get('/announcements/:id', annController.getAnnouncementById);
app.post('/announcements', annController.createAnnouncement);
app.put('/announcements/:id', annController.updateAnnouncement);
app.delete('/announcements/:id', annController.deleteAnnouncement);

// Feedbacks
app.get('/feedbacks', fbkController.getAllFeedbacks);
app.get('/feedbacks/:id',fbkController.getFeedbackById);
app.post('/feedbacks',fbkController.createFeedback);
app.put('/feedbacks/:id',fbkController.updateFeedback);
app.delete('/feedbacks/:id',fbkController.deleteFeedback);

// Booking
app.get("/booking", bookingController.getAllBookings);
app.get("/booking/:id", bookingController.getBookingById);
app.post("/booking", validateBooking, bookingController.createBooking);

// Registration
app.get("/registration", registrationController.getAllRegistrations);
app.get("/registration/:id", registrationController.getRegistrationById)

// Facilities
app.get("/facilities", facilitiesController.getAllFacilities);
app.get("/facilities/:id", facilitiesController.getFacilityById);
app.post("/facilities", facilitiesController.createFacility);
app.put("/facilities/:id", facilitiesController.updateFacility);
app.delete("/facilities/:id", facilitiesController.deleteFacility);

// Admin
app.get("/admin/:id", adminController.getAdminById);

// Account
app.get("/account/:email", accountController.getAccountByEmail);

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