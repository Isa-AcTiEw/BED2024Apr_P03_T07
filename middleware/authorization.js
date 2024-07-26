const jwt = require("jsonwebtoken");
require('dotenv').config();
const secretKey = process.env.JWT_SECRETKEY;
function verifyJWT(req, res, next){
        //  Exctract authorization headers from incoming request and split at " "
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({token:token });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
    // In postman we test this by sending the login token generated, this function checks if they are equivalent 
    if (err) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const authorizedRoles = {
        "/accountReg":["Member"], // Users designated with the role of libarian or member can access books route
        "/account/" : ["Member"],
        "/accountLogin/:":["Member"],
        // regex expression for email (starts with lower or upper or special characters notated by [] has an @ in between and a dot to seperate the domain name)
        "/account/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$":["Member"],

        // EventMgr routes
        "/EventMgr/getEvents/^EVT00[1-9]+":["Event Manager"],
        "/getEventID":["Event Manager"],
        "/getEvents" : ["Event Manager"],
        "/getEventByID^Ev0000[0-9]+":["Event Manager"],
        "/EventMgr/deleteEvents/^Ev0000[1-9]+":["Event Manager"],
        "/EventMgr/createEvents":["Event Manager"],
        "/EventMgr/updateEvents/^EVT00[1-9]+":["Event Manager"],

        // BookEvents for member
        "/EventBookings/getBookings/^BE00[1-9]+":["Member"],
        "/ViewEvents/createBooking":["Member"],
        "/EventBookings/deleteBooking/^BE00[1-9]+" : ["Member"],
        "/ViewEvents/createBooking/^BE00[1-9]+":["Member"],
        "/EventBookings/getBookEventIDs/^BE00[1-9]+":["Member"],

        // Announcement routes
        "/announcements":["Admin"],
        "/announcements/[1-9]+":["Admin"],
        
        // Feedbacks routes
        "/feedbacks/[1-9]+":["Member"],
        "/feedbacks":["Member"],

        // Booking routes
        "/booking/^B00[1-9]+" : ["Member"],
        "/booking" : ["Member"],


        // Facilities routes
        "/facilities" : ["Facilities Manager"],
        "/facilities/^FAC00[1-9]+" : ["Facilities Manager"],

        // Admin 
        "/admin/^ADM[1-9]+" : ["Admin"]
        // The regex expression [0-9]+ is to check if the proceeding characters after books/ is a sequence f digits 
    };

    const requestedEndpoint = req.url;
    // the url of the endpoint of our REST API
    const userRole = decoded.role;
    /*  authorizedRoles a js object (json) each entry is being mapped to an array [endpoint,roles], 
        Each pair of json properties are being split into [/books,[member,libarian]]for each array 
        Created a regular expression of the endpoint and see if the userRole is found inside the list of authorizedRoles*/

    // Convert to array -> Use the find() to iterate over the array and create regex from each given endpoint value. 
    // test the regex with the requested endpoint (actual) and check if user role is permitted 
    const authorizedRole = Object.entries(authorizedRoles).find(
        ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(userRole);
        }
    );
    // Unauthroized user forbidden
    if (!authorizedRole) {
        return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // attach decoded user information to the request object
    // proceed to the next middleware function
    next();
    });
}

module.exports = verifyJWT;