const AccID = localStorage.getItem('AccID')
const Token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded',retrieveBookedEvents());

async function retrieveBookedEvents(){
    console.log(Token);
    const response = await fetch(`http://localhost:3000//EventBookings/getBookings/${AccID}` , {
        headers:{
            'Authorization':`Bearer ${Token}`
        }
    })
    if (response.status === 200){
        const eventContainer = document.getElementById("eventRow");
        const BookedEventsData = await response.json();
        console.log(BookedEventsData);
        const BookedEvents = BookedEventsData["events"];
        if(BookedEvents.length > 0){

            alert("Sucessfully retrieved user booked events");
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
            const listBookEventIDs = await retrieveBookEventIDs();
            const buttons = document.querySelectorAll('#deleteEventBooked');
            listBookEventIDs.forEach((BookEventIDs,eindex) =>{
                buttons.forEach((button,bindex) => {
                    button.addEventListener('click', async ()=> {
                        if(eindex == bindex){
                            // do a post here
                            const url = `http://localhost:3000/EventBookings/deleteBooking/${BookEventIDs["BookEventID"]}`
                            console.log(url);
                            const request = await fetch(url,{
                                method: 'DELETE',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                            })
                            
                            console.log(request);
                            if(request.status === 204){
                                alert(`Sucessfully deleted ${BookEventIDs["BookEventID"]}`)
                            }
                    }         
                    })
                })
            })
        }
        else{
            let documentBody = document.body;
            let content = "";
            const div = document.createElement('div');
            div.className = "card shadow";
            content += 
            `
            <div class="card-body style="width: 300px; height: 230px font-size: 20px;">
                <h3 class="card-title">No Bookings made for User</h3>
                <p class="card-text">Please create a booking</p>
                <button class="btn btn-primary d-flex justify-content-between" id= "goToEvent"  style="width: 200px; font-size: 20px;">View Events to book</button>
            </div>
            `
            div.innerHTML = content;
            documentBody.appendChild(div);
            const button = document.getElementById("goToEvent");
            button.addEventListener('click' , ()=>{
                window.open('http://localhost:3000/User/Event/ViewAllEvents.html','_blank');
            })
            
        }
        

        

    }
    if(response.status === 401){
        alert("Unauthorized please sign in");
        let documentBody = document.body;
        let content = "";
        const div = document.createElement('div');
        div.className = "card shadow";
        content += 
        `
         <div class="card-body style="width: 300px; height: 230px font-size: 20px;">
                <h3 class="card-title">Access is unauthorized</h3>
                <p class="card-text">Please sign up as a member</p>
                <button class="btn btn-primary d-flex justify-content-between" id= "goToEvent"  style="width: 200px; font-size: 20px;">Back to home page</button>
        </div>
        `
        div.innerHTML = content;
        documentBody.appendChild(div);
        const button = document.getElementById("goToEvent");
        button.addEventListener('click' , ()=>{
            window.open('http://localhost:3000/','_blank');
        })
        

    }
    else{
        alert("Unable to retrieve user events");
    }
}

async function retrieveBookEventIDs(){
    const response = await fetch(`http://localhost:3000/EventBookings/getBookEventIDs/${AccID}`,{
        headers:{
            "Authorization":`Bearer ${Token}`
        }
    })
    if(response.status === 200){
        alert("Retrieval of Booking IDs is successful");
        const listBookEventIDsData = await response.json();
        const BookedEventsIDs = listBookEventIDsData["value"];
        console.log(BookedEventsIDs);
        return BookedEventsIDs
    }
}