import { clearAddTaskForm } from '../dialogs/addTaskDialog';
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
      addTaskDialog.showModal();
    })
  },
  
  activateHamburgerMenu() {
    let hamburgerMenu = document.querySelector('.hamburger-menu');
    
    hamburgerMenu.addEventListener('click', () => {
      // let sidebarDialog = document.querySelector('.sidebar-dialog');
      let sidebarDialog = sharedElements.sidebarDialog;
      if (sidebarDialog !== null) {
        sidebarDialog.showModal();
      }
    })
  },

};

export default footerEventListenerManager;