// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

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
    const createAccount = document.getElementById('register-form');
    const myModal = new bootstrap.Modal(document.getElementById('registerModal'));

    createAccount.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Retrieve form data
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phonenum = document.getElementById("phonenum").value;
        const profile = document.getElementById("profile").files[0]; 
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

        let profileUrl = '';
        if (profile) {
            const storageRef = ref(storage, 'profiles/' + profile.name);
            await uploadBytes(storageRef, profile);
            profileUrl = await getDownloadURL(storageRef);
        }

        // Send data to mssql
        const response = await fetch("/accountLogin", {
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
            const auth = getAuth();
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    await setDoc(doc(db, "users", email), {
                        email: email,
                        profileUrl: profileUrl
                    });

                    myModal.hide();
                    showAlert('success', 'Registration successful!');
                } else {
                    showAlert('danger', 'User is not authenticated.');
                }
            });
        } else {
            myModal.hide();
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
