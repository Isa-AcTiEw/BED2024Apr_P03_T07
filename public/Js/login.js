// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB5bmV1U17GEdr0IzsM7FlRj82tSB3c_W8",
    authDomain: "bedprofilepic-a6848.firebaseapp.com",
    projectId: "bedprofilepic-a6848",
    storageBucket: "bedprofilepic-a6848.appspot.com",
    messagingSenderId: "1004495624019",
    appId: "1:1004495624019:web:9fcdf52d6f137d95c333a6",
    measurementId: "G-0G6HG1V438"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);


document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (token) {
        console.log('Token found:', token);
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
            const response = await fetch(`/accountLogin/${email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    AccEmail: email,
                    AccPassword: password,
                    
                })
            });

            myModal.hide(); // Hide modal

            if (response.ok) {
                const token = await response.json();
                // const token = await data.token;

                console.log('Token received:', token);
                localStorage.setItem('token', token);

                // Fetch data from mssql
                const nameResponse = await fetch(`/accountLogin/${email}`,{
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                });
                if (nameResponse.ok) {
                    const nameData = await nameResponse.json();
                    const { AccID, AccName, AccEmail, AccCtcNo, AccAddr, AccPostalCode, AccDOB } = nameData;

                    localStorage.setItem('AccID',AccID);
                    localStorage.setItem('AccName', AccName);
                    localStorage.setItem('AccEmail', AccEmail);
                    localStorage.setItem('AccCtcNo', AccCtcNo);
                    localStorage.setItem('AccAddr', AccAddr);
                    localStorage.setItem('AccPostalCode', AccPostalCode);
                    localStorage.setItem('AccDOB', AccDOB);

                    // Fetch user profile from Firestore
                    const docRef = doc(db, "Account", email);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const { profileUrl } = docSnap.data();
                        localStorage.setItem('AccPfp', profileUrl);

                        showAlert('success', 'Login successful!');
                        displayUserMenu(AccName, profileUrl);

                        document.getElementById('contentz').remove();
                    }
                }
            } else {
                const errorData = await response.json();
                if (response.status === 404) {
                    showAlert('danger', errorData.message || 'User not registered.');
                } else if (response.status === 401) {
                    showAlert('danger', errorData.message || 'Invalid credentials.');
                } else {
                    showAlert('danger', errorData.message || 'Login failed. Try again.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('danger', 'Login failed. Please try again later.');
        }
    });
});

async function checkUserLogin(token) {
    try {
        
        const response = await fetch('http://localhost:3000/verrifyToken', {
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
        else{
            const payload = await response.json();
            console.log(payload);
            
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token'); // Remove token on error
        localStorage.removeItem('AccName'); // Remove AccName on error
    }
}

function loadUserMenu() {
    const AccName = localStorage.getItem('AccName');
    const AccPfp = localStorage.getItem('AccPfp');
    if (AccName) {
        displayUserMenu(AccName, AccPfp);
        document.getElementById('contentz').remove();
    }
}

function displayUserMenu(AccName, AccPfp) {
    const menuPlaceholder = document.getElementById('menuPlaceholder');
    const userMenu = document.createElement('div');
    userMenu.className = 'btn-group';
    const image = AccPfp ? AccPfp : 'images/homepage pictures/blank-profile-picture-973460_1280.png';

    userMenu.innerHTML = `
        <button type="button" class="btn btn-secondary dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img id="myimg" src="${image}" alt="${AccName}" class="rounded-circle" style="width: 35px; height: 35px;"> ${AccName}
        </button>
        <ul class="dropdown-menu dropdown-menu-lg-end">
            <li><a href="/Profile" class="dropdown-item">Profile</a></li>
            <li><a href="/Bookings" class="dropdown-item">Bookings</a></li>
            <li><a href="../User/BookedEvents.html" class="dropdown-item">Booked Events</a></li>
            <li><button class="dropdown-item" type="button" id="logout-button">Logout</button></li>
        </ul>
    `;
    //<li><button class="dropdown-item" type="button">Bookings</button></li>

    menuPlaceholder.innerHTML = ''; // Clear previous menu content
    menuPlaceholder.appendChild(userMenu);

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); 
            localStorage.removeItem('AccName'); 
            localStorage.removeItem('AccPfp');
            localStorage.removeItem('AccID');

            // Log the token status after clearing
            const clearedToken = localStorage.getItem('token');
            console.log('Token after logout:', clearedToken);

            showAlert('success', 'Logout successful!');
            setTimeout(() => {
                window.location.href = '../index.html'; 
            }, 1000); 
        });
    }
}


function showAlert(type, msg) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    if (!alertPlaceholder) {
        console.error('Alert placeholder element not found.');
        return;
    }

    const alert = document.createElement('div');
    alert.className = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show custom-alert`;
    alert.innerHTML = `
        <strong>${msg}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertPlaceholder.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

