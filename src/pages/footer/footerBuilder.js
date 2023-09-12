import { DateTime } from 'luxon';
import sendButtonSVG from '../../svgs/send.svg';
import calendarSVG from '../../svgs/calendar-outline.svg';
import { addTaskToLocalStorage, createTask } from '../tasks';
import flatpickr from 'flatpickr';

import footerEventListenerManager from './footerEventListenerManager';
import footerUtils from './footerUtilities';

// console.log('local storage: ' + JSON.parse(localStorage.getItem('sidebarItems'))[0]);

function createFooter() {
  let content = document.querySelector('#content');

  let footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');
  
  // inboxContainer.appendChild(createHeader());
  footerContainer.appendChild(createAddTaskButton());
  footerContainer.appendChild(createAddTaskDialog());
  footerContainer.appendChild(createDiscardChangesDialog());
  footerContainer.appendChild(createDateTimeDialog());
  footerContainer.appendChild(createDateRequiredDialog());
  // footerBar.style.height = '400px';
  footerContainer.appendChild(createFooterBarWithHamburgerMenu());
  content.appendChild(footerContainer);

  // footerEventListenerManager.initializeElements();
  // footerEventListenerManager.initializeFlatpickrDateInput();
  // footerEventListenerManager.activateAddTaskButton();
  // footerEventListenerManager.handleDialogOutsideClick();
  // footerEventListenerManager.activateTimeInputClearButton();
  // footerEventListenerManager.activateDueDateInputTodayButton();
  // footerEventListenerManager.activateDueDateInputClearButton();
  // footerEventListenerManager.addEventListenerPriorityDropdown();
  // footerEventListenerManager.activateDiscardChangesButtons();
  // footerEventListenerManager.activateDateTimeDialogActionButtons();
  // footerEventListenerManager.activateDueDateButton();
  // footerEventListenerManager.addEventListenerTaskTitle();
  // footerEventListenerManager.activateDateRequiredDialogOkButton();
  // footerEventListenerManager.addEventListenerSubmitForm();
  // footerEventListenerManager.activateHamburgerMenu();
  // footerUtils.populateTaskLocationDropdown();
  // footerUtils.storeFormElementsAndDefaultValues();

  // // console.log(footerUtils.addTaskFormElements);
  // // console.log(footerUtils.addTaskFormElementDefaultValues);

  // window.addEventListener('addProjectToLocalStorage', () => {
  //   footerUtils.populateTaskLocationDropdown();
  // })
}

// the circle button with '+' sign
function createAddTaskButton() {
  let button = document.createElement('button');
  button.classList.add('footer-add-task-button');

  let buttonLabel = document.createElement('p');
  buttonLabel.textContent = '+';

  button.appendChild(buttonLabel);

  return button;
}

function createFooterBarWithHamburgerMenu() {
  let footerBar = document.createElement('div');
  footerBar.classList.add('footer-bar');

  let hamburgerContainer = document.createElement('div');
  hamburgerContainer.classList.add('hamburger-menu');

  let span = document.createElement('span');
  let span2 = span.cloneNode();
  let span3 = span.cloneNode();

  hamburgerContainer.append(span, span2, span3);
  footerBar.appendChild(hamburgerContainer);

  return footerBar;
}

function createDiscardChangesDialog() {
  let dialog = document.createElement('dialog');
  dialog.classList.add('discard-changes-dialog');

  let label = document.createElement('p');
  label.classList.add('discard-changes-dialog-header');
  label.textContent = 'Discard Changes?';

  let para = document.createElement('p');
  para.classList.add('discard-changes-warning-message');
  para.textContent = 'The changes you\'ve made will not be saved.';

  let cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.classList.add('discard-changes-cancel-button');
  cancelButton.textContent = 'CANCEL'

  let discardButton = document.createElement('button');
  discardButton.type = 'button';
  discardButton.classList.add('discard-changes-discard-button');
  discardButton.textContent = 'DISCARD';

  let buttons = document.createElement('div');
  buttons.classList.add('discard-changes-buttons');

  buttons.append(cancelButton, discardButton);

  dialog.append(label, para, buttons);
  return dialog;
}

