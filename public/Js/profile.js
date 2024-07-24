document.addEventListener('DOMContentLoaded', () => {
    // Load and display user information from localStorage
    const name = localStorage.getItem('AccName');
    const phonenum = localStorage.getItem('AccCtcNo');
    const dob = localStorage.getItem('AccDOB');
    const postalcode = localStorage.getItem('AccPostalCode');
    const address = localStorage.getItem('AccAddr');

    if (name) document.getElementById('name').value = name;
    if (phonenum) document.getElementById('phonenum').value = phonenum;
    if (dob) document.getElementById('dob').value = formatDate(dob);
    if (postalcode) document.getElementById('postalcode').value = postalcode;
    if (address) document.getElementById('address').value = address;

});

const profileForm = document.getElementById('profile-form');

profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    updateProfile();
    setTimeout(() => {
        location.reload(); 
    }, 1500); 
});

async function updateProfile() {
    // Gather updated data from the form
    const name = document.getElementById('name').value;
    const phonenum = document.getElementById('phonenum').value;
    const dob = document.getElementById('dob').value;
    const postalcode = document.getElementById('postalcode').value;
    const address = document.getElementById('address').value;

    try {
        const response = await fetch(`/accountLogin/${localStorage.getItem('AccEmail')}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                AccName: name, 
                AccCtcNo: phonenum, 
                AccDOB: dob, 
                AccPostalCode: postalcode,
                AccAddr: address
            })
        });

        if (response.ok) {
            // Update localStorage with new values
            localStorage.setItem('AccName', name);
            localStorage.setItem('AccCtcNo', phonenum);
            localStorage.setItem('AccDOB', dob);
            localStorage.setItem('AccPostalCode', postalcode);
            localStorage.setItem('AccAddr', address);

            // Update the DOM with new values
            document.getElementById('name').value = name;
            document.getElementById('phonenum').value = phonenum;
            document.getElementById('dob').value = formatDate(dob);
            document.getElementById('postalcode').value = postalcode;
            document.getElementById('address').value = address;

            // Show success message
            showAlert('success', 'Profile updated successfully!');
            console.log('Profile updated successfully.');
        } else {
            throw new Error('Profile update failed.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('danger', 'Failed to update profile. Please try again later.');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

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
