document.addEventListener('DOMContentLoaded', async () => {
    const createAccount = document.getElementById('register-form');

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

        const myModal = new bootstrap.Modal(document.getElementById('registerModal'));
        myModal.hide();

        // Show success message
        alert('Registration successful!');

    });
});
