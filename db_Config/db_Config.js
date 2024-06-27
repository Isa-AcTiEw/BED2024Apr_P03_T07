require('dotenv').config();
module.exports = {
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    server:"localhost",
    database:process.env.isaac_DB_NAME,
    trustServerCertificate: true,
    options:{
        port:1433, // Default SQL server port
        connectionTimeout:60000, // Connection Timeout
    }
    
}


