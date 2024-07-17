document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const myModal = new bootstrap.Modal(document.getElementById('loginModal'));

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const name = document.getElementById("")

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
            showAlert('success', 'Login successful!');
            displayUserMenu();
        } else {
            showAlert('danger', 'Login failed. Try again.');
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
    menuPlaceholder.appendChild(userMenu);

    document.getElementById('logout-button').addEventListener('click', () => {
        sessionStorage.removeItem('login');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('token');
        location.reload(); // Refresh the page to update the UI
    });
}
