import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getDatabase, ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';
import firebaseConfig from './config.js'; // Import your firebaseConfig from config.js

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Get the database instance

// Reference to the 'jobTracker' node in the database
export const jobTrackerDB = ref(db, 'jobTracker');

// Function to fetch jobs from Firebase
export function fetchJobsFromFirebase(callback) {
    onValue(jobTrackerDB, (snapshot) => {
        const jobs = snapshot.val();
        callback(jobs);
    });
}

// Function to save job to Firebase
export function saveJobToFirebase(job) {
    const newJobRef = ref(db, 'jobTracker/' + job.jobRole + "_" + job.companyName); // Ensure you are creating the reference with the database instance
    set(newJobRef, job)
        .then(() => {
            console.log("Job saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving job: ", error);
        });
}

export { get, getDatabase, ref, set };

