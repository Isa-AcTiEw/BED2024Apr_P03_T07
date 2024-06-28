const Event = require('../model/Event');
const Account = require('../model/Account');
const EventMgr = require('../model/EventMgr');

// Handle the routes from the EventMgr page 
const getAllEventsByEventMgrID = async (req,res) =>{
    try {
        const EventMgrID = req.params.id;
        const Events = await EventMgr.getAllEventsByEventMgrID(EventMgrID);
        res.json(Events);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving books");
      }
};

const deleteEvent = async (req,res) =>{
  try{
    const EventID = req.params.id;
    const eventFound = Event.deleteEvent(EventID);
    if(!eventFound){
      return res.status(404).send('Event not found')
    }
    return res.status(204).send('Event sucessfully deleted')
    
  }
  catch(error){
    console.error(error);
    res.status(500).send("Error retrieving books");
  }
}


module.exports = {
    getAllEventsByEventMgrID,
    deleteEvent,
  };


