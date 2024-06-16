const sql = require("mssql");
const dbConfig = require("../db_Config/db_Config");
const Account = require("./Account");
const Event = require("./Event");
class EventMgr extends Account{
    constructor(EventMgrID){
        //Inherit the accountID attribute from Account class
        super(AccID)
        this.AccID = EventMgrID
    }


    // retrive all events managed by a specific event manager e.g. Ae00001
    static async getAllEventsByEventMgrID(id){
        const connection = await sql.connect();
        const sqlQuery = `SELECT * FROM Event WHERE EventMgrID = @EventMgrID`
        const request = connection.request();
        request.input("EventMgrID",id);
        const result = await request.query(sqlQuery);
        // it works
        return result.recordset.map(
            (row) => 
            new Event
            (row.EventID,
             row.EventName,
             row.EventDesc,
             row.EventPrice,
             row.EventDate,
             row.EventCat,
             row.EventLocation,
             row.EventRegEndDate,
             row.EventMgrID,
             row.EventIntake
                            
            )
          ); // Convert rows to Book objects


    }

    
    
}
module.exports = EventMgr;