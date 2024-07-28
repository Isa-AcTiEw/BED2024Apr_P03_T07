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

	static async getLastBookingID() {
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT MAX(BookID) FROM Booking`
        const request = connection.request();
        const result = await request.query(sqlQuery)
        return result.recordset[0];
    }

	static async getAllBookingByAccId(id) {
		const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Booking WHERE AccID = @id`;
		const request = connection.request().input("id", id);
		const result = await request.query(sqlQuery);

		connection.close();

		return result.recordset.map(
			(row) => new Booking(
				row.BookID, 
				row.BookDate, 
				row.BookStatus, 
				row.FacID, 
				row.AccID
			)
		);
	}

	static async createBooking(newBooking) {
		const connection = await sql.connect(dbConfig);
		const sqlQuery = `INSERT INTO Booking (BookID, BookDate, BookStatus, FacID, AccID) OUTPUT inserted.BookID, inserted.BookDate, inserted.BookStatus, inserted.FacID, inserted.AccID VALUES (@BookID, GETDATE(), 'Pending', @FacID, @AccID);`
		const request = connection.request();

		request.input("BookID", newBooking.BookID);
		// request.input("BookDate", newBooking.BookDate);
		// request.input("BookStatus", newBooking.BookStatus);
		request.input("FacID", newBooking.FacID);
		request.input("AccID", newBooking.AccID);

		const result = await request.query(sqlQuery);

		connection.close();

		return this.getBookingById(result.recordset[0].BookID);
	}

	static async deleteBooking(id){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM Booking WHERE BookID = @BookID`
        const request = connection.request();
		
        request.input("BookID",id);

        const result = await request.query(sqlQuery);

        connection.close();

        return result.rowsAffected > 0;
    }
}
module.exports = Booking;