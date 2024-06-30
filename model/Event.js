const sql = require('mssql')
const dbConfig = require("../db_Config/db_Config");
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
        const connection = await sql.connect();
        const sqlQuery = `SELECT * FROM Event WHERE EventID = @EventID`;
        const request = connection.request();
        request.input("EventID",id);
        const result = await request.query(sqlQuery);
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

    static async updateEventDetails(id,Event){
        const connection = await sql.connect();
        const sqlQuery = 
        `UPDATE Event SET EventName = @EventName, EventDesc = @EventDesc, 
        EventDate = @EventDate, EventLocation = @EventLocation, 
        EventRegEndDate = @EventRegEndDate, EventIntake = @EventIntake WHERE EventID = @EventID`
        const request = connection.request();
        request.input("EventID",Event.EventID);
        request.input("EventName",Event.EventName);
        request.input("EventDesc",Event.EventDesc);
        request.input("EventDate",Event.EventDate);
        request.input("EventCat",Event.EventCat)
        request.input("EventLocation",Event.EventLocation);
        request.input("EventRegEndDate",Event.EventRegEndDate);
        request.input("EventIntake",Event.EventIntake);
        const result = await request.query(sqlQuery);
        return this.getAllEventsById(id);
    }

    // delete the event based on EventID given 
    static async deleteEvent(id){
        const connection = await sql.connect();
        const sqlQuery = `DELETE FROM Event WHERE EventID = @EventID`
        const request = connection.request();
        request.input("EventID",id);
        const result = await request.query(sqlQuery);
        const rowsAffected = result.rowsAffected;
        return rowsAffected;

    }

    static async createEvent(event){
        // select SCOPE_IDENTITY AS id returns the id of the current scope in the sql table
        const connection = await sql.connect();
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
        // retrive the newlt created event to veriffy that the a new event is added
        return this.getAllEventsById(result.recordset[0].EventID); 
    }

    // create the event and store in db table
}
module.exports = Event;
