const sql = require('mssql');
const dbConfig = require('../config/db_Config'); 

class Feedback {
    constructor(FbkID, FbkName, FbkQuality, FbkDateTime, FbkDesc, AccID ) {
        this.FbkID = FbkID;
        this.FbkName = FbkName;
        this.FbkQuality = FbkQuality;
        this.FbkDateTime = FbkDateTime;
        this.FbkDesc = FbkDesc;
        this.AccID = AccID;
    }

    static async getAllFeedbacks() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Feedback`; 
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(
            (row) => new Feedback(row.FbkID, row.FbkName, row.FbkQuality, row.FbkDateTime, row.FbkDesc, row.AccID)
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
				result.recordset[0].AccID
			)
			: null;
    }    

    static async createFeedback(newFbkData) {
        const connection = await sql.connect(dbConfig);
    
        const sqlQuery = `
            INSERT INTO Feedback (FbkName, FbkQuality, FbkDateTime, FbkDesc, AccID) 
            OUTPUT INSERTED.FbkID
            SELECT @FbkName, @FbkQuality, @FbkDateTime, @FbkDesc, @AccID
            FROM Account
            WHERE AccID = @AccID`;

        const request = connection.request();
        request.input("FbkName", newFbkData.FbkName);
        request.input("FbkQuality", newFbkData.FbkQuality);
        request.input("FbkDateTime", newFbkData.FbkDateTime);
        request.input("FbkDesc", newFbkData.FbkDesc);
        request.input("AccID", newFbkData.AccID);

        const result = await request.query(sqlQuery);
    
        connection.close();
        return this.getFeedbackById(result.recordset[0].FbkID);
    }

    static async updateFeedback(FbkID, newFeedbackData) {
        console.log(newFeedbackData);
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
        request.input("FbkID", FbkID); 
        const result = await request.query(sqlQuery);
        connection.close();
        return result.rowsAffected > 0;
    }
}

module.exports = Feedback;