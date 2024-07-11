// This is where we verify eventMgr credentails

// once verrified once the button is clicked it should navigate to the evemtMgr page and fetch from our endpoint

const logIn = document.getElementById('eventMgrLogin')
const eventMgrEmail = document.getElementById('eventMgrPassword')
const eventMgrId = 'EVT001'
logIn.addEventListener('click',validatInput)

function validatInput(){
    // we send a get request to our database to retrive the information of the coresponding acount (i want the eventMgrID)
    // we store the eventMgrID in localStorage so that we can use in eventMgr.html
    localStorage.setItem('id', eventMgrId)
    window.location = '../EventMgr/eventMgrPanel.html'

}

// log in causing the issue 