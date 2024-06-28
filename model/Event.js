const sql = require('mssql')
const dbConfig = require("../db_Config/db_Config");
class Event{
    constructor(EventID,EventName,EventDesc,EventPrice,EventDate,
    EventCat,EventLocation,EventRegEndDate,EventMgrID,EventIntake){
        this.EventID = EventID
        this.EventName = EventName,
        this.EventDesc = EventDesc,
        this.EventPrice = EventPrice,
        this.EventDate =EventDate,
        this.EventCat = EventCat,
        this.EventLocation = EventLocation,
        this.EventRegEndDate = EventRegEndDate,
        this.EventMgrID = EventMgrID,
        this.EventIntake = EventIntake
    }

    // retrive all events based on EventID

    static async getAllEventsById(id){
        const connection = await sql.connect();
        const sqlQuery = `SELECT * FROM Event WHERE EventID = @EventID`;
        const request = connection.request();
        request.input("EventID",id);
        const result = await request.query(sqlQuery);
        connection.close()
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
        EventRegEndDate = @EventRegEndDate, EventIntake = @EventIntake WHERE id = "@id"`
        const request = connection.request();
        request.input("id",Event.EventID);
        request.input("EventName",Event.EventName);
        request.input("EventDesc",Event.EventDesc);
        request.input("EventDesc",Event.EventDate);
        request.input("EventDesc",Event.EventLocation);
        request.input("EventDesc",Event.EventDate);
        request.input("EventRegEndDate",Event.EventRegEndDate);
        request.input("EventIntake",Event.EventIntake);
        const result = await request.query(sqlQuery);
        connection.close();
        return this.getEventByID(id);
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

    // create the event and store in db table
}
module.exports = Event;
