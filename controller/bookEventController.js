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
        const BookedEvents = await BookEvent.retrieveUserEventBooked(AccID);
        if(BookedEvents > 0){
            res.status(200).json({message : "Bookings sucessfully retrived" , content: BookedEvents})
        }
        else{
            res.status(404).send("User has no events booked")
        }

    }
    catch(error){
        console.error(error);
        res.status(500).send("Internal server error");
    }
}


const LastBookEventID = async (req,res) =>{
    try{
      const BookEventID = await BookEvent.retriveLastBookingID;
      if(BookEventID != null){
        res.status(200).json({"message":"Sucessfully retrived last EventID in Event table", "value":EventID[""]} 
        );
      }
      
    }
    catch(error){
      console.error(error);
      res.status(500).send("Unable to retrive the EventID")
    }
  }

module.exports = {
    createBooking,
    deleteBooking,
    retrieveUserEventBooked,
    LastBookEventID
}