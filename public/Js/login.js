document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (token) {
        await checkUserLogin(token); 
        loadUserMenu(); 
    }

    const loginForm = document.getElementById('login-form');
    const myModal = new bootstrap.Modal(document.getElementById('loginModal'));

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch("/accountLogin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    AccEmail: email,
                    AccPassword: password
                })
            });

            myModal.hide();
            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                localStorage.setItem('token', token);
                console.log('Token stored:', token);

                const nameResponse = await fetch(`/account/${email}`);
                const nameData = await nameResponse.json();
                const AccName = nameData.AccName;

                localStorage.setItem('AccName', AccName); // Store AccName in localStorage
                displayUserMenu(AccName);
                showAlert('success', 'Login successful!');
                document.getElementById('contentz').remove(); // Example action after login

            } else {
                showAlert('danger', 'Login failed. Try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('danger', 'Login failed. Please try again later.');
        }
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('AccName'); 
        location.reload();
    });
});

async function checkUserLogin(token) {
    try {
        const response = await fetch('/verifyToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            console.log('Token verification failed');
            localStorage.removeItem('token'); // Remove invalid token
            localStorage.removeItem('AccName'); // Remove AccName on token invalidation
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token'); // Remove token on error
        localStorage.removeItem('AccName'); // Remove AccName on error
    }
}

function loadUserMenu() {
    const AccName = localStorage.getItem('AccName');
    if (AccName) {
        displayUserMenu(AccName);
        document.getElementById('contentz').remove();
    }
}

function displayUserMenu(AccName) {
    const menuPlaceholder = document.getElementById('menuPlaceholder');
    const userMenu = document.createElement('div');
    userMenu.className = 'btn-group';
    userMenu.innerHTML = `
        <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="bi bi-person-circle"></i> ${AccName}
        </button>
        <ul class="dropdown-menu dropdown-menu-lg-end">
            <li><button class="dropdown-item" type="button">Profile</button></li>
            <li><button class="dropdown-item" type="button">Bookings</button></li>
            <li><button class="dropdown-item" type="button" id="logout-button">Logout</button></li>
        </ul>
    `;
    menuPlaceholder.innerHTML = ''; // Clear previous menu content
    menuPlaceholder.appendChild(userMenu);
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
