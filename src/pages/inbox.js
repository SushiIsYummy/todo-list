import scrollIntoView from 'scroll-into-view-if-needed'
import { updateTaskList, addTaskToTaskList } from './task-list-updater';
import { addMarginBottomToTaskList, addMarginTopToTaskList } from '../utils';

function createInbox() {
  let content = document.querySelector('#content');

  let inboxContainer = document.createElement('div');
  inboxContainer.classList.add('inbox-container');

  let inboxHeader = document.createElement('header');
  inboxHeader.classList.add('inbox-header');
  inboxHeader.setAttribute('data-task-location', 'Inbox');

  let inboxTitle = document.createElement('h1');
  inboxTitle.classList.add('inbox-title');
  inboxTitle.textContent = 'Inbox';

  let inboxMainContent = document.createElement('main');
  inboxMainContent.classList.add('inbox-main-content');

  let inboxList = document.createElement('ul');
  inboxList.classList.add('inbox-list');

  inboxHeader.appendChild(inboxTitle);
  inboxMainContent.appendChild(inboxList);
  inboxContainer.appendChild(inboxHeader);
  inboxContainer.appendChild(inboxMainContent);

  content.appendChild(inboxContainer);

  updateTaskList('Inbox', inboxList);
  
  // Listen for changes in the localStorage 'taskList' variable
  // window.addEventListener('taskListChange', updateInboxListItems);
  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskList('Inbox', inboxList);
    // updateTaskList('inbox', inboxList, true);
  });
  
  addMarginTopToTaskList(inboxHeader, inboxList);
  addMarginBottomToTaskList(inboxList);
}

export default createInbox;