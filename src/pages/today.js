import { updateTaskList, addTaskToTaskListToday } from "./task-list-updater";
import { addMarginBottomToTaskList, addMarginTopToTaskList } from "../utils";

function createToday() {
  let content = document.querySelector('#content');

  let todayContainer = document.createElement('div');
  todayContainer.classList.add('today-container');

  let todayHeader = document.createElement('header');
  todayHeader.classList.add('today-header');
  todayHeader.setAttribute('data-page-name', 'today');

  let todayTitle = document.createElement('h1');
  todayTitle.classList.add('today-title');
  todayTitle.textContent = 'Today';

  let todayMainContent = document.createElement('main');
  todayMainContent.classList.add('today-main-content');

  let todayList = document.createElement('ul');
  todayList.classList.add('today-list');

  todayHeader.appendChild(todayTitle);
  todayMainContent.appendChild(todayList);
  todayContainer.appendChild(todayHeader);
  todayContainer.appendChild(todayMainContent);
    
  content.appendChild(todayContainer);
  updateTaskList('today', todayList, false);
  
  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskListToday(todayList);
    // updateTaskList('today', todayList, true);
  });
  

  addMarginTopToTaskList(todayHeader, todayList);
  // addMarginBottomToTaskList(todayList);
  let footerBar = document.querySelector('.footer-bar');
  todayList.style.marginBottom = `${parseInt(getComputedStyle(footerBar).height) + 30}px`;
}

export default createToday;