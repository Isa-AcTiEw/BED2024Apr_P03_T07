const jwt = require("jsonwebtoken");
const { user } = require("../config/db_Config");
require('dotenv').config();
const secretKey = process.env.JWT_SECRETKEY;
function verifyJWT(req, res, next){
        //  Exctract authorization headers from incoming request and split at " "
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        console.log(token)
        if (!token) {
            return res.status(401).json({token:token });
        }
    
        jwt.verify(token, secretKey, (error, decoded) =>{
            if(error){
                console.error(error);
                return res.status(401).json({message:"There is no token"})
            }
            const authorizedRoles = {
                "/account/" : ["Member"],
                "/accountLogin/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$||/accountLogin/[a-zA-Z0-9._%+-]+%40[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$ ": ["Member", "Event Manager", "Facilities Manager", "Admin"],
                "User/Event/BookedEvents" : ["Member"],
                // EventMgr routes
                "/getEventID":["Event Manager"],
                "/getEvents" : ["Event Manager"],
                "/getEventByID^EVT00\\d+$":["Event Manager"],
                "/EventMgr/deleteEvents/^Ev0000\\d+$":["Event Manager"],
                "/EventMgr/createEvents":["Event Manager"],
                "/EventMgr/updateEvents/^Ev0000\\d+$":["Event Manager"],
        
                // BookEvents for member
                "/EventBookings/getBookings/ACC/\\d+$":["Member"],
                "/ViewEvents/createBooking":["Member"],
                "/EventBookings/getBookings/ACC\\d+$" : ["Member"],
                "/ViewEvents/createBooking/ACC\\d+$":["Member"],
                "/EventBookings/getBookEventIDs/ACC\\d+$":["Member"],
                "/EventBookings/deleteBooking/BE00\\d+$":["Member"],

                // Place the content routes for bookedEvents
                "/BookedEvents": ["Member"],
                // Announcement routes
                "/announcements":["Admin"],
                "/announcements/[1-9]+":["Admin"],
                
                // Feedbacks routes
                "/feedbacks/[1-9]+":["Member"],
                "/feedbacks":["Member"],
        
                // Booking routes
                "/booking/^ADM(00[1-9]|0[1-9]\\d|[1-9]\\d{2})$" : ["Member"],
                "/booking/B\\d+$" : ["Member"],
                "/booking" : ["Member"],
                "/bookingId" : ["Member"],
                "/Bookings" : ["Member"],
        
        
                // Facilities routes
                "/facilities" : ["Facilities Manager"],
                "/facilities/FAC00\\d+$" : ["Member"],
                "/facilitiesId" : ["Facilities Manager"], 
        
                // Admin 
                "/admin/^ADM[1-9]+" : ["Admin"]
                // The regex expression [0-9]+ is to check if the proceeding characters after books/ is a sequence f digits 
            };
        
            const requestedEndpoint = req.url;
            console.log(requestedEndpoint)
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
                console.log(regex);
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