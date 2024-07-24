// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
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

document.addEventListener('DOMContentLoaded', () => {
    // Load and display user information from localStorage
    const name = localStorage.getItem('AccName');
    const phonenum = localStorage.getItem('AccCtcNo');
    const dob = localStorage.getItem('AccDOB');
    const postalcode = localStorage.getItem('AccPostalCode');
    const address = localStorage.getItem('AccAddr');
    const image = localStorage.getItem('AccPfp');

    if (name) document.getElementById('name').value = name;
    if (phonenum) document.getElementById('phonenum').value = phonenum;
    if (dob) document.getElementById('dob').value = formatDate(dob);
    if (postalcode) document.getElementById('postalcode').value = postalcode;
    if (address) document.getElementById('address').value = address;
    if (image) document.getElementById('image').value = image;

    // Store initial values for comparison
    profileForm.initialData = {
        name,
        phonenum,
        dob: formatDate(dob),
        postalcode,
        address,
        image,
    };
});

const profileForm = document.getElementById('profile-form');

profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    await updateProfile();
    await updateProfilePicture();
    setTimeout(() => {
        location.reload(); 
    }, 2000); 
});

async function updateProfile() {
    // Gather updated data from the form
    const name = document.getElementById('name').value;
    const phonenum = document.getElementById('phonenum').value;
    const dob = document.getElementById('dob').value;
    const postalcode = document.getElementById('postalcode').value;
    const address = document.getElementById('address').value;

    // Compare current values with initial values
    if (name === profileForm.initialData.name &&
        phonenum === profileForm.initialData.phonenum &&
        dob === profileForm.initialData.dob &&
        postalcode === profileForm.initialData.postalcode &&
        address === profileForm.initialData.address) {
        showAlert('info', 'No changes made.');
        return;
    }

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

const userDocRef = doc(db, "Account", localStorage.getItem('AccEmail'));
await setDoc(userDocRef, {
    email: email,
    profileUrl: profileUrl
}, { merge: true });

async function updateProfilePicture() {
    const fileInput = document.querySelector('input[name="profile"]');
    const file = fileInput.files[0];

    if (!file) {
        showAlert('info', 'No file selected.');
        return;
    }

    const formData = new FormData();
    formData.append('profile', file);

    try {
        const response = await fetch(`/accountLogin/${localStorage.getItem('AccEmail')}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            const imageUrl = data.url;

            // Update localStorage with new profile picture URL
            localStorage.setItem('AccPfp', imageUrl);

            // Update the profile image on the page
            document.getElementById('profile-image').src = imageUrl;

            showAlert('success', 'Profile picture updated successfully!');
        } else {
            throw new Error('Failed to upload profile picture.');
        }
    } catch (error) {
        console.error('Error updating profile picture:', error);
        showAlert('danger', 'Failed to update profile picture. Please try again later.');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function showAlert(type, msg) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alert = document.createElement('div');
    alert.className = `alert ${type === 'success' ? 'alert-success' : type === 'info' ? 'alert-info' : 'alert-danger'} alert-dismissible fade show custom-alert`;
    alert.innerHTML = `
        <strong>${msg}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    alertPlaceholder.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 2000);
}
