const BookEvent = require('../model/BookEvent');


const createBooking = async (req,res) =>{
    try{
        const booking = req.body;
        const BookedEvent = await BookEvent.createBooking(booking);
        res.status(201).json({message : "Resource sucessfully created",response:BookedEvent});

    }
    catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
}

const deleteBooking = async (req,res) =>{
    try{
        const BookEventID = req.params.id;
        console.log(BookEventID);
        const bookingFound = BookEvent.deleteBooking(BookEventID);
        if(!bookingFound){
            return res.status(404).send("Booked event not found");
        }
        return res.status(204).send("Booked event sucessfully removed");
    }
    catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
}


const retrieveUserEventBooked = async (req,res) =>{
    try{
        const AccID = req.params.id;
        console.log(AccID)
        const BookedEvents = await BookEvent.retrieveUserEventBooked(AccID);
        if(BookedEvents != null){
            res.status(200).json({message: "Sucessfully retrieved user booked events", events: BookedEvents})
        }
        else{
            res.status(404).json({message: "User has no bookings"})
        }

    }
    catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
}


const LastBookID = async (req,res) =>{
    try{
      const BookEventID = await BookEvent.retriveLastBookingID();
      if(BookEventID != null){
        res.status(200).json({"message":"Sucessfully retrived BookEventID",value:BookEventID.BookEventID} 
        );
      }
      
    }
    catch(error){
      console.error(error);
      res.status(500).send("Unable to retrive the EventID")
    }
  }

  const retrieveBookedEventsEventID = async (req,res) =>{
    try{
        const AccID = req.params.id
        const EventIDs = await BookEvent.retrieveBookedEventsID(AccID);
        if(EventIDs != null){
            res.status(200).json({"message":"Retrieved event id's successfully", value: EventIDs})
        }
        else{
            res.status(404).send("User has no events booked")
        }
    }
    catch(error){
        console.error(error)
        res.status(500).send("Unable to retrieve EventIDs of user booked events")
    }
  }

  const retrieveBookEventIDs = async (req,res) =>{
    try{
        const AccID = req.params.id;
        const BookEventIDs = await BookEvent.retrieveEventBookingBookedID(AccID);
        if(BookEventIDs != null){
            res.status(200).json({message: "BookEventIDs for user have been sucessfully retrieved",value:BookEventIDs})
            
        }
        else{
            res.status(404).send("There is no events booked by the user")
        }

    }
    
    catch(error){
        console.error(error);
        res.status(500).send("Unable to retrive BookEventIDs associated with the user")
    }
}

module.exports = {
    createBooking,
    deleteBooking,
    retrieveUserEventBooked,
    LastBookID,
    retrieveBookedEventsEventID,
    retrieveBookEventIDs
}