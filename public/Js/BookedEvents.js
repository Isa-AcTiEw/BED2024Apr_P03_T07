const AccID = "ACC002"

document.addEventListener('DOMContentLoaded',retrieveBookedEvents());

async function retrieveBookedEvents(){
    const response = await fetch(`http://localhost:3000/EventBookings/getBookings/${AccID}`)
    if (response.status === 200){
        alert("Sucessfully retrieved user booked events");
        const eventContainer = document.getElementById("eventRow");
        const BookedEventsData = await response.json();
        console.log(BookedEventsData);
        const BookedEvents = BookedEventsData["events"];
        let rowContent = ""
        BookedEvents.forEach(event =>{
            rowContent += 
            `
            <div class = "col-md-4">
                    <div class = "card border-0 shadow-sm" style="width: auto; height: auto;">
                        <img src="../../images/events pictures/cooking event.jpg" class = "card-img-top">
                        <div class = "card-body">
                            <h3 class = "text-dark" id="eventName">${event.EventName}</h3>
                            <div class = "eventBookingDetails d-flex align-items-center justify-content-between" style = "margin-top: 30px;">
                                <span class="badge rounded-pill bg-light text-dark text-wrap" style="font-size: 20px;">
                                    <i class="bi bi-geo-fill"></i> ${event.EventLocation}
                                </span>
                                <span class="badge rounded-pill bg-light text-dark text-wrap">
                                    <p class = "mb-0">${event.EventDate}</p>
                                </span>
                                <span class="badge rounded-pill bg-light text-dark text-wrap">
                                    <p class = "mb-0">Booked  date</p>
                                </span>
                            </div>
                            <button type="button d-flex justify-content-between" class="btn btn-primary" id = "deleteEventBooked" style="width: 200px; font-size: 20px; margin-top: 30px;">Delete Booking</i>
                            </button>
                            
                        </div>

                        
                    </div>
                </div>
            `
        })
        
        eventContainer.innerHTML = rowContent
        // find all the buttons to delete
        const button = document.querySelectorAll('#deleteEventBooked');
        const buttonList = Array.from(button);
        buttonList.forEach((but,index)=>{
            but.addEventListener('click', ()=>{
                console.log(`Button${index} clicked`)
            })
        })
        

    }
    else{
        alert("Unable to retrieve user events");
    }
}