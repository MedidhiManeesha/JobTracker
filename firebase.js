import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js';
import { getDatabase, ref, set, onValue, get } from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js';
import firebaseConfig from './config.js'; 

// Initializing Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); 

// Reference to the Job tracker node in the database
export const jobTrackerDB = ref(db, 'jobTracker');



export function fetchJobsFromFirebase(callback) {
    onValue(jobTrackerDB, (snapshot) => {
        const jobs = snapshot.val();
        if (jobs) {
            callback(jobs);
        } else {
            console.log("No jobs found in Firebase.");
            callback({}); // Passing an empty object if no jobs are found
        }
    });
}

// Function to save job to Firebase
export function saveJobToFirebase(job) {
    const newJobRef = ref(db, 'jobTracker/' + job.jobRole + "_" + job.companyName); // to ensure whether i am creating the reference with the database instance
    set(newJobRef, job)
        .then(() => {
            console.log("Job saved successfully!");
        })
        .catch((error) => {
            console.error("Error saving job: ", error);
        });
}

export { get, getDatabase, ref, set };
