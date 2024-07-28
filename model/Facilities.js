const sql = require("mssql");
const dbConfig = require("../config/db_Config");

class Facilities {
    constructor(FacID, FacName, FacDesc) {
        this.FacID = FacID;
        this.FacName = FacName;
        this.FacDesc = FacDesc;
    }
    static async getAllFacilities() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Facilities`;
        const request = connection.request();
        const result = await request.query(sqlQuery);

        connection.close();

        return result.recordset.map(
            (row) => new Facilities(row.FacID, row.FacName, row.FacDesc, row.FacID, row.AccID)
        );
    }

    static async getFacilityById(id) {
        console.log(id);
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Facilities WHERE FacID = @id`;
		const request = connection.request().input("id", id);
		const result = await request.query(sqlQuery);

		// connection.close();

		return result.recordset[0]
			? new Facilities(
				result.recordset[0].FacID,
				result.recordset[0].FacName,
				result.recordset[0].FacDesc
			)
			: null;
    }

    static async getLastFacilityID() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT MAX(FacID) FROM Facilities`
        const request = connection.request();
        const result = await request.query(sqlQuery)
        return result.recordset[0];
    }

    static async createFacility(newFacility) {
        console.log(newFacility);
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO Facilities (FacID, FacName, FacDesc) OUTPUT inserted.FacID VALUES (@FacID, @FacName, @FacDesc);`;
        const request = connection.request();

        request.input("FacID", newFacility.FacID);
        request.input("FacName", newFacility.FacName);
        request.input("FacDesc", newFacility.FacDesc);

        const result = await request.query(sqlQuery);

        // connection.close();

        return this.getFacilityById(result.recordset[0].FacID); 
    }

    static async updateFacility(id, newFacility) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `UPDATE Facilities SET FacName = @FacName, FacDesc = @FacDesc WHERE FacID = @id`;
        const request = connection.request();

        request.input("id", id);
        request.input("FacName", newFacility.FacName);
        request.input("FacDesc", newFacility.FacDesc);
        
        await request.query(sqlQuery);

        connection.close();

        return this.getFacilityById(id);
    }

    static async deleteFacility(id) {

        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Facilities WHERE FacID = @id`;
        const request = connection.request();

        request.input("id", sql.VarChar, id);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }
}
module.exports = Facilities;