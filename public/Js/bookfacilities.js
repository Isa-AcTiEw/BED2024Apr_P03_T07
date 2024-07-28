document.addEventListener('DOMContentLoaded', () => {
    const bookFacility = document.getElementById('bookfac-form');
    const myModal = new bootstrap.Modal(document.getElementById('bookfacModal'));

    fetchFacilities();

    bookFacility.addEventListener("submit", async (e) => {
        e.preventDefault();

        myModal.hide();

        // Retrieve form data
        const facility = document.getElementById("editFacCat").value;
        const bookdate = document.getElementById("facbookdate").value;

        // Retrieve booking id
        const response = await fetch("/bookingId", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let bookid = await response.json();
        const id = parseInt(bookid.value.slice(1,4)) + 1;
        let idtype = "B";
        if (id.toString().length < 3) {
            idtype += "0".repeat(3 - id.toString().length)
        }
        bookid = idtype + id

        try {
            // Send data to MSSQL
            const response = await fetch("/booking", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "BookID": bookid,
                    // "BookDate": "01/07/2024",
                    "FacID": facility,
                    "AccID": localStorage.AccID
                })
            });

            if (response.ok) {
                showAlert('success', 'Booking successful!');
            } else {
                showAlert('danger', 'Booking failed.');
            }
        } catch (error) {
            console.error('Error booking:', error);
            showAlert('danger', 'Booking failed. Please try again.');
        }
    });

    async function fetchFacilities() {
        try {
            const response = await fetch("/Facilities");
            if (!response.ok) {
                throw new Error('Failed to fetch facilities');
            }

            const data = await response.json();
            const facList = document.getElementById("editFacCat");

            facList.innerHTML = ''; //<option hidden>Choose</option>

            data.forEach((fac, index) => {
                const facItem = document.createElement("option");

                facItem.id = fac.FacID
                facItem.value = fac.FacID
                facItem.innerHTML = `${fac.FacName}`;
                facList.appendChild(facItem);
            })
        } catch (error) {
            console.error(error);
            alert('Failed to load facilities. Please try again later.');
        }
    }
});

function showAlert(type, msg) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alert = document.createElement('div');
    alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show custom-alert`;
    alert.innerHTML = `
        <strong>${msg}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    alertPlaceholder.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}