import { DateTime } from 'luxon';
import sendButtonSVG from '../../svgs/send.svg';
import calendarSVG from '../../svgs/calendar-outline.svg';
import { addTaskToLocalStorage, createTask } from '../tasks';
import flatpickr from 'flatpickr';
import { addTaskFormElements } from './footerUtilities';

import * as footerUtil from './footerUtilities';
import * as tasks from '../tasks';

// adds a Task when send button is active and clicked
export function addEventListenerSubmitForm() {
  let form = document.querySelector('.footer-add-task-form');
  let sendButton = document.querySelector('.send-button');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (sendButton.classList.contains('active')) {
      let task = createTask(addTaskFormElements);
      addTaskToLocalStorage(task);
      footerUtil.clearAddTaskForm();
      form.querySelector('.task-title').focus();
      sendButton.classList.remove('active');
    }
  })
}

export function customizeFlatpickrDateInput() {
  const datepicker = flatpickr('.task-due-date', {
    minDate: "today", // Starts from today
    maxDate: "infinite", // Continues indefinitely
    altInput: true,
    // altFormat: 'F j, Y',
    // dateFormat: 'Y-m-d',
    position: function () {
      let dueDateContainer = document.querySelector('.task-due-date-container');
      let dueDateContainerCS = getComputedStyle(dueDateContainer);
      let dueDateAltInput = document.querySelector('.task-due-date.form-control');
      let shiftLeft = dueDateContainer.offsetWidth - dueDateAltInput.offsetWidth
                      - parseInt(dueDateContainerCS.paddingRight);
      let shiftDown = dueDateContainerCS.paddingBottom;
      // console.log('padding right: ' + getComputedStyle(dueDateContainer).paddingRight);
      let calendar = document.querySelector('.flatpickr-calendar');
      calendar.style.left = `-${shiftLeft}px`;
      calendar.style.top = `${shiftDown}px`;
    },
    // Other options go here
    onOpen: [
      function() {
        let calendar = document.querySelector('.flatpickr-calendar');
        let calendarHeight = getComputedStyle(calendar).height;
        let dialog = document.querySelector('.footer-add-task-dialog');
        let bottomRow = document.querySelector('.bottom-row');
        let bottomRowHeight = getComputedStyle(bottomRow).height
        // console.log(getAddTaskDialogHeight())
        // console.log(parseInt(calendarHeight));
        dialog.style.top = `calc(100% - ${footerUtil.getAddTaskDialogHeight()}px - ${calendarHeight} + ${bottomRowHeight})`;
        
        // changeCalendarIconColor('green');

        // console.log('top: ' + getComputedStyle(dialog).top);
        if (parseInt(getComputedStyle(dialog).top) < 0) {
          dialog.style.top = '';
          // dialog.style.bottom = '';
        }
        // console.log('top: ' + getComputedStyle(dialog).top);

        
        dialog.style.height = `10000px`;

      }
    ],
    onClose: [
      function() {
        let dialog = document.querySelector('.footer-add-task-dialog');
        let altInput = document.querySelector('.task-due-date.form-control')
        dialog.style.height = '';
        dialog.style.top =  `calc(100% - ${footerUtil.getAddTaskDialogHeight()}px)`;

        footerUtil.formatDateInputText();
        // altInput.value = 'APIDJAPODJPOJZZZZAPSDIJSAPODJ';
        // changeCalendarIconColor('red');
      }
    ],
    static: true

});

  let dueDate = document.querySelector('.task-due-date');
  // datepicker.config.onOpen.push(() => {
        // Set the altInput value to 'Hello'
        // console.log(datepickerElement.value);
        // console.log('opened!');
        // dueDate.focus();
  // });

  dueDate.addEventListener('change', () => {
    if (dueDate.value === '') {
      footerUtil.setDateToToday();
      footerUtil.formatDateInputText();
    }
    footerUtil.adjustDateInputWidthToContentWidth();
  })

  let dueDateContainer = document.querySelector('.task-due-date-container');
  dueDateContainer.addEventListener('click', function () {
    datepicker.open();
  })
}

export function activateAddTaskButton() {
  let button = document.querySelector('.footer-add-task-button');

  button.addEventListener('click', () => {
    let dialog = document.querySelector('.footer-add-task-dialog');

    dialog.showModal();
    footerUtil.setCalendarIconColor('#646464');
    // set add task dialog at the bottom of page
    // dialog.style.top =  `calc(100% - ${getAddTaskDialogHeight()}px)`;
    // dialog.style.bottom = 0;
  })
}

