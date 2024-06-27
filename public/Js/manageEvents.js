
const eventMgrID = localStorage.getItem('id');
window.addEventListener('load',handleEvents(eventMgrID));

// retrive the eventMgr from local storage and then fetch() api request to get the events associated with event manager
async function handleEvents(eventMgrID){
    const url = `http://localhost:3000/EventMgr/${eventMgrID}`;
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
    try {
        return events; // Return 'events' if no error occurs
    } catch (error) {
        console.error(error);
    }
}

function displayEvents(listEvent){
    // parent div
    const table = document.getElementsByClassName('table');

    const tableBody = document.getElementById('tableBody');
    // testdata works need to overwrite all table rows 
    createrows(listEvent,tableBody);
}

function createrows(listEvent,tableBody){
    // Initialize rowContent as an empty string
    let rowContent = '';
    listEvent.forEach(element => {
    // Step 1:Cast datestring to date object
    const date = new Date(element.EventRegEndDate);

    // Step 2: return the date in human readable form
    const formattedDate = date.toDateString();
        // append each row to rowcontent, initialize it as an empty string so it stores the prev added rows
        rowContent += 
        `
        <tr>
            <td>${element.EventID}</td>
            <td>${element.EventName}</td>
            <td>${element.EventDesc}</td>
            <td>${element.EventLocation}</td>
            <td>${formattedDate}</td>
            <td>${element.EventIntake}</td>
            <td>Update</td>
        </tr>
        `
        tableBody.innerHTML = rowContent
    });
}

// need to fix when reloaded page the thing don't work anymore 