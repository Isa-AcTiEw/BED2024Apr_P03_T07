require('dotenv').config({ path: './.env' });
console.log(process.env.DB_NAME);
module.exports = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: "localhost",
    database: process.env.DB_NAME,
    trustServerCertificate: true,
    options: {
        port: 1433, // Default SQL server port
        connectionTimeout: 60000, // Connection Timeout
    },
};
