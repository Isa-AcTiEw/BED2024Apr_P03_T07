

//  do not tie to loginBtn


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
            <td>${element.EventID}</td>
            <td>${element.EventName}</td>
            <td>${element.EventDesc}</td>
            <td>${element.EventPrice}</td>
            <td>${formattedeventDate}
            <td>${element.EventCat}</td>
            <td>${element.EventLocation}</td>
            <td>${formattedregEndDate}</td>
            <td>${element.EventIntake}</td>
            <td>Update</td>
        </tr>
        `;
    });
    tableBody.innerHTML = rowContent;
}
document.addEventListener('DOMContentLoaded', handleEvents);

// need to fix when reloaded page the thing don't work anymore 