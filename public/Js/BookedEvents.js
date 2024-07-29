const AccID = localStorage.getItem('AccID')
const Token = localStorage.getItem('token');


if(Token != null){
    console.log(Token);
    document.addEventListener('DOMContentLoaded',retrieveBookedEvents());
}
else if (Token = null){
    alert(`Token is null ${Token}`)
}
else{
    showAlert('danger',"User has not logged in please log in");
}



async function verifyRole(){
    console.log(Token);
    const response = await fetch("User/Event/BookedEvents",{
        headers:{
            'Authorization':`Bearer ${Token}`
        }
    })
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
    if(response.status === 200){
        retrieveBookedEvents();
    }
}
async function retrieveBookedEvents(){
    console.log(Token);
    const response = await fetch(`http://localhost:3000/EventBookings/getBookings/${AccID}` , {
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
                const formattedEventDate = new Date(event.EventDate).toDateString();
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
                                        <p class = "mb-0">${formattedEventDate}</p>
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
                    console.log(button);
                    button.addEventListener('click', ()=> {
                        if(eindex == bindex){
                            // do a post here
                            const myModal = new bootstrap.Modal(document.getElementById('deleteBookedEventModal'))
                            myModal.show();
                            const delButton = document.getElementById('confirmDel');
                            const returnButton = document.getElementById('returnBtn');
                            returnButton.addEventListener('click',()=>{
                                myModal.hide();
                            })
                            delButton.addEventListener('click' , async ()=>{
                                const url = `http://localhost:3000/EventBookings/deleteBooking/${BookEventIDs["BookEventID"]}`
                                console.log(url);
                                const request = await fetch(url,{
                                    method: 'DELETE',
                                    headers:{
                                        'Authorization':`Bearer ${Token}`,
                                        'Content-Type':'application/json'
                                    },
                                })
                                
                                console.log(request);
                                if(request.status === 204){
                                    myModal.hide();
                                    location.reload()
                                }
                            })
                        }  
                               
                    })
                })
            })
        }
        else{
            alert("You have not booked any events");
            let content = "";
            const div = document.getElementById("noBookings");
            div.className = "card shadow";
            content += 
            `
            <div class="card-body style="width: 300px; height: 230px font-size: 20px;">
                    <h3 class="card-title">No bookings made</h3>
                    <p class="card-text">Please book events</p>
                    <button class="btn btn-primary d-flex justify-content-between" id= "goToEvent"  style="width: 200px; font-size: 20px;">Back to home page</button>
            </div>
            `
            div.innerHTML = content;
            const button = document.getElementById("goToEvent");
            button.addEventListener('click' , ()=>{
                window.open('http://localhost:3000/','_blank');
            })
        }
        
        

        

    }
    else if (response.status === 404){
        console.log(response);
        const message = resdata["message"];
        alert("Unable to retrive bookings");
        let documentBody = document.body;
        let content = "";
        const div = document.createElement('div');
        div.className = "card shadow";
        content += 
        `
        <div class="card-body style="width: 300px; height: 230px font-size: 20px;">
            <h3 class="card-title">${message}</h3>
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
        const listBookEventIDsData = await response.json();
        const BookedEventsIDs = listBookEventIDsData["value"];
        console.log(BookedEventsIDs);
        return BookedEventsIDs
    }
}


function showAlert(type, msg) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    if (!alertPlaceholder) {
        console.error('Alert placeholder element not found.');
        return;
    }

    const alert = document.createElement('div');
    alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show custom-alert`;
    alert.innerHTML = `
        <strong>${msg}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertPlaceholder.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}