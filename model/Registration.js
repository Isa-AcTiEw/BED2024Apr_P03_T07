const sql = require("mssql");
const dbConfig = require("../config/db_Config");

class Registration {
    constructor(RegID, RegDate, RegStatus, EventID, AccID) {
        this.RegID = RegID;
        this.RegDate = RegDate;
        this.RegStatus = RegStatus;
        this.EventID = EventID;
        this.AccID = AccID;
    }

    static async getAllRegistrations() {
		const connection = await sql.connect(dbConfig);
		const sqlQuery = `SELECT * FROM Registration`;
		const request = connection.request();
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset.map(
		(row) => new Registration(row.RegID, row.RegDate, row.RegStatus, row.EventID, row.AccID)
		);
	}

	static async getRegistrationById(id) {
		const connection = await sql.connect(dbConfig);
		const sqlQuery = `SELECT * FROM Registration WHERE RegID = @id`;
		const request = connection.request().input("id", id);
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset[0]
			? new Registration(
				result.recordset[0].RegID,
				result.recordset[0].RegDate,
				result.recordset[0].RegStatus,
				result.recordset[0].EventID,
				result.recordset[0].AccID
			)
			: null;
	}
}
module.exports = Registration;