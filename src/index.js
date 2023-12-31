import createSidebar from './pages/sidebar/sidebarBuilder';
import createFooter from './pages/footer/footerBuilder';
import createInbox from './pages/inbox';
import createUpcoming from './pages/upcoming';
import createToday from './pages/today';

import './styles/global.css';
import '/src/pages/sidebar/sidebar.css';
import '/src/pages/footer/footer.css'
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
import '/src/pages/dialogs/editProjectNameDialog.css';
import '/src/pages/dialogs/deleteProjectDialog.css';
import '/src/pages/dialogs/1-dialogs.css';

import createAddTaskDialog, { storeFormElementsAndDefaultValues } from './pages/dialogs/addTaskDialog';
import createDateRequiredDialog from './pages/dialogs/dateRequiredDialog';
import createDateTimeDialog from './pages/dialogs/dateTimeDialog';
import createDiscardChangesDialog from './pages/dialogs/discardChangesDialog';
import createAddProjectDialog from './pages/dialogs/addProjectDialog';
import createEditProjectNameDialog from './pages/dialogs/editProjectNameDialog';

import { addEditFunctionToAllTaskItems } from './pages/tasks';
import * as utils from '/src/utils';
import sharedElements from './pages/dialogs/sharedElements';
import createEditTaskItemDialog from '/src/pages/dialogs/editTaskItemDialog';
import createDeleteProjectDialog from './pages/dialogs/deleteProjectDialog';


let content = document.querySelector('#content');
let pageContainer = document.createElement('div');
pageContainer.classList.add('page-container');

content.appendChild(pageContainer);
createFooter();
createSidebar();
createDateTimeDialog();
createAddTaskDialog();
createDateRequiredDialog();
createDiscardChangesDialog();
createAddProjectDialog();
createEditProjectNameDialog();
createDeleteProjectDialog();
sharedElements.initializeElements();

storeFormElementsAndDefaultValues();

createToday();
content.appendChild(createEditTaskItemDialog());

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
    utils.removeCurrentPage();
    createInbox();
    window.dispatchEvent(pageChanged);
  }
});

todaySidebarItem.addEventListener('click', () => {
  let todayContainer = document.querySelector('.today-container');
  if (todayContainer === null) {
    utils.removeAllElementsExceptFooterSidebarDialogs();
    utils.removeCurrentPage();
    createToday();
    window.dispatchEvent(pageChanged);
  }
});

upcomingSidebarItem.addEventListener('click', () => {
  let upcomingContainer = document.querySelector('.upcoming-container');
  if (upcomingContainer === null) {
    utils.removeAllElementsExceptFooterSidebarDialogs();
    utils.removeCurrentPage();
    createUpcoming();
    window.dispatchEvent(pageChanged);
  }
})

addEditFunctionToAllTaskItems();
window.addEventListener('pageChanged', () => {
  addEditFunctionToAllTaskItems();
});