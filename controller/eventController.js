const Event = require('../model/Event');
const Account = require('../model/Account');
const EventMgr = require('../model/EventMgr');
const { request } = require('express');
// Handle the routes from the EventMgr page 
const getAllEventsByEventMgrID = async (req,res) =>{
    try {
        const EventMgrID = req.params.id;
        console.log(EventMgrID);
        const Events = await EventMgr.getAllEventsByEventMgrID(EventMgrID);
        res.json(Events);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving Event");
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
    res.status(500).send("Error retrieving events");
  }
}

const createEvent = async (req,res) => {
  try{
    const event = req.body;
    const eventMgrID = req.params;
    const createdEvent = await Event.createEvent(event,eventMgrID);
    res.status(201).json(createdEvent);
    console.log('Event created sucessfully')

  }
  catch (error){
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateEvent = async (req,res) => {
  try{
    const EventID = req.params.id;
    const {EventName,EventDesc,EventPrice,EventDate,EventCat,EventLocation,EventRegEndDate,EventIntake} = req.body;
    if(EventCat == "Arts and Culture" || EventCat == "Active Aging" || EventCat == "Cooking" || EventCat == "Environment" || EventCat == "Festivities" || EventCat == "LifeLong Learning"){
      const updatedEvent = await Event.updateEventDetails(EventID,EventName,EventDesc,EventPrice,EventDate,EventCat,EventLocation,EventRegEndDate,EventIntake);
      if(!updatedEvent){
        res.status(404).send("Unable to update event");
      }
      res.status(200).json({message:"Updated Event Sucessfully",
                                 updatedEvent: updatedEvent
      });
    }

    else{
      res.status(404).send("Incorrect event category entered");
    }
    
  }
  catch (error){
    console.error(error.stack);
    res.status(500).send("Error updating event")
  }
}

const getAllEvents = async (req,res) => {
  try{
    const Events = await Event.getAllEvent();
    if(Events.length != 0){
      res.json(Events);
      
    }
    else{
      res.status(404).json({"message":"There are no events listed"})
    }
    

  }
  catch(error){
    console.error(error)
    res.status(500).send("Error retriving all events")
  }
}

// patch check validation the value passed (patch certain value some value cannot allowed)

// put for updating but fields that cannot be changed hidden field 

module.exports = {
    getAllEventsByEventMgrID,
    deleteEvent,
    createEvent,
    updateEvent,
    getAllEvents
  };


