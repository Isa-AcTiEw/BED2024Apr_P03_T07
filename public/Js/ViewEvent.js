const EventID = localStorage.getItem("EventID");

// fetch the event based on the id 

document.addEventListener('DOMContentLoaded',retrieveEventByID())

async function retrieveEventByID(){
    const response = await fetch(`http://localhost:3000/getEventByID/${EventID}`)
    if(!response.ok){
        throw new Error(`HTTP error: ${response.status}`);
    }

    const event = await response.json();
    displayEvent(event);
   
    
}

function displayEvent(event){
    const Event = event[0];
    const row = document.getElementById('event-row')
    const EventDate = new Date(Event.EventDate);
    const EventRegEndDate = new Date(Event.EventRegEndDate);
    const formattedEventRegEndDate = EventRegEndDate.toDateString();
    const formattedeventDate = EventDate.toDateString();
    let rowContent = ''
    rowContent += 
    `
         <div class = "col-md-7 rounded align-items-center shadow-lg p-5 ml-2">
                    <div class = "eventName" id = "eName">
                        <!-- <h3>Event Name</h3> -->
                    </div>

                    <div class = "eventDetails" id = "eDetail" style="font-size: 20px;">
                        <p>${Event.EventDesc}</p>
                    </div>
                </div>
                <div class = "col-md-4 rounded align-items-center shadow-lg p-5">
                    <h3>Event Details</h3>
                    <div class="eventDate d-flex align-items-center" style="margin-top: 30px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-calendar-event-fill" viewBox="0 0 16 16">
                            <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        <div class="d-flex justify-content-center" id="event_date" style="margin-left: 15px; font-size: 20px;">
                            <p class="mb-0">Event Date: ${formattedeventDate}</p>
                        </div>
                    </div>
                    <div class="eventRegEndDate d-flex align-items-center" style="margin-top: 30px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-calendar-event-fill" viewBox="0 0 16 16">
                            <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        <div class="d-flex justify-content-center" id="event_date" style="margin-left: 15px; font-size: 20px;">
                            <p class="mb-0">Registration Date: ${formattedEventRegEndDate}</p>
                        </div>
                    </div>

                    <div class = "eventLocation d-flex align-items-center" style = "margin-top: 30px;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-geo-fill" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
                        </svg>
                        <div class="d-flex justify-content-center" id="eventLocation" style="margin-left: 15px; font-size: 20px;">
                            <p class="mb-0">${Event.EventLocation}</p>
                        </div>
                    </div>

                    <button type="button d-flex justify-content-between" class="btn btn-primary" id="bookingButton" style="width: 200px; font-size: 20px; margin-top: 30px;">Book Now <i class="bi bi-check-circle-fill"></i>
                    </button>
                    

                </div>
    `

    row.innerHTML = rowContent;

    // Call the bookEventMethod
    const button = document.getElementById("bookingButton");

    button.addEventListener('click', async (e)=>{
        // fetch the latest bookingID
        const response = await fetch("http://localhost:3000/ViewEvents/createBooking");
        const data = await response.json();
        console.log(data);
        const LastBookID = data.value;
        console.log(LastBookID)
        const substring = LastBookID.substring(0,LastBookID.length - 1);
        const newNum = parseInt(LastBookID.charAt(4)) + 1;
        const BookID = substring + newNum;
        console.log(BookID);
        if(!LastBookID){
            console.log("There is no current bookings")
        }

        const AccID = "ACC002"
        const BookDateTime = new Date();
        function convertDate(BookDateTime){
            console.log(BookDateTime)
            const year = BookDateTime.getFullYear();
            const month = BookDateTime.getMonth() + 1;
            const day = BookDateTime.getDate();
            const timestamp = BookDateTime.toLocaleTimeString('en-SG', { hour12: false });  // 24-hour format
            const BookDate = year + "-" + month + "-" + day + " " + timestamp
            return BookDate
        }

        const BookEventDate = convertDate(BookDateTime)


        // check if user has alreay booked the event call my backend

        const bookEventIDs = await fetch(`http://localhost:3000/ViewEvents/createBooking/${AccID}`)
        if(!bookEventIDs.ok){
            alert("User has not booked any events")
        }
        else{
            const EventIDData = await bookEventIDs.json()
            const EventIDs = EventIDData["value"]
            const EventIDList = [];
            EventIDs.forEach(element => {
                EventIDList.push(element["Event ID"]);
            })
            if(EventIDList.includes(EventID)){
                alert("User has already booked the event");
            }
            
            else{
                console.log(BookEventDate);
                const url = "http://localhost:3000/ViewEvents/createBooking/"
                const response = await fetch(url,{
                        method: 'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            BookEventID: BookID,
                            BookEventDate: BookEventDate,
                            EventID: EventID,
                            AccID: AccID
                        })
                    })
                if(response.status === 201){
                    alert("User has sucessfully Booked the event");
                }
                
                else{
                    alert("Unable to book the event");
                }

                
    
            }

        }
           
    
        
        // call the post method

    })

}