import createSidebar from './pages/sidebar/sidebarBuilder';
import createFooter from './pages/footer/footerBuilder';
import createInbox from './pages/inbox';
import createUpcoming from './pages/upcoming';
import createToday from './pages/today';
import createProjectPage from './pages/project';

import './styles/global.css';
import './styles/sidebar.css';
import './styles/footer.css'
import './styles/inbox.css'
import './styles/today.css';
import './styles/upcoming.css';
import './styles/project.css';
import './styles/task-item.css';
import '/src/pages/dialogs/editTaskItemDialog.css';
import '/src/pages/dialogs/discardChangesDialog.css';
import '/src/pages/dialogs/addTaskDialog.css';
import '/src/pages/dialogs/dateTimeDialog.css';
import '/src/pages/dialogs/dateRequiredDialog.css';
import '/src/pages/dialogs/addProjectDialog.css';
import '/src/pages/dialogs/1-dialogs.css';

import createAddTaskDialog, { populateTaskLocationDropdown, storeFormElementsAndDefaultValues } from './pages/dialogs/addTaskDialog';
import createDateRequiredDialog from './pages/dialogs/dateRequiredDialog';
import createDateTimeDialog from './pages/dialogs/dateTimeDialog';
import createDiscardChangesDialog from './pages/dialogs/discardChangesDialog';
import createAddProjectDialog from './pages/dialogs/addProjectDialog';

import footerEventListenerManager from './pages/footer/footerEventListenerManager';
import sidebarELM from './pages/sidebar/sidebarEventListenerManager.js';
import sidebarUtils from './pages/sidebar/sidebarUtilitiesManager';
import { addEditFunctionToAllTaskItems, getTaskListFromLocalStorage, setTaskListInLocalStorage } from './pages/tasks';
import * as utils from '/src/utils';
import sharedElements from './pages/dialogs/sharedElements';
import createEditTaskItemDialog from '/src/pages/dialogs/editTaskItemDialog';


let content = document.querySelector('#content');

createFooter();
createSidebar();
createDateTimeDialog();
createAddTaskDialog();
createDateRequiredDialog();
createDiscardChangesDialog();
createAddProjectDialog();
sharedElements.initializeElements();

storeFormElementsAndDefaultValues();

// createToday();
createUpcoming();
// addEditFunctionToAllTaskItems();
// createInbox();
content.appendChild(createEditTaskItemDialog());
// console.log('TASK LIST');
// console.log(getTaskListFromLocalStorage());
// localStorage.setItem('taskListPremade', JSON.stringify(getTaskListFromLocalStorage()));
// let editTaskDialog = document.querySelector('.edit-task-dialog');
// editTaskDialog.showModal();
// setTaskListInLocalStorage();

let inboxSidebarItem = document.querySelector('.sidebar-item.inbox');
let todaySidebarItem = document.querySelector('.sidebar-item.today');
let upcomingSidebarItem = document.querySelector('.sidebar-item.upcoming');
let sidebarDialog = document.querySelector('.sidebar-dialog');
// sidebarDialog.showModal();
let addProjectDialog = document.querySelector('.add-project-dialog');
// addProjectDialog.showModal();
let todayContainer = document.querySelector('.today-container');
let upcomingContainer = document.querySelector('.upcoming-container');
let projectsList = JSON.parse(localStorage.getItem('projectsList'));
let projectsListItems = document.querySelectorAll('.projects-list-item');

const pageChanged = new Event('pageChanged');

inboxSidebarItem.addEventListener('click', () => {
  let inboxContainer = document.querySelector('.inbox-container');
  if (inboxContainer === null) {
    utils.removeAllElementsExceptFooterSidebarDialogs();
    createInbox();
    window.dispatchEvent(pageChanged);
  }
});

todaySidebarItem.addEventListener('click', () => {
  let todayContainer = document.querySelector('.today-container');
  if (todayContainer === null) {
    utils.removeAllElementsExceptFooterSidebarDialogs();
    createToday();
    window.dispatchEvent(pageChanged);
  }
});

upcomingSidebarItem.addEventListener('click', () => {
  let upcomingContainer = document.querySelector('.upcoming-container');
  if (upcomingContainer === null) {
    utils.removeAllElementsExceptFooterSidebarDialogs();
    createUpcoming();
    window.dispatchEvent(pageChanged);
  }
})

addEditFunctionToAllTaskItems();
window.addEventListener('pageChanged', () => {
  addEditFunctionToAllTaskItems();
});

  // for (let i = 0; i < 10; i++) {
  //   Array.from(projectsListItems).forEach(projectItem => {
  //     projectItem.addEventListener('click', () => {
  //       removeAllElementsExceptFooterAndSidebar();
  //       createProjectPage(projectItem.dataset.projectName);
  //       sidebarDialog.close();
  //     })
  //   })
  // }

// window.addEventListener('addProjectToLocalStorage', () => {
//   console.log('project added!');
//   console.log(projectsListItems.length)
//   Array.from(projectsListItems).forEach(projectItem => {
//     console.log(projectItem)
//     projectItem.addEventListener('click', () => {
//       removeAllElementsExceptFooterAndSidebar();
//       createProjectPage(projectItem.dataset.projectName);
//       sidebarDialog.close();
//     })
//   })
// });