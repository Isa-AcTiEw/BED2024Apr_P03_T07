const sql = require("mssql");
const dbConfig = require("../config/db_Config");
class BookEvent{
    constructor(BookEventID,BookDate,EventID,AccID){
        this.BookEventID = BookEventID;
        this.BookDate = BookDate;
        this.EventID = EventID;
        this.AccID = AccID;
    }

    static async createBooking(BookedEvent){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO EventBooking (BookEventID,BookEventDate,EventID,AccID)  VALUES (@BookEventID,@BookEventDate,EventID,AccID);`
        const request = connection.request();
        request.input("BookEventID",BookedEvent.BookEventID);
        request.input("BookEventDate",BookedEvent.BookDate);
        request.input("EventID",BookedEvent.EventID);
        request.input("AccID",BookedEvent.AccID);
        const result = await request.query(sqlQuery);
        connection.close();
        // retrive the newlt created event to veriffy that the a new event is added
        return this.getAllBookings(result.recordset[0].BookEventID); 

    }

    static async deleteBooking(BookEventID){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT FROM EventBooking WHERE BookEventID = @BookEventID`;
        const request = connection.request();
        request.input("BookEventID",BookEventID);
        const result = await request.query(sqlQuery);
        return result.rowsAffected
    }

    static async retrieveUserEventBooked(AccID){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT FROM EventBooking WHERE AccID = @AccID`;
        const request = connection.request();
        request.input("AccID",AccID);
        const result = await request.query(sqlQuery);
        return result.recordset.map((row) =>{
            new BookEvent(
                row.BookEventID,
                row.BookDate,
                row.EventID,
                row.AccID
            )
        })

    }

    static async retriveLastBookingID(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT MAX(BookEventID) FROM EventBooking`;
        const request = connection.request();
        const result = await request.query(sqlQuery)
        return result.recordset[0];
    }
}

module.exports = BookEvent