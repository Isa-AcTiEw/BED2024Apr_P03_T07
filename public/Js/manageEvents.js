
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
    handleActions();

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
                    <div class="btn btn-round btn-outline-dark  p-2 m-2 delete button" id = "Delete"  data-bs-toggle="modal" >Delete</div>
                    <div class = "btn btn-round btn-outline-dark p-2 m-2 update button" id = "Update">Update</div>
                </div>
            </td>
        </tr>
        `;
    });
    tableBody.innerHTML = rowContent;
}

document.addEventListener('DOMContentLoaded', handleEvents);

function handleActions(){
    let eventID = null;
    // need to target button instead
    // buttonContainer is a NodeList of all the HTML elements matching the css selctor #eventButton
    const buttonContainer = document.querySelectorAll('#eventButton'); // Example selector
    
    
    for (let i = 0; i < buttonContainer.length; i++) {
        const container = buttonContainer[i];
        const buttons = container.querySelectorAll(".btn");

        for (let j = 0; j < buttons.length; j++) {
            const button = buttons[j];

            button.addEventListener('click', function(e) {
                const buttonid = e.target.id;
                switch (buttonid) {
                    case "Delete":
                        // Retrieve the elementId of the thing
                        
                        // Traverse DOM tree by finding closest element tag inside the button container and use DELETE method
                        const tr = container.closest("tr")
                        // get the text value of the the EventID
                        const eventIDELement = tr.querySelector("#eventID")
                        
                        eventID = eventIDELement.innerHTML.trim();

                        // callback baby
                        openModal(eventID)

                        // function to call modal and pass eventID

                        console.log("Delete button pressed");
                        break;

                    case "Update":
                        // Traverse DOM tree and use DELETE or POST method 
                        console.log("Update button pressed");
                        break;
                }
            });
            
            
        }

        
    }

    function openModal(eID){
        // get the modal yes 
    }
    
    
    // button is an empty variable only when it had been clicked inside our div than i set the button 
    

}