export function activateDueDateTime() {
  let dueDateTime = document.querySelector('.task-due-date-time');
  let dueDate = document.querySelector('.task-due-date');

  // A task cannot have a time and no date
  // change date to Today if time is chosen and date is empty
  dueDateTime.addEventListener('change', () => {
    if (dueDate.value === '') {
      // dueDate.value = DateTime.now().toFormat('yyyy-MM-dd');

      // Manually trigger the the change for dueDate
      const changeEvent = new Event('change', { bubbles: true });
      dueDate.dispatchEvent(changeEvent);

      console.log('dispatched event!');
    }
  })
}

export function handleAddTaskDialogOutsideClick() {
  let dialog = document.querySelector('.footer-add-task-dialog');
  let form = dialog.querySelector('form');

  let isMouseOutsideModal = false;

  dialog.addEventListener("mousedown", (event) => {
    const dialogDimensions = dialog.getBoundingClientRect();
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

  dialog.addEventListener("mouseup", (event) => {
    const modalArea = dialog.getBoundingClientRect();
    // console.log(isMouseOutsideModal);
    if (isMouseOutsideModal && 
      (event.clientX < modalArea.left ||
      event.clientX > modalArea.right ||
      event.clientY < modalArea.top ||
      event.clientY > modalArea.bottom)) {
      isMouseOutsideModal = false;
      if (footerUtil.allElementsAreUntouched()) {
        footerUtil.hideAddTaskDialog();
        footerUtil.clearAddTaskForm();
      } else {
        let discardChangesDialog = document.querySelector('.discard-changes-dialog');
        discardChangesDialog.showModal();
      }
    }
  });
}

export function handleDiscardChangesDialogOutsideClick() {
  let discardChangesDialog = document.querySelector('.discard-changes-dialog');
  let form = discardChangesDialog.querySelector('form');

  let isMouseOutsideModal = false;

  discardChangesDialog.addEventListener("mousedown", (event) => {
    const dialogDimensions = discardChangesDialog.getBoundingClientRect();
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

  discardChangesDialog.addEventListener("mouseup", (event) => {
    const modalArea = discardChangesDialog.getBoundingClientRect();
    // console.log(isMouseOutsideModal);
    if (isMouseOutsideModal && 
      (event.clientX < modalArea.left ||
      event.clientX > modalArea.right ||
      event.clientY < modalArea.top ||
      event.clientY > modalArea.bottom)) {
      isMouseOutsideModal = false;
      discardChangesDialog.close();
    }
  });
}

export function dialogAnimationEnd() {
  let dialog = document.querySelector('.footer-add-task-dialog');
  dialog.close();
  dialog.classList.remove('hide');
  dialog.removeEventListener('animationend', dialogAnimationEnd);
  // clearAddTaskForm();
}

export function addEventListenerPriorityDropdown() {
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
}

export function activateDiscardChangesButtons() {
  let discardChangesDialog = document.querySelector('.discard-changes-dialog');
  let cancelButton = document.querySelector('.discard-changes-cancel-button');
  let discardButton = document.querySelector('.discard-changes-discard-button');

  cancelButton.addEventListener('click', () => {
    discardChangesDialog.close();
  });

  discardButton.addEventListener('click', () => {
    let addTaskDialog = document.querySelector('.footer-add-task-dialog');
    let discardChangesDialog = document.querySelector('.discard-changes-dialog');
    footerUtil.hideAddTaskDialog();
    discardChangesDialog.close();
    footerUtil.clearAddTaskForm();
  });

}

// Checks if the title is empty or not
// If title is empty, the add button is disabled.
// Otherwise, it is enabled.
export function addEventListenerTaskTitle() {
  let taskTitle = document.querySelector('.task-title');
  taskTitle.addEventListener('input', (e) => {
    let addButton = document.querySelector('.send-button');
    if (e.target.value !== '') {
      addButton.classList.add('active');
    } else {
      addButton.classList.remove('active');
    }
    console.log('INPUT CHANGED');
  })
}

export function activateHamburgerMenu() {
  let hamburgerMenu = document.querySelector('.hamburger-menu');
  let sidebarDialog = document.querySelector('.sidebar-dialog');

  hamburgerMenu.addEventListener('click', () => {
    sidebarDialog.showModal();
  })
}