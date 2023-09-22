import { setDropdownLocationToCurrentPage } from '../../utils';
import { clearAddTaskForm, storeFormElementsAndDefaultValues } from '../dialogs/addTaskDialog';
import { setLastSavedDate, setLastSavedTime } from '../dialogs/dateTimeDialog';
import sharedElements from '../dialogs/sharedElements';
import * as addTaskDialogUtils from '/src/pages/dialogs/addTaskDialog';

const footerEventListenerManager = {
  
  activateAddTaskButton() {
    let footerAddTaskButton = document.querySelector('.footer-add-task-button');

    footerAddTaskButton.addEventListener('click', () => {
      let addTaskDialog = sharedElements.addTaskDialog;
      let dateAndPriorityButtons = addTaskDialog.querySelector('.date-and-priority-buttons');
      let dueDateButton = document.querySelector('.task-due-date-button-container');
      let priorityDropdown = document.querySelector('.priority-dropdown');
      clearAddTaskForm();
      if (dateAndPriorityButtons.querySelector('.task-due-date-button-container') === null) {
        dateAndPriorityButtons.insertBefore(dueDateButton, priorityDropdown);
      }
      setDropdownLocationToCurrentPage();
      storeFormElementsAndDefaultValues();
      addTaskDialog.showModal();
    })
  },
  
  activateHamburgerMenu() {
    let hamburgerMenu = document.querySelector('.hamburger-menu');
    
    hamburgerMenu.addEventListener('click', () => {
      let sidebarDiv = document.querySelector('.sidebar-div');
      let sidebarDialog = sharedElements.sidebarDialog;
      let footerBar = document.querySelector('.footer-bar');
      let addTaskDialog = sharedElements.addTaskDialog;
      let pageContainer = document.querySelector('.page-container');
      let pageHeader = document.querySelector('.page header');

      console.log(getComputedStyle(sidebarDialog).display === 'none');
      if (sidebarDialog !== null) {
        if (window.innerWidth < 768) {
          sidebarDialog.showModal();
        } else {
          sidebarDiv.classList.toggle('open');
          footerBar.classList.toggle('shifted');
          pageContainer.classList.toggle('shifted');
          addTaskDialog.classList.toggle('shifted');
          // pageHeader.classList.toggle('shifted');
        }
      }
    })
  },

};

export default footerEventListenerManager;