// fetch all events 
document.addEventListener('DOMContentLoaded', retrieveEvents());

async function retrieveEvents(){
    const response = await fetch('/getEvents')
    if(!response.ok){
        throw new Error(`HTTP error: ${response.status}`);
    }

    const eventList = await response.json();
    // call displayEvents
    displayEvents(eventList)
}


function displayEvents(events){
    // retrive the html element storing the event 
    let EventIDList = [];
    console.log(events);
    let row = '';
    const eventRow = document.getElementById("eventRow");
    events.forEach((element, index) => {
        const EventDate = new Date(element.EventDate);
        const formattedeventDate = EventDate.toDateString();
        EventIDList.push(element.EventID);
        
        row += `
        <div class="col-md-4">
            <div class="card border-0 shadow-sm" id="cardDetails_${index}" style="width: auto; height: auto;">
                <img src="../../images/events pictures/cooking event.jpg" class="card-img-top">
                <div class="card-body">
                    <h3 class="text-dark" id="eventName">${element.EventName}</h3>
                    <span class="badge rounded-pill bg-light text-dark text-wrap" style="font-size: 20px;">
                        <i class="bi bi-geo-alt-fill"></i> ${element.EventLocation}
                    </span>
                    <div class="eventDetails mb-4 mt-3">
                        <h4 class="mb-1 text-dark">Event Details</h4>
                        <span class="badge rounded-pill bg-light text-dark text-wrap" style="font-size: 20px;">
                            <i class="bi bi-tag"></i> Free
                        </span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap" style="font-size: 20px;">
                            <i class="bi bi-calendar3" id="eventDate"></i> ${formattedeventDate}
                        </span>
                        <span class="badge rounded-pill bg-light text-dark text-wrap" style="font-size: 20px;">
                            <i class="bi bi-people-fill" id="eventIntake"></i> ${element.EventIntake}
                        </span>
                    </div>
                    <button class="btn btn-primary d-flex justify-content-between" id="button_view_${index}" style="width: 200px; font-size: 20px;">View Events</button>
                </div>
            </div>
        </div>
        `;

        // Find the eventID
        console.log(EventIDList);

        
        
        
    });
    eventRow.innerHTML = row;

    // get a list of the viewEventButton
    const buttons = document.querySelectorAll('.btn.btn-primary')
    console.log(buttons)
    const buttonArray = Array.from(buttons)
    EventIDList.forEach((eID, index) => {
        buttonArray.forEach((button, bindex) => {
            button.addEventListener('click', () => {
                if (index === bindex) {
                    // Handle the button click event here
                    localStorage.setItem("EventID",eID);
                    window.location.href = "http://localhost:3000/User/Event/ViewEvent.html";
                }
            });
        });
    });


}

// add an onclick listener that stores the eventID clicked as local storage 
