const sql = require("mssql");
const dbConfig = require("../db_Config");

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
          (row) => new Book(row.BookID, row.BookDate, row.BookStatus, row.FacID, row.AccID)
        );
      }
}
module.exports = Booking;