import sharedDialogElements from '../dialogs/sharedDialogElements';
import footerUtils from './footerUtilities';

const footerEventListenerManager = {
  
  activateAddTaskButton() {
    let footerAddTaskButton = document.querySelector('.footer-add-task-button');
    // let addTaskDialog = document.querySelector('.footer-add-task-dialog');

    footerAddTaskButton.addEventListener('click', () => {
      sharedDialogElements.addTaskDialog.showModal();
      footerUtils.setCalendarIconColor('#646464');
    })
  },
  
  activateHamburgerMenu() {
    let hamburgerMenu = document.querySelector('.hamburger-menu');
    
    hamburgerMenu.addEventListener('click', () => {
      // let sidebarDialog = document.querySelector('.sidebar-dialog');
      let sidebarDialog = sharedDialogElements.sidebarDialog;
      if (sidebarDialog !== null) {
        sidebarDialog.showModal();
      }
    })
  },

};

export default footerEventListenerManager;