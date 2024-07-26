const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../.env' });
const secretKey = process.env.ACCESS_TOKEN_SECRET;
function verifyJWT(req, res, next) {
  
  //  Exctract authorization headers from incoming request and split at " "
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({token:token });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    // In postman we test this by sending the login token generated, this function checks if they are equivalent 
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const authorizedRoles = {
      "/accountReg":["user"], // Users designated with the role of libarian or member can access books route
      "/account/",
      "/ViewEvents/createBooking":["user"],
      "/EventBookings/deleteBooking/^BE00[0-9]",
      "ViewEvents/createBooking":["user"],
      "/accountLogin/:":["user"],
      
      "/books/[0-9]+/availability": ["librarian"], // Only librarians can update availability, 

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