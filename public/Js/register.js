// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
    const createAccount = document.getElementById('register-form');
    const myModal = new bootstrap.Modal(document.getElementById('registerModal'));

    createAccount.addEventListener("submit", async (e) => {
        e.preventDefault();

        myModal.hide();

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
            showAlert('danger', 'Passwords do not match. Please check your password.');
            return;
        }

        let profileUrl = '';
        try {
            if (profile) {
                const storageRef = ref(storage, 'profiles/' + profile.name);
                await uploadBytes(storageRef, profile);
                profileUrl = await getDownloadURL(storageRef);
            }

            // Register user in Firebase Auth
            await createUserWithEmailAndPassword(auth, email, pass);

            // Update Firestore with user profile information
            await setDoc(doc(db, "Account", email), {
                email: email,
                profileUrl: profileUrl,
                name: name,
                phonenum: phonenum,
                address: address,
                postalcode: postalcode,
                dob: dob
            });

            // Send data to MSSQL
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
                showAlert('success', 'Registration successful!');
            } else {
                showAlert('danger', 'Registration failed. Account may already exist.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            showAlert('danger', 'Registration failed. Please try again.');
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
