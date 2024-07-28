
document.addEventListener('DOMContentLoaded',handleEvents())
// retrive the eventMgr from local storage and then fetch() api request to get the events associated with event manager
async function handleEvents(){
    const url = `http://localhost:3000/EventMgr/getEvents/EVT001`;
    // handleEvents has to be asynchronus to await the promise to be fufilled from getEvents
    const listEvent = await getEvents(url);
    displayEvents(listEvent);
    
}

async function getEvents(url){
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
    const events = await response.json();
    if(events != null){
        try {
            return events; // Return 'events' if no error occurs
        } catch (error) {
            console.error(error);
        }
    }
    
}

function displayEvents(listEvent){
    // parent div

    const tableBody = document.getElementById('EventData');
    // testdata works need to overwrite all table rows 
    createrows(listEvent,tableBody);
   

}

function createrows(listEvent,tableBody){
    // Initialize rowContent as an empty string
    let rowContent = '';
    listEvent.forEach(element => {
    // Step 1:Cast datestring to date object

    const eventDate = new Date(element.EventDate);
    
    const regEnddate = new Date(element.EventRegEndDate);

    // Step 2: return the date in human readable form
    const formattedeventDate = eventDate.toDateString();
    const formattedregEndDate = regEnddate.toDateString();
        // append each row to rowcontent, initialize it as an empty string so it stores the prev added rows
        rowContent += 
        `
        <tr>
            <td id = "eventID">${element.EventID}</td>
            <td id = "eventName">${element.EventName}</td>
            <td id = "eventDesc">${element.EventDesc}</td>
            <td id = "eventPrice">${element.EventPrice}</td>
            <td id = "eventDate">${formattedeventDate}
            <td id = "eventCat">${element.EventCat}</td>
            <td id = "eventLocation">${element.EventLocation}</td>
            <td id = "eventRegEndDate">${formattedregEndDate}</td>
            <td id = "eventIntake">${element.EventIntake}</td>
            <td class = "eventActions" id="eventButton">
                <div class = "d-flex justify-content-around flex-column">
                    <div class="btn btn-round btn-outline-dark  p-2 m-2 delete button" id = "Delete">Delete</div>
                    <div class = "btn btn-round btn-outline-dark p-2 m-2 update button" id = "Update">Update</div>
                </div>
            </td>
        </tr>
        `;
    });
    tableBody.innerHTML = rowContent;
    
    // this is where you will call the method
    deleteEvent();

    createEvent();

    updateEvent();
}




function deleteEvent(){
    // retrieve the delete button 
    // get the nearest td and tr to find eventID
    const deleteButtonList = document.querySelectorAll("#Delete");
    console.log(deleteButtonList)
    // pass a lambda function that is triggered when event occurs to call findEventID
    deleteButtonList.forEach(delBtn =>{
        delBtn.addEventListener('click', () => {
            passToModal(delBtn);
        })
    })


    async function deleteRequest(eventID){
        console.log(eventID);
        const url = `http://localhost:3000/EventMgr/deleteEvents/${eventID}`
        const response = await fetch(url,{
            method: 'DELETE'
        })

        if(!response){
            console.log("Unable to handle response")
        }
    }
    

    function passToModal(delbtn){
        const row = delbtn.closest('tr');
        const eventIDElement = row.querySelector("#eventID");
        const eventID = eventIDElement.innerHTML.trim();
        try{
            const myModal = new bootstrap.Modal(document.getElementById('deleteEventModal'))

            myModal.show();


            const confirm = document.getElementById("confirmDel");
            const returnbtn = document.getElementById("returnBtn");
            returnbtn.addEventListener('click', ()=>{
                myModal.hide()
            })
            
            console.log(confirm)
            confirm.addEventListener('click',() => {
                // DELETE METHOD
                deleteRequest(eventID)
                myModal.hide();
                reloadPage();
                // fetch again 
            })

           

        }
        catch(error){
            console.error(error)
        }
        

        // target the submit button
        
    }
}




function toSmalldatetimeFormat(date) {
    // Extract date components
    const Year = date.getFullYear();
    const Month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const Day = String(date.getDate()).padStart(2, '0');
    // takes up two indices 00
    const Hours = String(date.getHours()).padStart(2, '0');
    const Minutes = String(date.getMinutes()).padStart(2, '0');
    const Seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Construct the smalldatetime string
    return `${Year}-${Month}-${Day} ${Hours}:${Minutes}:${Seconds}`;
}

function createEvent(){
    // target the create button and get all the fields
    const eventForm = document.getElementById("addEventForm");
    console.log("Create Event");
    eventForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        // call the retrive eventID scope here 
        const result = await fetch("/getEventID");
        const data = await result.json();
        const lastEventID = data.value;
        // extract the front portion of EventID ("Ev")
        const id = 'Ev';
        // remaining length excluding Ev
        const padLength = lastEventID.length - id.length;

        const oldNum = lastEventID.substring(id.length);
        const newNum = parseInt(oldNum) + 1;
        // pad the remainder of the string with 0 including newNum
        const neweventID = id+ newNum.toString().padStart(padLength, '0'); 

        const eventName = document.getElementById("addEventName").value;
        const eventDesc = document.getElementById("addEventDesc").value;
        const eventDate = document.getElementById("addEventDate").value;
        const formattedeventDate = toSmalldatetimeFormat(new Date(eventDate));
        const eventCat = document.getElementById("addEventCat").value;
        const eventLocation = document.getElementById("addEventLocation").value;
        const eventRegEndDate = document.getElementById("addEventRegEndDate").value;
        const formattedEventRegEndDate = toSmalldatetimeFormat(new Date(eventRegEndDate));
        const eventIntake = document.getElementById("addEventIntake").value;

        console.log(formattedEventRegEndDate);
        // fetch request from the endpoint
        await fetch(`/EventMgr/createEvents`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({ EventID:neweventID,
                                   EventName: eventName,
                                   EventDesc: eventDesc,
                                   EventPrice:"0",
                                   EventDate: formattedeventDate,
                                   EventCat : eventCat,
                                   EventLocation: eventLocation,
                                   EventRegEndDate: formattedEventRegEndDate,
                                   EventMgrID: "EVT001",
                                   EventIntake: eventIntake
                                   })
        })

        const modalElement = document.getElementById(`addEventsModal`);
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
        reloadPage();
    });

}

