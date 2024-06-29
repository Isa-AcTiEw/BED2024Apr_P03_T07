const sql = require("mssql");
const dbConfig = require("../config/db_Config");

class Booking {
	constructor(BookID, BookDate, BookStatus, FacID, AccID) {
		this.BookID = BookID;
		this.BookDate = BookDate;
		this.BookStatus = BookStatus;
		this.FacID = FacID;
		this.AccID = AccID;
	}

	static async getAllBookings() {
		const connection = await sql.connect(dbConfig);
		const sqlQuery = `SELECT * FROM Booking`;
		const request = connection.request();
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset.map(
		(row) => new Booking(row.BookID, row.BookDate, row.BookStatus, row.FacID, row.AccID)
		);
	}

	static async getBookingById(id) {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Booking WHERE BookID = @id`;
		const request = connection.request().input("id", id);
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset[0]
			? new Booking(
				result.recordset[0].BookID,
				result.recordset[0].BookDate,
				result.recordset[0].BookStatus,
				result.recordset[0].FacID,
				result.recordset[0].AccID
			)
			: null;
    }
}
module.exports = Booking;