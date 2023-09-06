import { DateTime } from 'luxon';
import sendButtonSVG from '../../svgs/send.svg';
import calendarSVG from '../../svgs/calendar-outline.svg';
import { addTaskToLocalStorage, createTask } from '../tasks';
import flatpickr from 'flatpickr';
// import { addTaskFormElements } from './footerUtilities';

import footerUtilitiesManager from './footerUtilities';
import * as footerUtil from './footerUtilities';
import * as tasks from '../tasks';

const footerEventListenerManager = {
  datepicker: null,
  addTaskForm: null,
  sendButton: null,
  footerAddTaskButton: null,
  addTaskDialog: null,
  timeInput: null,
  dueDateInput: null,
  dateTimeDialog: null,
  discardChangesDialog: null,

  initializeElements() {
    this.addTaskForm = document.querySelector('.footer-add-task-form');
    this.sendButton = document.querySelector('.send-button');
    this.footerAddTaskButton = document.querySelector('.footer-add-task-button');
    this.addTaskDialog = document.querySelector('.footer-add-task-dialog');
    this.timeInput = document.querySelector('.task-time-input');
    this.dueDateInput = document.querySelector('.task-due-date-input');
    this.dateTimeDialog = document.querySelector('.task-date-time-dialog');
    this.discardChangesDialog = document.querySelector('.discard-changes-dialog');
  },

  addEventListenerSubmitForm() {
    this.addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      if (this.sendButton.classList.contains('active')) {
        let task = createTask(footerUtilitiesManager.addTaskFormElements);
        addTaskToLocalStorage(task);
        footerUtilitiesManager.clearAddTaskForm();
        this.addTaskForm.querySelector('.task-title').focus();
        this.sendButton.classList.remove('active');
      }
    });
  },
  
  initializeFlatpickrDateInput() {
    this.datepicker = flatpickr('.task-due-date-input', {
      minDate: 'today',
      altInput: true,
      inline: true,
      // clickOpens: "time",
      // static: true,
      // onClick: function(instance) {
      //   // Prevent the calendar from closing when clicking outside
      //   instance.calendarContainer.style.display = "block";
      // }
    })
    let dateTimeDialogCalendar = document.querySelector('.task-date-time-dialog.flatpickr-calendar');
    // let dueDateInput = document.querySelector('.task-due-date-input.form-control');
    // dueDateInput.value = '2023-08-05';
  
  },
  
  activateAddTaskButton() {
    this.footerAddTaskButton.addEventListener('click', () => {
      this.addTaskDialog.showModal();
      footerUtilitiesManager.setCalendarIconColor('#646464');
      // set add task dialog at the bottom of page
      // dialog.style.top =  `calc(100% - ${getAddTaskDialogHeight()}px)`;
      // dialog.style.bottom = 0;
    })
  },
  
  // activateDueDateTime() {
  //   let dueDateTime = document.querySelector('.task-due-date-time');
  //   let dueDate = document.querySelector('.task-due-date');
  
  //   // A task cannot have a time and no date
  //   // change date to Today if time is chosen and date is empty
  //   dueDateTime.addEventListener('change', () => {
  //     if (dueDate.value === '') {
  //       // dueDate.value = DateTime.now().toFormat('yyyy-MM-dd');
  
  //       // Manually trigger the the change for dueDate
  //       const changeEvent = new Event('change', { bubbles: true });
  //       dueDate.dispatchEvent(changeEvent);
  
  //       console.log('dispatched event!');
  //     }
  //   })
  // },
  
  activateTimeInputClearButton() {
    let clearButton = document.querySelector('.task-time-clear-button');
    
    clearButton.addEventListener('click', () => {
      console.log(this.timeInput.value);
      this.timeInput.value = '';
    });
  },

  activateDueDateInputClearButton() {
    let clearButton = document.querySelector('.task-due-date-clear-button');
    clearButton.addEventListener('click', () => {
      this.datepicker.clear();
    })
  },
  
  activateDateTimeDialogActionButtons() {  
    let cancelButton = document.querySelector('.task-date-time-dialog-cancel-button');
    let saveButton = document.querySelector('.task-date-time-dialog-save-button');
  
    cancelButton.addEventListener('click', () => {
      // footerUtilitiesManager.setLastSavedDate(footerUtilitiesManager.getLastSavedDate());
      // footerUtilitiesManager.setLastSavedTime(footerUtilitiesManager.getLastSavedTime());
      this.datepicker.setDate(footerUtilitiesManager.getLastSavedDate());
      this.dateTimeDialog.close();
      console.log('date: ' + footerUtilitiesManager.getLastSavedDate());
      console.log('time: ' + footerUtilitiesManager.getLastSavedTime());
    });
  
    saveButton.addEventListener('click', () => {
      footerUtilitiesManager.setLastSavedDate(this.dueDateInput.value);
      footerUtilitiesManager.setLastSavedTime(this.timeInput.value);
      footerUtilitiesManager.formatDateInputText();

      let dateRequiredDialog = document.querySelector('.date-required-dialog');
      if (dateRequiredDialog.open) {
        // keep date time dialog open
      } else {
        this.dateTimeDialog.close();
      }
      console.log('date: ' + footerUtilitiesManager.getLastSavedDate());
      console.log('time: ' + footerUtilitiesManager.getLastSavedTime());
    })
  },
  
  activateDueDateButton() {
    let dueDateButton = document.querySelector('.task-due-date-button-container');
    
    let dueDateInputDisplayed = document.querySelector('.task-due-date-input.form-control');
    
  
    
    dueDateButton.addEventListener('click', () => {
      this.dueDateInput.value = footerUtilitiesManager.getLastSavedDate();
      this.timeInput.value = footerUtilitiesManager.getLastSavedTime();
      this.dateTimeDialog.showModal();
    })
  },

  activateDateRequiredDialogOkButton() {
    let okButton = document.querySelector('.date-required-dialog-ok-button');
    let dateRequiredDialog = document.querySelector('.date-required-dialog');

    okButton.addEventListener('click', () => {
      dateRequiredDialog.close();
    })
  },
  
  changeDueDateParaToCalendarInputFormatted() {
  
  },
  
  handleDialogOutsideClick(dialogElement, extraActions) {
    
    let form = this.addTaskDialog.querySelector('form');
  
    let isMouseOutsideModal = false;
  
    this.addTaskDialog.addEventListener("mousedown", (event) => {
      const dialogDimensions = this.addTaskDialog.getBoundingClientRect();
      if (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
      ) {
        isMouseOutsideModal = true;
      } else {
        isMouseOutsideModal = false;
      }
    });
  
    this.addTaskDialog.addEventListener("mouseup", (event) => {
      const modalArea = this.addTaskDialog.getBoundingClientRect();
      // console.log(isMouseOutsideModal);
      if (isMouseOutsideModal && 
        (event.clientX < modalArea.left ||
        event.clientX > modalArea.right ||
        event.clientY < modalArea.top ||
        event.clientY > modalArea.bottom)) {
        isMouseOutsideModal = false;
          this.showDiscardChangesDialogIfChangesMade();
      }
    });
  },
  
  showDiscardChangesDialogIfChangesMade() {
    if (footerUtilitiesManager.allElementsAreUntouched()) {
      hideAddTaskDialog();
      footerUtilitiesManager.clearAddTaskForm();
    } else {
      
      this.discardChangesDialog.showModal();
    }
  },
  
  handleDiscardChangesDialogOutsideClick() {
    
    let form = this.discardChangesDialog.querySelector('form');
  
    let isMouseOutsideModal = false;
  
    this.discardChangesDialog.addEventListener("mousedown", (event) => {
      const dialogDimensions = this.discardChangesDialog.getBoundingClientRect();
      if (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
      ) {
        isMouseOutsideModal = true;
      } else {
        isMouseOutsideModal = false;
      }
    });
  
    this.discardChangesDialog.addEventListener("mouseup", (event) => {
      const modalArea = this.discardChangesDialog.getBoundingClientRect();
      // console.log(isMouseOutsideModal);
      if (isMouseOutsideModal && 
        (event.clientX < modalArea.left ||
        event.clientX > modalArea.right ||
        event.clientY < modalArea.top ||
        event.clientY > modalArea.bottom)) {
        isMouseOutsideModal = false;
        this.discardChangesDialog.close();
      }
    });
  },
  
  addEventListenerPriorityDropdown() {
    let priorityDropdown = document.querySelector('.priority-dropdown');
  
    // set color of initial selected item (priority 4)
    let currentOptionElement = document.querySelector(`.priority-${priorityDropdown.value}`);
    // priorityDropdown.style.color = getComputedStyle(currentOptionElement).color;
    priorityDropdown.classList.add(`priority-${priorityDropdown.value}-color`);
  
    // change color of selected item to the user selected item
    priorityDropdown.addEventListener('change', () => {
      let dropdownOption = document.querySelector(`.priority-${priorityDropdown.value}`);
      // priorityDropdown.style.color = getComputedStyle(dropdownOption). color;
      priorityDropdown.classList.forEach(className => {
        if (/^priority-\d-color$/.test(className)) {
          priorityDropdown.classList.remove(className);
        }
      })
      priorityDropdown.classList.add(`priority-${priorityDropdown.value}-color`);
    })
  },
  
  activateDiscardChangesButtons() {
    let cancelButton = document.querySelector('.discard-changes-cancel-button');
    let discardButton = document.querySelector('.discard-changes-discard-button');
  
    cancelButton.addEventListener('click', () => {
      this.discardChangesDialog.close();
    });
  
    discardButton.addEventListener('click', () => {
      hideAddTaskDialog();
      this.discardChangesDialog.close();
      footerUtilitiesManager.clearAddTaskForm();
    });
  
  },
  
  // Checks if the title is empty or not
  // If title is empty, the add button is disabled.
  // Otherwise, it is enabled.
  addEventListenerTaskTitle() {
    let taskTitle = document.querySelector('.task-title');
    taskTitle.addEventListener('input', (e) => {
      let sendButton = document.querySelector('.send-button');
      if (e.target.value !== '') {
        sendButton.classList.add('active');
      } else {
        sendButton.classList.remove('active');
      }
      console.log('INPUT CHANGED');
    })
  },
  
  activateHamburgerMenu() {
    let hamburgerMenu = document.querySelector('.hamburger-menu');
    let sidebarDialog = document.querySelector('.sidebar-dialog');
  
    hamburgerMenu.addEventListener('click', () => {
      sidebarDialog.showModal();
    })
  }

};

// the two functions below dont work properly when they are in the 
// footerEventListenerManager object for some reason
function dialogAnimationEnd() {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  addTaskDialog.close();
  addTaskDialog.classList.remove('hide');
  addTaskDialog.removeEventListener('animationend', dialogAnimationEnd);
  // clearAddTaskForm();
}

function hideAddTaskDialog() {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  addTaskDialog.classList.add('hide');

  let inboxListDiv = document.querySelector('.inbox-list-div');
  console.log('inbox list div: ' + inboxListDiv);
  if (inboxListDiv !== null) {
    inboxListDiv.classList.add('hide');
  }

  addTaskDialog.addEventListener('animationend', dialogAnimationEnd);
  // clearAddTaskForm();
}

export default footerEventListenerManager;