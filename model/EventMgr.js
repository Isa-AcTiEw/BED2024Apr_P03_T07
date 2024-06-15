const sql = require("mssql");
const dbConfig = require("../dbConfig");
class EventMgr extends Account{
    constructor(EventMgrID){
        //Inherit the accountID attribute from Account class
        super(AccID)
        this.AccID = EventMgrID
    }

    // retrive all events based on EventID

    static async getAllEventsById(id){
        const connection = await sql.connect();
        const sqlQuery = `SELECT * FROM Event WHERE EventID = @EventID`;
        sqlQuery.input("EventID",id)
        const request = connection.request();
        const result = await request.query(sqlQuery);
        return result.recordset.map
        ((row) => new Event(row.EventName,row.EventDesc,row.EventPrice,row.EventDate,row.EventCat,row.EventLocation,row.EventRegEndDate,row.EventIntake));

    }

    // retrive all events managed by a specific event manager e.g. Ae00001
    static async getAllEventsByEventMgrID(id){
        const connection = await sql.connect();
        const sqlQuery = `SELECT * FROM Event WHERE EventMgrID = @EventMgrID`
        sqlQuery.input("EventMgrID",id);
        const request = connection.request();
        const result = await request.query(sqlQuery)
        // In the recordset returned (num rows) map it to the Event class
        return result.recordset.map
        ((row) => new Event(row.EventName,row.EventDesc,row.EventPrice,row.EventDate,row.EventCat,row.EventLocation,row.EventRegEndDate,row.EventIntake));

    }

    // update the event details 

    static async updateEventDetails(id,Event){
        const connection = await sql.connect();
        const sqlQuery = 
        `UPDATE Event SET EventName = @EventName, EventDesc = @EventDesc, 
        EventDate = @EventDate, EventLocation = @EventLocation, 
        EventRegEndDate = @EventRegEndDate, EventIntake = @EventIntake WHERE id = "@id"`
        sqlQuery.input("id",Event.EventID);
        sqlQuery.input("EventName",Event.EventName);
        sqlQuery.input("EventDesc",Event.EventDesc);
        sqlQuery.input("EventDesc",Event.EventDate);
        sqlQuery.input("EventDesc",Event.EventLocation);
        sqlQuery.input("EventDesc",Event.EventDate);
        sqlQuery.input("EventRegEndDate",Event.EventRegEndDate);
        sqlQuery.input("EventIntake",Event.EventIntake);
        const request = connection.request();
        const result = await request.query(sqlQuery);
        return this.getEventByID(id);
    }

    // delete the event based on EventID given 
    static async deleteEvent(id){
        const connection = await sql.connect();
        const sqlQuery = `DELETE FROM Event WHERE EventID = @EventID`
        sqlQuery.input("EventID",id);
        const request = connection.request();
        const result = await request.query(sqlQuery);
        const rowsAffected = result.rowsAffected;
        console.log(`Number of rows affected ${rowsAffected} in Event database`);

    }
    
}