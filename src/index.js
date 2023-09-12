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
import './styles/task-item.css';
import './styles/project.css';

import footerEventListenerManager from './pages/footer/footerEventListenerManager';
import footerUtils from './pages/footer/footerUtilities';
import sidebarELM from './pages/sidebar/sidebarEventListenerManager';
import sidebarUtils from './pages/sidebar/sidebarUtilitiesManager';


createFooter(); 
createSidebar();

footerEventListenerManager.initializeElements();
footerEventListenerManager.initializeFlatpickrDateInput();
footerEventListenerManager.activateAddTaskButton();
footerEventListenerManager.handleDialogOutsideClick();
footerEventListenerManager.activateTimeInputClearButton();
footerEventListenerManager.activateDueDateInputTodayButton();
footerEventListenerManager.activateDueDateInputClearButton();
footerEventListenerManager.addEventListenerPriorityDropdown();
footerEventListenerManager.activateDiscardChangesButtons();
footerEventListenerManager.activateDateTimeDialogActionButtons();
footerEventListenerManager.activateDueDateButton();
footerEventListenerManager.addEventListenerTaskTitle();
footerEventListenerManager.activateDateRequiredDialogOkButton();
footerEventListenerManager.addEventListenerSubmitForm();
footerEventListenerManager.activateHamburgerMenu();
footerUtils.populateTaskLocationDropdown();
footerUtils.storeFormElementsAndDefaultValues();

sidebarELM.handleSidebarDialogOutsideClick();
sidebarELM.activateAddProjectDialogActionButtons();
sidebarELM.activateAddProjectButton();
sidebarUtils.updateSidebarProjectsList();
sidebarELM.closeSidebarOnItemClick();
sidebarELM.goToProjectPageOnProjectItemClick();

// console.log(footerUtils.addTaskFormElements);
// console.log(footerUtils.addTaskFormElementDefaultValues);

window.addEventListener('projectAddedToLocalStorage', () => {
  footerUtils.populateTaskLocationDropdown();
  sidebarELM.closeSidebarOnItemClick();
  sidebarELM.goToProjectPageOnProjectItemClick();
  // sidebarELM.activateNewProjectItemClick();
})

// createProjectPage('Home');

// createToday();
// createInbox();
// createUpcoming();

let content = document.querySelector('#content');
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

inboxSidebarItem.addEventListener('click', () => {
  let inboxContainer = document.querySelector('.inbox-container');
  if (inboxContainer === null) {
    removeAllElementsExceptFooterAndSidebar();
    createInbox();
  }
});

todaySidebarItem.addEventListener('click', () => {
  let todayContainer = document.querySelector('.today-container');
  if (todayContainer === null) {
    removeAllElementsExceptFooterAndSidebar();
    createToday();
  }
});

upcomingSidebarItem.addEventListener('click', () => {
  let upcomingContainer = document.querySelector('.upcoming-container');
  if (upcomingContainer === null) {
    removeAllElementsExceptFooterAndSidebar();
    createUpcoming();
  }
})

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





function removeAllElementsExceptFooterAndSidebar() {
  let elementsToBeRemoved = content.children;

  for (let i = elementsToBeRemoved.length - 1; i >= 0; i--) {
    const child = elementsToBeRemoved[i];
    
    // Check if the child element does not have the specified class name
    if (!child.classList.contains('footer-container') &&
        !child.classList.contains('sidebar-dialog') &&
        !child.classList.contains('add-project-dialog')) {
      // Remove the child element from the parent
      content.removeChild(child);
    }
  }
}