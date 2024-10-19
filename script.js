import {fetchJobsFromFirebase, saveJobToFirebase, jobTrackerDB, get, getDatabase, ref, set} from './firebase.js'; 


const itemForm = document.querySelector('#item-form');
const jobRoleInput = document.querySelector('#job-role');
const companyNameInput = document.querySelector('#company-name');
const locationInput = document.querySelector('#location');
const employeeCountInput = document.querySelector('#employee-count');
const companyLinkInput = document.querySelector('#company-link');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');


itemForm.addEventListener('submit', onAddItemSubmit);


function displayItems() {
  fetchJobsFromFirebase((jobs) => {
      console.log("Fetched jobs from Firebase:", jobs); // to check in console
      itemList.innerHTML = ''; // Clear the current list
      for (const key in jobs) {
          console.log("Adding item to DOM:", jobs[key]); // to check item in console
          addItemToDOM(jobs[key]);
      }
  });
}


// Add job on form submit
function onAddItemSubmit(e) {
  e.preventDefault();

  const jobRole = jobRoleInput.value.trim();
  const companyName = companyNameInput.value.trim();
  const location = locationInput.value.trim();
  const employeeCount = employeeCountInput.value.trim();
  const companyLink = companyLinkInput.value.trim();

  // Validating the input fields
  if (!jobRole || !companyName || !location || !employeeCount || !companyLink) {
      alert("Please fill in all fields before adding a job.");
      return; 
  }

  const newItem = {
      jobRole,
      companyName,
      location,
      employeeCount,
      companyLink,
      checked: false
  };

  console.log("Saving job to Firebase:", newItem);
  saveJobToFirebase(newItem); 
  addItemToDOM(newItem); 
  clearFormInputs();
}


function addItemToDOM(item) {
  const li = document.createElement('li');

  // Displaying the items if it exists or not
  const jobRole = item.jobRole ? item.jobRole : 'N/A';
  const companyName = item.companyName ? item.companyName : 'N/A';
  const location = item.location ? item.location : 'N/A';
  const employeeCount = item.employeeCount ? item.employeeCount : 'N/A';
  const companyLink = item.companyLink ? item.companyLink : '#';

  // console check
  console.log("Rendering item:", item);

  li.setAttribute('data-id', (jobRole + companyName).trim());

  li.innerHTML = `
      <strong>${jobRole}</strong> ${companyName}<br>
      Location: ${location}<br> 
      Employees: ${employeeCount}<br>
      <a href="${companyLink}" target="_blank">LinkedIn Page</a>
      <input type="checkbox" class="check-box" ${item.checked ? 'checked' : ''} />
      <button class="remove-item btn-link text-red">Remove</button>
  `;

 
  li.querySelector('.check-box').addEventListener('change', toggleCheckedState);
  li.querySelector('.remove-item').addEventListener('click', removeItem);

  itemList.appendChild(li);
}



function clearFormInputs() {
    jobRoleInput.value = '';
    companyNameInput.value = '';
    locationInput.value = '';
    employeeCountInput.value = '';
    companyLinkInput.value = '';
}

// display of jobs
document.addEventListener('DOMContentLoaded', displayItems);


// Function to remove an item
function removeItem(e) {
  const li = e.target.closest('li');
  const jobRole = li.querySelector('strong').textContent;
  const companyName = li.querySelector('strong').nextSibling.textContent.trim();

  // Remove from Firebase
  removeItemFromFirebase(jobRole, companyName);

  // Remove from DOM
  li.remove();

  // Refresh the displayed items
  displayItems();
}



// Function to remove item from Firebase
function removeItemFromFirebase(jobRole, companyName) {
  const key = jobRole + "_" + companyName;
  // Get a reference to the jobTracker node
  const jobRef = ref(getDatabase(), 'jobTracker/' + key); 

  // Use set to remove the item
  set(jobRef, null) 
      .then(() => {
          console.log(`Item ${jobRole} ${companyName} removed from Firebase`);
      })
      .catch(error => {
          console.error('Error removing item from Firebase:', error);
      });
}
// Function to toggle the checked state
function toggleCheckedState(e) {
    const li = e.target.closest('li');
    if (e.target.checked) {
      // Change to green when checked
        li.style.backgroundColor = 'lightgreen'; 
    } else {
      // Change back to white when unchecked
        li.style.backgroundColor = 'white'; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
  displayItems();
});

