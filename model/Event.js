const sql = require('mssql')
const dbConfig = require("../config/db_Config");
class Event{
    constructor(EventID,EventName,EventDesc,EventPrice,EventDate,
    EventCat,EventLocation,EventRegEndDate,EventMgrID,EventIntake){
        this.EventID = EventID;
        this.EventName = EventName;
        this.EventDesc = EventDesc;
        this.EventPrice = EventPrice;
        this.EventDate =EventDate;
        this.EventCat = EventCat;
        this.EventLocation = EventLocation;
        this.EventRegEndDate = EventRegEndDate;
        this.EventMgrID = EventMgrID;
        this.EventIntake = EventIntake;
    }

    // retrive all events based on EventID

    static async getAllEventsById(id){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Event WHERE EventID = @EventID`;
        const request = connection.request();
        request.input("EventID",id);
        const result = await request.query(sqlQuery);
        connection.close();
        return result.recordset.map
        ((row) => 
            new Event(
                     row.EventName,
                     row.EventDesc,
                     row.EventPrice,
                     row.EventDate,
                     row.EventCat,
                     row.EventLocation,
                     row.EventRegEndDate,
                     row.EventIntake));

    }

    // update the event details 

    static async updateEventDetails(id,EventName,EventDesc,EventPrice,EventDate,EventCat,EventLocation,EventRegEndDate,EventIntake){
        console.log(id);
        const connection = await sql.connect(dbConfig);
        const sqlQuery = 
        `
    UPDATE Event 
    SET EventName = @EventName,
        EventDesc = @EventDesc,
        EventPrice = @EventPrice,
        EventCat = @EventCat,
        EventDate = @EventDate,
        EventLocation = @EventLocation,
        EventRegEndDate = @EventRegEndDate,
        EventIntake = @EventIntake
    WHERE EventID = @EventID;
        `
        const request = connection.request();
        request.input("EventID",id);
        request.input("EventName",EventName);
        request.input("EventDesc", EventDesc);
        request.input("EventPrice",EventPrice);
        request.input("EventDate",EventDate);
        request.input("EventCat",EventCat);
        request.input("EventLocation",EventLocation);
        request.input("EventRegEndDate",EventRegEndDate);
        request.input("EventIntake",EventIntake);
        await request.query(sqlQuery);
        connection.close();
        const update = await this.getAllEventsById(id);
        return update[0];
    }

    // delete the event based on EventID given 
    static async deleteEvent(id){
        const connection = await sql.connect();
        const sqlQuery = `DELETE FROM Event WHERE EventID = @EventID`
        const request = connection.request();
        request.input("EventID",id);
        const result = await request.query(sqlQuery);
        const rowsAffected = result.rowsAffected;
        connection.close();
        return rowsAffected;

    }


    static async createEvent(event){
        // Consider a subquery to autoincrement last EventID
        const connection = await sql.connect(dbConfig);
        const sqlQuery = 
        `
        INSERT INTO Event (EventID ,EventName, EventDesc, EventPrice, EventDate, EventCat, EventLocation, EventRegEndDate, EventMgrID, EventIntake) 
        VALUES (@EventID, @EventName, @EventDesc, @EventPrice, @EventDate, @EventCat, @EventLocation, @EventRegEndDate, @EventMgrID, @EventIntake);
        SELECT SCOPE_IDENTITY() AS id;`
        const request = connection.request();
        request.input("EventID",event.EventID);
        request.input("EventName",event.EventName);
        request.input("EventDesc",event.EventDesc);
        request.input("EventPrice",event.EventPrice);
        request.input("EventDate",event.EventDate);
        request.input("EventCat",event.EventCat);
        request.input("EventLocation",event.EventLocation);
        request.input("EventRegEndDate",event.EventRegEndDate);
        request.input("EventMgrID",event.EventMgrID);
        request.input("EventIntake",event.EventIntake);
        const result = await request.query(sqlQuery);
        connection.close();
        // retrive the newlt created event to veriffy that the a new event is added
        return this.getAllEventsById(result.recordset[0].EventID); 
    }

    static async getAllEvent(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT * FROM Event`
        const request = connection.request();
        const result = await request.query(sqlQuery);
        connection.close()
        return result.recordset.map(
            ((row) => 
                new Event(
                         row.EventName,
                         row.EventDesc,
                         row.EventPrice,
                         row.EventDate,
                         row.EventCat,
                         row.EventLocation,
                         row.EventRegEndDate,
                         row.EventIntake))
        );
    }

    static async getLastEventID(){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `SELECT MAX(EventID) FROM Event`
        const request = connection.request();
        const result = await request.query(sqlQuery)
        return result.recordset[0];
    }

    // create the event and store in db table
}
module.exports = Event;
