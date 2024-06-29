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
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Facilities WHERE FacID = @id`;
		const request = connection.request().input("id", id);
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset[0]
			? new Facilities(
				result.recordset[0].FacID,
				result.recordset[0].FacName,
				result.recordset[0].FacDesc
			)
			: null;
    }
}
module.exports = Facilities;