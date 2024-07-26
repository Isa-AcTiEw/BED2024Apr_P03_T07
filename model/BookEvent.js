const sql = require("mssql");
const dbConfig = require("../config/db_Config");
const Event = require("./Event");
class BookEvent{
    constructor(BookEventID,BookEventDate,EventID,AccID){
        this.BookEventID = BookEventID;
        this.BookEventDate = BookEventDate;
        this.EventID = EventID;
        this.AccID = AccID;
    }

    static async createBooking(BookedEvent){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `INSERT INTO EventBooking (BookEventID,BookEventDate,EventID,AccID)  VALUES (@BookEventID,@BookEventDate,@EventID,@AccID);`
        const request = connection.request();
        request.input("BookEventID",BookedEvent.BookEventID);
        request.input("BookEventDate",BookedEvent.BookEventDate);
        request.input("EventID",BookedEvent.EventID);
        request.input("AccID",BookedEvent.AccID);
        const result = await request.query(sqlQuery);
        connection.close();
        // retrive the newlt created event to veriffy that the a new event is added
        return result.rowsAffected;

    }

    static async deleteBooking(BookEventID){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `DELETE FROM EventBooking WHERE BookEventID = @BookEventID`;
        const request = connection.request();
        request.input("BookEventID",BookEventID);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.rowsAffected
    }

    static async retriveLastBookingID(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT MAX(BookEventID) AS BookEventID FROM EventBooking;`;
        const request = connection.request();
        const result = await request.query(sqlQuery)
        connection.close();
        return result.recordset[0];
       
    }

    static async retrieveBookedEventsID(AccID){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT EventID AS 'Event ID'
                          FROM EventBooking WHERE AccID = @AccID`
        const request = connection.request();
        request.input("AccID",AccID)
        const result = await request.query(sqlQuery)
        return result.recordset;
    }

    static async retrieveUserEventBooked(AccID){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Event WHERE
                          EventID IN 
                          (
                           SELECT EventID FROM EventBooking
                           WHERE AccID = 'ACC002'
                        )`
        const request = connection.request();
        request.input("AccID",AccID);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map(
            ((row) => 
                new Event(
                    row.EventID,
                    row.EventName,
                    row.EventDesc,
                    row.EventPrice,
                    row.EventDate,
                    row.EventCat,
                    row.EventLocation,
                    row.EventRegEndDate,
                    row.EventMgrID,
                    row.EventIntake)
            )
        );
    }

    static async retrieveEventBookingBookedID(){
        const connection = request.connect(dbConfig);
        const sqlQuery = `SELECT BookEventID AS 'BookEventID' FROM EventBooking WHERE 
                          EventID IN (SELECT EventID FROM EventBooking 
                          WHERE AccID = '@AccID')`
        const request = connection.query(sqlQuery)
        const result = await request.query(sqlQuery)
        return result.recordset;
    }
}

module.exports = BookEvent