const jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../.env' });
const secretKey = process.env.ACCESS_TOKEN_SECRET;

function verifyJWT(req, res, next) {
    const token = req.headers.authroization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const authorizedRoles = {
            "/books": ["member", "librarian"], // Users designated with the role of libarian or member can access books route
            "/books/[0-9]+/availability": ["librarian"], // Only librarians can update availability, 
      
            // The regex expression [0-9]+ is to check if the proceeding characters after books/ is a sequence f digits 
          };

        const accountRole = decoded.role;
        
        const requestEndpoint = req.url;
        const userRole = decoded.AccID;

        const authorizedRole = Object.entries(authorizedRoles).find(
            ([endpoint, roles]) => {
                const regex = new RegExp(`^${endpoint}}$`);
                return regex.test(requestEndpoint) && roles.includes(userRole);
            }
        );

        if (!authorizedRole) {
            return res.status(403).json({ message: "Forbidden"});
        }

        req.user = decoded;
        next();
    });
}

module.exports = verifyJWT;