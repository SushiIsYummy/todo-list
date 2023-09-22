// import { updateTaskListWithDateHeaders, addTaskToTaskListUpcoming, updateTaskList } from "./tasks";
import { addMarginBottomToTaskList, addMarginTopToTaskList } from "../utils";
import { updateTaskListWithDateHeaders } from "./task-list-updater";
import { addTaskToTaskListUpcoming } from "./task-list-updater";

function createUpcoming() {
  let content = document.querySelector('#content');

  let pageContainer = document.querySelector('.page-container');

  let upcomingContainer = document.createElement('div');
  upcomingContainer.classList.add('upcoming-container');
  upcomingContainer.classList.add('page');

  let upcomingHeader = document.createElement('header');
  upcomingHeader.classList.add('upcoming-header');
  upcomingHeader.setAttribute('data-page-name', 'upcoming');

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
    
  // content.appendChild(upcomingContainer);
  pageContainer.appendChild(upcomingContainer);

  updateTaskListWithDateHeaders('upcoming', upcomingList);
  // updateTaskListWithDateHeaders('upcoming', upcomingList);
  
  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskListUpcoming(upcomingList);
    // updateTaskListWithDateHeaders('upcoming', upcomingList);
  });

  // addMarginTopToTaskList(upcomingHeader, upcomingList);
  // addMarginBottomToTaskList(upcomingList);
  let footerBar = document.querySelector('.footer-bar');
  upcomingList.style.marginBottom = `${parseInt(getComputedStyle(footerBar).height) + 30}px`;
}

export default createUpcoming;