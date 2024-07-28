document.addEventListener('DOMContentLoaded', () => {
    getAllBookings()
});

async function getAllBookings() {
    try {
        const accountid = await fetch(`/account/${localStorage.AccEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const response = await fetch(`/booking/${await accountid.json().then(result => result.AccID)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            displayBookings(data);
        } else {
            console.log("no response");
            showAlert('danger', 'Login failed. Try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('danger', 'Login failed. Please try again later.');
    }
}

async function getFacilityName(facID) {
    try {
        const response = await fetch(`/facilities/${facID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.FacName; // Assuming facility name is in `data.name`
        } else {
            console.error('Failed to fetch facility details.');
            return 'Unknown Facility';
        }
    } catch (error) {
        console.error('Error fetching facility details:', error);
        return 'Unknown Facility';
    }
}

async function displayBookings(bookingArray) {
    const bookingContainer = document.getElementById('booking-container');

    if (bookingArray.length === 0) {
        bookingContainer.innerHTML = `
            <h2>
            No Booking
            </h2>`;
    } else {
        let bookingHtml = `
            <table class="table" style="width: 97%;">
                <thead>
                    <tr>
                        <th>BookingID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Facility</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>`;
        
        for (let i = 0; i < bookingArray.length; i++) {
            const facilityName = await getFacilityName(bookingArray[i].FacID);
            bookingHtml += `
                <tr>
                    <td>${bookingArray[i].BookID}</td>
                    <td>${formatDate(bookingArray[i].BookDate)}</td>
                    <td>${bookingArray[i].BookStatus}</td>
                    <td>${facilityName}</td>
                    <td><button class="btn btn-danger delete-btn" data-booking-id="${bookingArray[i].BookID}">Delete</button></td> <!-- Added Delete button -->
                </tr>`;
        }

        bookingHtml += `
                </tbody>
            </table>`;
        
        bookingContainer.innerHTML = bookingHtml;

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const bookingID = event.target.getAttribute('data-booking-id');
                try {
                    const response = await fetch(`/booking/${bookingID}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        showAlert('danger', 'Failed to delete booking. Try again.');
                    }
                } catch (error) {
                    console.error('Delete error:', error);
                    showAlert('danger', 'Failed to delete booking. Please try again later.');
                }
            });
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function showAlert(type, message) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.role = 'alert';
    alertElement.innerText = message;
    alertPlaceholder.appendChild(alertElement);

    setTimeout(() => {
        alertElement.remove();
        }, 5000);
}