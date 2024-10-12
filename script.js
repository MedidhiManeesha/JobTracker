import {fetchJobsFromFirebase, saveJobToFirebase, jobTrackerDB, get, getDatabase, ref, set} from './firebase.js'; // Ensure correct import path

const itemForm = document.querySelector('#item-form');
const jobRoleInput = document.querySelector('#job-role');
const companyNameInput = document.querySelector('#company-name');
const locationInput = document.querySelector('#location');
const employeeCountInput = document.querySelector('#employee-count');
const companyLinkInput = document.querySelector('#company-link');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');

itemForm.addEventListener('submit', onAddItemSubmit);

// Function to display items from Firebase
function displayItems() {
    fetchJobsFromFirebase((jobs) => {
        itemList.innerHTML = ''; // Clear current list
        for (const key in jobs) {
            addItemToDOM(jobs[key]);
        }
    });
}

// Add job on form submit
function onAddItemSubmit(e) {
    e.preventDefault();

    const jobRole = jobRoleInput.value;
    const companyName = companyNameInput.value;
    const location = locationInput.value;
    const employeeCount = employeeCountInput.value;
    const companyLink = companyLinkInput.value;

    const newItem = {
        jobRole,
        companyName,
        location,
        employeeCount,
        companyLink,
        checked: false
    };

    console.log("Saving job to Firebase:", newItem);
    saveJobToFirebase(newItem); // Save to Firebase
    addItemToDOM(newItem); // Add to DOM
    clearFormInputs();
}

// Add job to DOM
function addItemToDOM(item) {
    const li = document.createElement('li');
    li.setAttribute('data-id', item.jobRole + item.companyName);
    li.innerHTML = `
        <strong>${item.jobRole}</strong> ${item.companyName}<br>
        Location: ${item.location}<br> Employees: ${item.employeeCount}<br>
        <a href="${item.companyLink}" target="_blank">LinkedIn Page</a>
        <input type="checkbox" class="check-box" ${item.checked ? 'checked' : ''} />
        <button class="remove-item btn-link text-red">Remove</button>
    `;

    // Add event listeners to the checkbox and remove button
    li.querySelector('.check-box').addEventListener('change', toggleCheckedState);
    li.querySelector('.remove-item').addEventListener('click', removeItem);

    itemList.appendChild(li);
}

// Clear form inputs
function clearFormInputs() {
    jobRoleInput.value = '';
    companyNameInput.value = '';
    locationInput.value = '';
    employeeCountInput.value = '';
    companyLinkInput.value = '';
}

// Initial display of jobs
document.addEventListener('DOMContentLoaded', displayItems);

// Add event listener for the clear button
// clearBtn.addEventListener('click', clearAllItems);

// // Function to clear all items
// function clearAllItems() {
//     itemList.innerHTML = ''; // Clear items from the DOM
//     clearAllItemsFromFirebase(); // Clear items from Firebase
// }

// // Function to clear all items from Firebase
// function clearAllItemsFromFirebase() {
//     fetchJobsFromFirebase((jobs) => {
//       Object.keys(jobs).forEach((key) => {
//         jobTrackerDB.child(key).remove()
//           .then(() => {
//             console.log('Item removed from Firebase');
//           })
//           .catch(error => {
//             console.error('Error removing item from Firebase:', error);
//           });
//       });
//     });
//   }


// Function to remove an item
function removeItem(e) {
    const li = e.target.closest('li');
    const jobRole = li.querySelector('strong').textContent;
    const companyName = li.querySelector('strong').nextSibling.textContent.trim();
  
    // Remove from DOM
    li.remove();
  
    // Remove from Firebase
    removeItemFromFirebase(jobRole, companyName);
  }


//   // Function to remove an item from Firebase
// function removeItemFromFirebase(jobRole, companyName) {
//     const key = jobRole + "_" + companyName;
//     get(jobTrackerDB).then((snapshot) => {
//       if (snapshot.exists()) {
//         const db = getDatabase(); // Get the Database object
//         const jobRef = db.ref('jobTracker'); // Get a reference to the jobTracker node
//         jobRef.child(key).remove()
//           .then(() => {
//             console.log(`Item ${jobRole} ${companyName} removed from Firebase`);
//           })
//           .catch(error => {
//             console.error('Error removing item from Firebase:', error);
//           });
//       } else {
//         console.log('No data available');
//       }
//     }).catch((error) => {
//       console.error(error);
//     });
//   }
// Function to remove an item from Firebase
function removeItemFromFirebase(jobRole, companyName) {
    const key = jobRole + "_" + companyName;
    get(jobTrackerDB).then((snapshot) => {
      if (snapshot.exists()) {
        const jobRef = ref(getDatabase(), 'jobTracker/' + key); // Get a reference to the jobTracker node
        set(jobRef, null)
          .then(() => {
            console.log(`Item ${jobRole} ${companyName} removed from Firebase`);
          })
          .catch(error => {
            console.error('Error removing item from Firebase:', error);
          });
      } else {
        console.log('No data available');
      }
    }).catch((error) => {
      console.error(error);
    });
  }
// Function to toggle the checked state
function toggleCheckedState(e) {
    const li = e.target.closest('li');
    if (e.target.checked) {
        li.style.backgroundColor = 'lightgreen'; // Change to green when checked
    } else {
        li.style.backgroundColor = 'white'; // Change back to white when unchecked
    }
}
