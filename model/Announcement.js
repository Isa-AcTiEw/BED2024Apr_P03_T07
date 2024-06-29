const sql = require('mssql');
const dbConfig = require('../config/db_Config'); 

class Announcement {
    constructor(AnnID, AnnName, AnnDesc, AdminID) {
        this.AnnID = AnnID;
        this.AnnName = AnnName;
        this.AnnDesc = AnnDesc
        this.AdminID = AdminID;
    }

    static async getAllAnnouncements() {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `SELECT * FROM Announcement`; // Replace with your actual table name
    
        const request = connection.request();
        const result = await request.query(sqlQuery);
    
        connection.close();
    
        return result.recordset.map(
          (row) => new Announcement(row.AnnID, row.AnnName, row.AnnDesc)
        ); 
      }
}
module.exports = Announcement;