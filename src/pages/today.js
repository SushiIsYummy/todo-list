import { updateTaskList, addTaskToTaskListToday } from "./tasks";
import { addMarginBottomToTaskList, addMarginTopToTaskList } from "../utils";

function createToday() {
  let content = document.querySelector('#content');

  let todayContainer = document.createElement('div');
  todayContainer.classList.add('today-container');

  let todayHeader = document.createElement('header');
  todayHeader.classList.add('today-header');

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
  window.addEventListener('taskItemUpdated', () => {
    console.log('HELLO!');
    updateTaskList('today', todayList, false);
  })
  

  addMarginTopToTaskList(todayHeader, todayList);
  addMarginBottomToTaskList(todayList);
}

export default createToday;