document.addEventListener('DOMContentLoaded', async () => {
    const createAccount = document.getElementById('register-form');
    const myModal = new bootstrap.Modal(document.getElementById('registerModal'));

    createAccount.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Retrieve form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phonenum = document.getElementById("phonenum").value;
        //const profile = document.getElementById("profile").files[0]; 
        const address = document.getElementById("address").value;
        const postalcode = document.getElementById("postalcode").value;
        const dob = document.getElementById("dob").value;
        const pass = document.getElementById("pass").value;
        const cfmpass = document.getElementById("cfmpass").value;

        // Check if password matches confirm password
        if (pass !== cfmpass) {
            alert('Passwords do not match. Check your password');
            console.log('Passwords do not match');
            return;
        }

        // Send data to server
        const response = await fetch("/accountReg", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                AccName: name,
                AccEmail: email,
                AccCtcNo: phonenum,
                AccAddr: address,
                AccPostalCode: postalcode,
                AccDOB: dob,
                AccPassword: pass
            })
        });

        if (response.ok) {
            myModal.hide();

            showAlert('success', 'Registration successful!');
        } else {
            showAlert('danger', 'Registration failed. Account exist.');
        }
    });
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
