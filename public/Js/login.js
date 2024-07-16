document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const myModal = new bootstrap.Modal(document.getElementById('loginModal'));

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

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
        } else {
            showAlert('danger', 'Login failed. Try again.');
        }
    })
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