function createAddTaskDialog() {
  let dialog = document.createElement('dialog');
  dialog.classList.add('footer-add-task-dialog');

  let form = document.createElement('form');
  form.classList.add('footer-add-task-form');
  form.method = 'dialog';

  let title = document.createElement('input');
  title.type = 'text';
  title.classList.add('task-title');
  title.placeholder = 'e.g. buy eggs at store';

  let description = document.createElement('input');
  description.type = 'text';
  description.classList.add('task-description');
  description.placeholder = 'Description';

  // let dueDate = document.createElement('input');
  // dueDate.type = 'text';
  // dueDate.placeholder = 'Select Date...';
  // dueDate.classList.add('task-due-date');
  // dueDate.tabIndex = 1;

  let dueDatePara = document.createElement('p');
  dueDatePara.textContent = 'No Date';
  dueDatePara.classList.add('task-due-date-para');
  
  let dueDateContainer = document.createElement('div');
  dueDateContainer.classList.add('task-due-date-button-container');
  dueDateContainer.type = 'button';
  
  let dueDateSVG = document.createElement('iframe');
  dueDateSVG.setAttribute('src', calendarSVG);
  dueDateSVG.classList.add('calendar-svg');

  // let dueDateClearButton = document.createElement('button');
  // dueDateClearButton.classList.add('task-due-date-clear-button');
  // dueDateClearButton.type = 'button';
  // dueDateClearButton.textContent = '✖';

  // let dueDateTimeContainer = document.createElement('div');
  // dueDateTimeContainer.classList.add('task-due-date-time-container');

  // let dueDateTime = document.createElement('input');
  // dueDateTime.classList.add('task-due-date-time');
  // dueDateTime.type = 'time';

  // let dueDateTimeClearButton = document.createElement('button');
  // dueDateTimeClearButton.classList.add('task-due-date-time-clear-button');
  // dueDateTimeClearButton.type = 'button';
  // dueDateTimeClearButton.textContent = '✖';

  let buttons = document.createElement('div');
  buttons.classList.add('date-and-priority-buttons');

  let priorityDropdown = document.createElement('select');
  priorityDropdown.classList.add('priority-dropdown');

  // let noPriority = document.createElement('option');
  // noPriority.textContent = 'Select Priority';
  // noPriority.style.color = 'black';
  // noPriority.value = 0;
  // priorityDropdown.appendChild(noPriority);

  for (let i = 1; i <= 4; i++) {
    let option = document.createElement('option');
    option.classList.add(`priority-${i}`);
    option.value = i;
    option.textContent = `Priority ${i}`;

    if (i === 4) {
      option.setAttribute('selected', true);
    }
    priorityDropdown.appendChild(option);
  }

  let sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.classList.add('send-button');
  sendButton.setAttribute('fill', 'white');

  let buttonSVG = document.createElement('object');
  buttonSVG.classList.add('send-button-svg');
  buttonSVG.setAttribute('data', sendButtonSVG);
  buttonSVG.setAttribute('type', 'image/svg+xml');

  let bottomRow = document.createElement('div');
  bottomRow.classList.add('bottom-row');

  let taskLocationDropdown = document.createElement('select');
  taskLocationDropdown.classList.add('task-location-dropdown');
  
  dueDateContainer.appendChild(dueDateSVG);
  dueDateContainer.appendChild(dueDatePara);
  // dueDateContainer.appendChild(dueDateClearButton);

  // dueDateTimeContainer.appendChild(dueDateTime);
  // dueDateTimeContainer.appendChild(dueDateTimeClearButton);

  bottomRow.appendChild(taskLocationDropdown);
  bottomRow.appendChild(sendButton);
  
  sendButton.appendChild(buttonSVG);

  // buttons.appendChild(dueDate);
  buttons.appendChild(dueDateContainer);
  // buttons.appendChild(dueDateTimeContainer);
  buttons.appendChild(priorityDropdown);

  form.append(title, description, buttons, bottomRow);
  dialog.appendChild(form);

  return dialog;
}

