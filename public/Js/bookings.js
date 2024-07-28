document.addEventListener('DOMContentLoaded', () => {
    getAllBookings();
});

async function getAllBookings() {
    try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debugging

        const accountidResponse = await fetch(`/account/${localStorage.AccEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!accountidResponse.ok) {
            console.error('Failed to fetch account ID:', accountidResponse.status);
            showAlert('danger', 'Failed to fetch account ID. Try again.');
            return;
        }

        const accountid = await accountidResponse.json().then(result => result.AccID);

        const bookingsResponse = await fetch(`/booking/${accountid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!bookingsResponse.ok) {
            console.error('Failed to fetch bookings:', bookingsResponse.status);
            showAlert('danger', 'Login failed. Try again.');
            return;
        }

        const bookings = await bookingsResponse.json();
        displayBookings(bookings, token);
    } catch (error) {
        console.error('Login error:', error);
        showAlert('danger', 'Login failed. Please try again later.');
    }
}

async function getFacilityName(facID, token) {
    try {
        console.log(`Fetching facility name for facID: ${facID} with token: ${token}`); // Debugging

        const response = await fetch(`/facilities/${facID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch facility details. Status: ${response.status}`);
            return 'Unknown Facility';
        }

        const data = await response.json();
        return data.facilityName; 
    } catch (error) {
        console.error('Error fetching facility details:', error);
        return 'Unknown Facility';
    }
}

async function displayBookings(bookingArray, token) {
    const bookingContainer = document.getElementById('booking-container');

    if (bookingArray.length === 0) {
        bookingContainer.innerHTML = `<h2>No Booking</h2>`;
        return;
    }

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
        const facilityName = await getFacilityName(bookingArray[i].FacID, token);
        bookingHtml += `
            <tr>
                <td>${bookingArray[i].BookID}</td>
                <td>${formatDate(bookingArray[i].BookDate)}</td>
                <td>${bookingArray[i].BookStatus}</td>
                <td>${facilityName}</td>
                <td><button class="btn btn-danger delete-btn" data-booking-id="${bookingArray[i].BookID}">Delete</button></td>
            </tr>`;
    }

    bookingHtml += `
            </tbody>
        </table>`;

    bookingContainer.innerHTML = bookingHtml;

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const bookingID = event.target.getAttribute('data-booking-id');
            try {
                const response = await fetch(`/booking/${bookingID}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
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
