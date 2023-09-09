import { updateTaskListWithDateHeaders, addTaskToTaskList } from "./tasks";
import { addMarginBottomToTaskList, addMarginTopToTaskList } from "./utils";

function createUpcoming() {
  let content = document.querySelector('#content');

  let upcomingContainer = document.createElement('div');
  upcomingContainer.classList.add('upcoming-container');

  let upcomingHeader = document.createElement('header');
  upcomingHeader.classList.add('upcoming-header');

  let upcomingTitle = document.createElement('h1');
  upcomingTitle.classList.add('upcoming-title');
  upcomingTitle.textContent = 'Upcoming';

  let upcomingMainContent = document.createElement('main');
  upcomingMainContent.classList.add('upcoming-main-content');

  let upcomingList = document.createElement('ul');
  upcomingList.classList.add('upcoming-list');

  upcomingHeader.appendChild(upcomingTitle);
  upcomingMainContent.appendChild(upcomingList);
  upcomingContainer.appendChild(upcomingHeader);
  upcomingContainer.appendChild(upcomingMainContent);
    
  content.appendChild(upcomingContainer);
  updateTaskListWithDateHeaders('upcoming', upcomingList);
    
  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskList('upcoming', upcomingList);
  });

  addMarginTopToTaskList(upcomingHeader, upcomingList);
  addMarginBottomToTaskList(upcomingList);
}

export default createUpcoming;