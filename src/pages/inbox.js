import scrollIntoView from 'scroll-into-view-if-needed'
import { updateTaskList, addTaskToTaskList } from './tasks';
import { addMarginBottomToTaskList, addMarginTopToTaskList } from './utils';

function createInbox() {
  let content = document.querySelector('#content');

  let inboxContainer = document.createElement('div');
  inboxContainer.classList.add('inbox-container');

  let inboxHeader = document.createElement('header');
  inboxHeader.classList.add('inbox-header');

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

  updateTaskList('inbox', inboxList, false);
  // let rootElement = document.querySelector(':root');
  // let cs = getComputedStyle(rootElement);
  // console.log(cs);
  // console.log(typeof cs.getPropertyValue('--priority-1-color'));

  // Listen for changes in the localStorage 'taskList' variable
  // window.addEventListener('taskListChange', updateInboxListItems);
  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskList('inbox', inboxList);
    // updateTaskList('inbox', inboxList, true);
  });
  
  addMarginTopToTaskList(inboxHeader, inboxList);
  addMarginBottomToTaskList(inboxList);
}

export default createInbox;