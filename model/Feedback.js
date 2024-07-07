const sql = require('mssql');
const dbConfig = require('../config/db_Config'); 

class Feedback {
    constructor(FbkID, FbkName, FbkQuality, FbkDateTime, FbkDesc, AdminID ) {
        this.FbkID = FbkID;
        this.FbkName = FbkName;
        this.FbkQuality = FbkQuality;
        this.FbkDateTime = FbkDateTime;
        this.FbkDesc = FbkDesc;
        this.AdminID = AdminID;
    }

    static async getAllFeedbacks() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback`; 
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(
            (row) => new Feedback(row.FbkID, row.FbkName, row.FbkQuality, row.FbkDateTime, row.FbkDesc, row.AdminID)
        );
    }

    static async getFeedbackById(id) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback WHERE FbkID = @id`;
		const request = connection.request().input("id", id);
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset[0]
			? new Feedback(
				result.recordset[0].FbkID,
				result.recordset[0].FbkName,
				result.recordset[0].FbkQuality,
				result.recordset[0].FbkDateTime,
				result.recordset[0].FbkDesc,
				result.recordset[0].AdminID
			)
			: null;
    }    

    static async createFeedback(newFbkData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `INSERT INTO Feedback (FbkName, FbkQuality, FbkDateTime, FbkDesc, AdminID) 
        VALUES (@FbkName, @FbkDesc); SELECT SCOPE_IDENTITY() AS FbkID`;

        const request = connection.request();
        request.input("FbkName", newFbkData.FbkName);
        request.input("FbkQuality", newFbkData.FbkQuality);
        request.input("FbkDateTime", newFbkData.FbkDateTime);
        request.input("FbkDesc", newFbkData.FbkDesc);
        request.input("AdminID", "ADM001");
    
        const result = await request.query(sqlQuery);
    
        connection.close();
        return this.getBookById(result.recordset[0].FbkID);
    }

    static async updateFeedback(FbkID, newFeedbackData) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Feedback SET FbkName = @FbkName, FbkQuality = @FbkQuality, FbkDateTime = @FbkDateTime,
        FbkDesc = @FbkDesc WHERE FbkID = @FbkID`;
        const request = connection.request();
        request.input("FbkID", FbkID);
        request.input("FbkName", newFeedbackData.FbkName || null);        
        request.input("FbkQuality", newFeedbackData.FbkQuality || null);
        request.input("FbkDateTime", newFeedbackData.FbkDateTime || null);
        request.input("FbkDesc", newFeedbackData.FbkDesc || null);
        await request.query(sqlQuery);
        connection.close();
        return this.getFeedbackById(FbkID);
    }

    static async deleteFeedback(FbkID) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Feedback WHERE FbkID = @FbkID`;
        const request = connection.request();
        request.input("FbkID", FbkID); // Use the correct data type
        const result = await request.query(sqlQuery);
        connection.close();
        return result.rowsAffected > 0;
    }
}

module.exports = Feedback;