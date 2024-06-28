const Event = require('../model/Event');
const Account = require('../model/Account');
const EventMgr = require('../model/EventMgr');
const { request } = require('express');
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
    const eventID = req.params;
    // what uf eventID not found should do a resource not found respond 404
    const event = req.body;
    const updatedEvent = Event.updateEventDetails(eventID,event);
    res.json(updatedEvent);
    if(!updatedEvent){
      res.status(404).send("Unable to find event to update")
    }
    res.status(200).send("Updated event sucessfully");
  }
  catch (error){
    console.error(error);
    res.status(500).send("Error updating event")
  }
}

module.exports = {
    getAllEventsByEventMgrID,
    deleteEvent,
    createEvent,
    updateEvent,
  };


