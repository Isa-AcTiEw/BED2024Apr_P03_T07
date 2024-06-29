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

    static async getAnnouncementById(AnnID) {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Announcement WHERE AnnID = @AnnID`; // Parameterized query
  
      const request = connection.request();
      request.input("AnnID", AnnID);
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset[0]
        ? new Announcement(
            result.recordset[0].AnnID,
            result.recordset[0].AnnName,
            result.recordset[0].AnnDesc
          )
        : null; 
    }

    static async updateAnnouncement(AnnID, newAnnouncementData) {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `UPDATE Announcement SET AnnName = @name, AnnDesc = @desc WHERE AnnID = @id`; // Parameterized query

      const request = connection.request();
      request.input("id", sql.VarChar, AnnID);
      request.input("name", sql.VarChar, newAnnouncementData.AnnName || null);
      request.input("desc", sql.VarChar, newAnnouncementData.AnnDesc || null);

      await request.query(sqlQuery);

      connection.close();

      return this.getAnnouncementById(id);
  } 
}
module.exports = Announcement;