function updateEvent(){
    const data = document.getElementById("EventData");
    const childNodes = data.children;
    let childArray = Array.from(childNodes);
    childArray.forEach((child,index)=>{
        // use child to locate the button
        const update = child.querySelector('#Update');
        update.addEventListener('click', ()=>{
            
            // get all the tr associated with it to create the modal 
            const EventID = child.querySelector('#eventID').textContent;
            const EventName = child.querySelector('#eventName').textContent;
            const EventDesc = child.querySelector('#eventDesc').textContent;
            const EventPrice = child.querySelector('#eventPrice').textContent;
            const EventDate = child.querySelector('#eventDate').textContent;
            const formattedeventDate = toSmalldatetimeFormat(new Date(EventDate));
            const EventCat = child.querySelector('#eventCat').textContent;
            const EventLocation = child.querySelector('#eventLocation').textContent;
            const EventRegEndDate = child.querySelector('#eventRegEndDate').textContent;
            const formattedeventRegEndDate = toSmalldatetimeFormat(new Date(EventRegEndDate));
            const EventIntake = child.querySelector('#eventIntake').textContent;

            // create the update modal
            const updateModal = document.createElement("div");
            updateModal.classList.add("modal","fade");
            updateModal.id = `updateModal_${index}`;
            updateModal.setAttribute("data-bs-backdrop","static");
            updateModal.setAttribute("tabindex", "-1");
            updateModal.setAttribute("aria-labelledby", `updateModalLbl`);
            updateModal.setAttribute("aria-hidden", "true");

            updateModal.innerHTML = `

                <div class="modal-dialog" role="document">
                    <form id="editEventForm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Update Event Details</h5>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label class="form-label">Event Name</label>
                                    <input type="text" name="Event Name" class="form-control" id="editEventName" required value = "${EventName}" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Event Description</label>
                                    <textarea name="event_desc" class="form-control" rows="6" id="editEventDesc" required/> ${EventDesc}</textarea>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Event Date</label>
                                    <input type="datetime-local" name="event_date" class="form-control" value = "${formattedeventDate}" id="editEventDate" required/>
                                </div>

                                <div class="mb-3">
                                    <label for="event_cat" class="form-label">Event Category</label>
                                    <select class="form-select" id="editEventCat" required>
                                        <option selected>${EventCat}</option>
                                        <option value="Active Ageing">Active Ageing</option>
                                        <option value="Cooking">Cooking</option>                                                                         
                                        <option value="Arts and Culture">Arts and Culture</option>
                                        <option value="Festivities">Festivities</option>
                                        <option value="Lifelong Learning">Lifelong Learning</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Event Location</label>
                                    <input type="text" name="event_location" class="form-control" value = ${EventLocation} id="editEventLocation" required/>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Event Registration End Date</label>
                                    <input type="datetime-local" name="event_reg_end_date" class="form-control" id="editEventRegEndDate" value = "${formattedeventRegEndDate}" required/>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Event Intake</label>
                                    <input type="text" name="event_intake" class="form-control" id="editEventIntake" value = ${EventIntake} required/>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" id ="saveEditBtn">Save changes and Submit</button>
                            </div>
                        </div>
                    </form>
                </div>

            `
            document.body.appendChild(updateModal);
            
            // pass index why create a new div element for each indexed child (if not it refrences the same id (same result))
            const myModal = new bootstrap.Modal(document.getElementById(`updateModal_${index}`))

            myModal.show();

            // bind another button to call the put method

            const saveEdit = document.getElementById('editEventForm');
            saveEdit.addEventListener('submit', async(g) => {
                g.preventDefault();
                console.log(EventID);
                const eventName = document.getElementById("editEventName").value;
                const eventDesc = document.getElementById("editEventDesc").value;
                const eventDate = document.getElementById("editEventDate").value;
                const formattedeventDate = toSmalldatetimeFormat(new Date(eventDate));
                const eventCat = document.getElementById("editEventCat").value;
                const eventLocation = document.getElementById("editEventLocation").value;
                const eventRegEndDate = document.getElementById("editEventRegEndDate").value;
                const formattedEventRegEndDate = toSmalldatetimeFormat(new Date(eventRegEndDate));
                const eventIntake = document.getElementById("editEventIntake").value;
                const response = await fetch (`/EventMgr/updateEvents/${EventID}`,{
                    method : "PUT",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                    body : JSON.stringify({
                        EventID : EventID,
                        EventName : eventName,
                        EventDesc : eventDesc,
                        EventPrice:"0",
                        EventDate: formattedeventDate,
                        EventCat : eventCat,
                        EventLocation: eventLocation,
                        EventRegEndDate: formattedEventRegEndDate,
                        EventMgrID: "EVT001",
                        EventIntake: eventIntake
                    })


                }
                    
                )

                if(!response){
                    console.log("Unable to update the event");
                }

                myModal.hide();
                reloadPage();
            })
            
            
            
            

            
            

        })
        

    });
    
    
}

function reloadPage() {
    console.log('Reloading the page using href');
    window.location.href = window.location.href;
  }















