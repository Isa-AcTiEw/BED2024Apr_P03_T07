
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
            <td>${element.EventName}</td>
            <td>${element.EventDesc}</td>
            <td>${element.EventPrice}</td>
            <td>${formattedeventDate}
            <td>${element.EventCat}</td>
            <td>${element.EventLocation}</td>
            <td>${formattedregEndDate}</td>
            <td>${element.EventIntake}</td>
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
}

document.addEventListener('DOMContentLoaded', handleEvents);



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
            console.log(confirm)
            confirm.addEventListener('click',() => {
                // DELETE METHOD
                deleteRequest(eventID)
            })

            const returnbtn = document.getElementById("return");
            returnbtn.addEventListener('click',() => {
                // close modal
                myModal.hide();
            })

        }
        catch(error){
            console.error(error)
        }
        

        // target the submit button
        
    }
}


function createEvent(){
    // target the create button and get all the fields
    const createBtn = document.getElementById("createBtn");
    createBtn.addEventListener('click', async (e)=>{
        e.preventDefault();
        // call the retrive eventID scope here 
        const result = await fetch("/getEventID");
        const lastEventID = result.value;
        const substring = lastEventID.substring(0,lastEventID.length)
        const newNum = parseInt(lastEventID.charAt(myString.length - 1)) + 1;
        const eventID = substring + newNum
        const eventName = document.getElementById("addEventName").value;
        const eventDesc = document.getElementById("addEventDesc").value;
        const eventDate = document.getElementById("addEventDate").value;
        const eventCat = document.getElementById("addEventCat").value;
        const eventLocation = document.getElementById("addEventLocation").value;
        const eventRegEndDate = document.getElementById("addEventRegEndDate").value;
        const eventIntake = document.getElementById("addEventIntake").value;
        
        // fetch request from the endpoint
        const request = await fetch(`http://localhost:3000/EventMgr/createEvents`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({ EventID:eventID,
                                   EventName: eventName,
                                   EventDesc: eventDesc,
                                   EventPrice:"0",
                                   EventDate: eventDate,
                                   EventCat : eventCat,
                                   EventLocation: eventLocation,
                                   EventRegEndDate: eventRegEndDate,
                                   EventMgrID: "EVT001",
                                   EventIntake: eventIntake
                                   })
        })


    })

}













