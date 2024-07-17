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
            "/booking": ["member", "admin"],
            "/booking/[0-9]+": ["admin"],
        };

        const requestEndpoint = req.url;
        const userRole = decoded.role;

        const authorizedRole = Object.entries(authrizedRoles).find(
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