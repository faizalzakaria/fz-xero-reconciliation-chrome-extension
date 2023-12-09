// Sample list of actions
const actions = [
    'Reconcile Billplz Transaction',
    'Reconcile Billplz Transfer',
    'Mark as Billplz Fee'
];

// Function to perform an action when an item is clicked
function performAction(action) {
  // Replace this with your actual logic for each action
  switch (action) {
    case 'Reconcile Billplz Transaction':
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.runtime.sendMessage({ action: 'reconcile_transaction', tabId: tabs[0].id });
      })
      break;
    case 'Reconcile Billplz Transfer':
       chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.runtime.sendMessage({ action: 'reconcile_transfer', tabId: tabs[0].id });
      })
      break;
    case 'Mark as Billplz Fee':
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.runtime.sendMessage({ action: 'mark_as_billplz_fee', tabId: tabs[0].id });
      })
      break;
    default:
      break;
  }
}

// Function to populate the action list
function populateActionList() {
  const actionList = document.getElementById('action-list');

  actions.forEach(action => {
    const listItem = document.createElement('li');
    listItem.textContent = action;

    // Add a click event listener to each list item
    listItem.addEventListener('click', () => {
      performAction(action);
    });

    actionList.appendChild(listItem);
  });
}

// Call the populateActionList function when the popup is loaded
window.addEventListener('DOMContentLoaded', () => {
  populateActionList();
});