function createDateTimeDialog() {
  let dateTimeDialog = document.createElement('dialog');
  dateTimeDialog.classList.add('task-date-time-dialog');

  let dueDateInputContainer = document.createElement('div');
  dueDateInputContainer.classList.add('task-due-date-input-container');

  let dueDateInput = document.createElement('input');
  dueDateInput.classList.add('task-due-date-input');
  dueDateInput.placeholder = 'No Date';

  let dueDateInputButtons = document.createElement('div')
  dueDateInputButtons.classList.add('task-due-date-input-buttons');

  let dueDateTodayButton = document.createElement('button');
  dueDateTodayButton.classList.add('task-due-date-today-button');
  dueDateTodayButton.type = 'button';
  dueDateTodayButton.textContent = 'Today';

  let dueDateClearButton = document.createElement('button');
  dueDateClearButton.classList.add('task-due-date-clear-button');
  dueDateClearButton.type = 'button';
  dueDateClearButton.textContent = 'Clear Date';

  // let lastSavedDueDate = document.createElement('input');
  // lastSavedDueDate.classList.add('task-due-date-last-saved');
  // lastSavedDueDate.type = 'hidden';

  // let dueDateValue = document.createElement('input');
  // dueDateValue.classList.add('task-due-date-value');
  // dueDateValue.type = 'hidden';

  let timeInputContainer = document.createElement('div');
  timeInputContainer.classList.add('task-time-input-container');

  let timeInput = document.createElement('input');
  timeInput.classList.add('task-time-input');
  timeInput.type = 'time';

  // let lastSavedTimeInput = document.createElement('input');
  // lastSavedTimeInput.classList.add('task-time-input-last-saved');
  // lastSavedTimeInput.type = 'hidden';

  let timeClearButton = document.createElement('button');
  timeClearButton.classList.add('task-time-clear-button');
  timeClearButton.type = 'button';
  timeClearButton.textContent = '✖';


  // let timeValue = document.createElement('input');
  // timeValue.classList.add('.task-time-value');
  // timeValue.type = 'hidden';

  let dateTimeActionButtons = document.createElement('div');
  dateTimeActionButtons.classList.add('task-date-time-dialog-action-buttons');

  let cancelButton = document.createElement('button');
  cancelButton.classList.add('task-date-time-dialog-cancel-button');
  cancelButton.textContent = 'CANCEL';
  
  let saveButton = document.createElement('button');
  saveButton.classList.add('task-date-time-dialog-save-button');
  saveButton.textContent = 'SAVE';
  
  dueDateInputButtons.append(dueDateTodayButton, dueDateClearButton);

  dueDateInputContainer.appendChild(dueDateInput);
  dueDateInputContainer.appendChild(dueDateInputButtons);
  
  timeInputContainer.appendChild(timeInput);
  timeInputContainer.appendChild(timeClearButton);
  
  dateTimeActionButtons.append(cancelButton, saveButton);

  dateTimeDialog.appendChild(dueDateInputContainer);
  dateTimeDialog.appendChild(timeInputContainer);
  dateTimeDialog.appendChild(dateTimeActionButtons);
  return dateTimeDialog;
}

function createDateRequiredDialog() {
  let dateRequiredDialog = document.createElement('dialog');
  dateRequiredDialog.classList.add('date-required-dialog');

  let header = document.createElement('h1');
  header.classList.add('date-required-dialog-header');
  header.textContent = 'Date Required With Time';

  let para = document.createElement('p');
  para.classList.add('date-required-para');
  para.textContent = `A selected time must be accompanied with a selected date.`;

  let okButton = document.createElement('button');
  okButton.type = 'button';
  okButton.classList.add('date-required-dialog-ok-button');
  okButton.textContent = 'OK';

  dateRequiredDialog.append(header, para, okButton);

  return dateRequiredDialog;
}

export default createFooter;