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

const profileForm = document.getElementById('profile-form'); 

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
    if (image) document.getElementById('profile-image').value = image;

    // Store initial values for comparison
    profileForm.initialData = {
        name,
        phonenum,
        dob: formatDate(dob),
        postalcode,
        address,
        image,
    };

    loadUserProfile();
});

// Function to load and display user profile
async function loadUserProfile() {
    const email = localStorage.getItem('AccEmail');
    if (!email) {
        console.warn('No email found in localStorage');
        return;
    }

    try {
        const userDocRef = doc(db, "Account", email);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const profileUrl = userData.profileUrl || '../images/homepage pictures/blank-profile-picture-973460_1280.png';
            
            // Update the profile image on the page
            document.getElementById('profile-image').src = profileUrl;
            
            // Optionally update localStorage if needed
            localStorage.setItem('AccPfp', profileUrl);
        } else {
            console.warn('User document does not exist');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

// Handle file selection and preview
document.getElementById('profile-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        window.selectedFile = file; // Store the selected file in a global variable

        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    if (window.selectedFile) {
        try {
            // Upload the profile picture and get the URL
            const profileUrl = await uploadProfilePicture(window.selectedFile);

            // Update localStorage with the new profile picture URL
            localStorage.setItem('AccPfp', profileUrl);
            
            // Update the profile image on the page
            document.getElementById('profile-image').src = profileUrl;

            // Optionally, update Firestore
            const email = localStorage.getItem('AccEmail');
            if (email) {
                const userDocRef = doc(db, "Account", email);
                await setDoc(userDocRef, { profileUrl: profileUrl }, { merge: true });
            }

            // Show success message
            showAlert('success', 'Profile picture updated successfully!');
        } catch (error) {
            showAlert('danger', 'Failed to update profile picture. Please try again later.');
        }
    } else {
        showAlert('info', 'No file selected for upload.');
    }
    await updateProfile();
});


// Function to upload the profile picture
async function uploadProfilePicture(file) {
    const email = localStorage.getItem('AccEmail');
    if (!email) {
        console.error('No email found in localStorage');
        return;
    }

    const fileName = encodeURIComponent(file.name);
    const storageRef = ref(storage, `profiles/${fileName}`);

    try {
        // Upload file
        await uploadBytes(storageRef, file);

        // Get the download URL
        const profileUrl = await getDownloadURL(storageRef);
        console.log('Profile URL:', profileUrl);

        return profileUrl; // Return the URL for further use
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error; // Rethrow error for further handling
    }
}

// Function to update user profile
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

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Show alerts
function showAlert(type, msg) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alert = document.createElement('div');
    alert.className = `alert ${type === 'success' ? 'alert-success' : type === 'info' ? 'alert-info' : 'alert-danger'} alert-dismissible fade show custom-alert`;
    alert.innerHTML = `
        <strong>${msg}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    alertPlaceholder.appendChild(alert);
    setTimeout(() => {
        location.reload();
        alert.remove();
    }, 3000);
}

// Load user profile on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
});
