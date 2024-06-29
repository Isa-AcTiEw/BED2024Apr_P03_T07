const sql = require('mssql');
const dbConfig = require('../config/db_Config'); 

class Announcement {
    constructor(AnnID, AnnName, AnnDesc, ) {
        this.AnnID = AnnID;
        this.AnnName = AnnName;
        this.AnnDesc = AnnDesc;
    }

    static async getAllAnnouncements() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Announcement`; 
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(
            (row) => new Announcement(row.AnnID, row.AnnName, row.AnnDesc, row.AccID)
        );
    }

    static async getAnnouncementById(id) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Facilities WHERE AnnID = @id`;
		const request = connection.request().input("id", id);
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

    static async createAnnouncement(newAnnData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO Announcement (AnnName, AnnDesc) 
        VALUES (@AnnName, @AnnDesc); SELECT SCOPE_IDENTITY() AS AnnID`;

        const request = connection.request();
        request.input("AnnName", newAnnData.AnnName);
        request.input("AnnDesc", newAnnData.AnnDesc);
    
        const result = await request.query(sqlQuery);
    
        connection.close();
        return this.getBookById(result.recordset[0].AnnID);
    }

    static async updateAnnouncement(AnnID, newAnnouncementData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Announcement SET AnnName = @AnnName, AnnDesc = @AnnDesc WHERE AnnID = @AnnID`;
        const request = connection.request();
        request.input("AnnID", AnnID);
        request.input("AnnName", newAnnouncementData.AnnName || null);
        request.input("AnnDesc", newAnnouncementData.AnnDesc || null);
        await request.query(sqlQuery);
        connection.close();
        return this.getAnnouncementById(AnnID);
    }

    static async deleteAnnouncement(AnnID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Announcement WHERE AnnID = @AnnID`;
        const request = connection.request();
        request.input("AnnID", sql.VarChar, AnnID); // Use the correct data type
        const result = await request.query(sqlQuery);
        connection.close();
        return result.rowsAffected > 0;
    }
}

module.exports = Announcement;

