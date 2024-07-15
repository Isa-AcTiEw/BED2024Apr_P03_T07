
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
    

    function passToModal(delbtn){
        const row = delbtn.closest('tr');
        const eventIDElement = row.querySelector("#eventID");
        const eventID = eventIDElement.innerHTML.trim();
        try{
            const myModal = new bootstrap.Modal(document.getElementById('deleteEventModal'))

            myModal.show();
        }
        catch(error){
            console.error(error)
        }
        

        // target the submit button
        
    }
}













