import { DateTime } from 'luxon';
import sendButtonSVG from '../../svgs/send.svg';
import calendarSVG from '../../svgs/calendar-outline.svg';
import { addTaskToLocalStorage, createTask } from '../tasks';
import flatpickr from 'flatpickr';

import * as footerEL from './footerEventHandlers';
import * as footerUtil from './footerUtilities';

// console.log('local storage: ' + JSON.parse(localStorage.getItem('sidebarItems'))[0]);

function createFooter() {
  let content = document.querySelector('#content');

  let footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');
  
  // inboxContainer.appendChild(createHeader());
  footerContainer.appendChild(createAddTaskButton());
  footerContainer.appendChild(createAddTaskDialog());
  footerContainer.appendChild(createDiscardChangesDialog());

  // footerBar.style.height = '400px';
  footerContainer.appendChild(createFooterBarWithHamburgerMenu());
  content.appendChild(footerContainer);

  footerEL.activateAddTaskButton();
  footerEL.handleAddTaskDialogOutsideClick();
  // activateDueDateButton();
  footerEL.activateDueDateTime();
  footerEL.addEventListenerPriorityDropdown();
  footerEL.activateDiscardChangesButtons();
  footerEL.addEventListenerTaskTitle();
  // activateSendButton();
  footerEL.addEventListenerSubmitForm();
  footerEL.activateHamburgerMenu();
  footerEL.customizeFlatpickrDateInput();
  // customizeFlatpickrTimeInput();
  footerUtil.adjustDateInputWidthToPlaceHolderWidth();

  let priorityDropdown = document.querySelector('.priority-dropdown');

  // let dialog = document.querySelector('.discard-changes-dialog');
  // dialog.close();

  let form = document.querySelector('.footer-add-task-form');
  // console.log(taskList[0]);

  // console.log('addTaskFormElements: ' + addTaskFormElements);
  // console.log('addTaskFormElementDefaultValues: ' + addTaskFormElementDefaultValues);
  let dialog = document.querySelector('.footer-add-task-dialog');
  // dialog.showModal();

  footerUtil.storeFormElementsAndDefaultValues();

  let now = DateTime.now();
  [ now,
    now.plus({hours: 22, minute: 59 }),
    now.plus({days: 1}),
    now.plus({days: 4}),
    now.minus({days: 1}),
    now.minus({days: 4}),
    now.minus({days: 20}),
  ].forEach((k) => {
    console.log( k.toRelativeCalendar() );
  });
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

// the circle button with '+' sign
function createAddTaskButton() {
  let button = document.createElement('button');
  button.classList.add('footer-add-task-button');

  let buttonLabel = document.createElement('p');
  buttonLabel.textContent = '+';

  button.appendChild(buttonLabel);

  return button;
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

  let dueDate = document.createElement('input');
  dueDate.type = 'text';
  dueDate.placeholder = 'Select Date...';
  dueDate.classList.add('task-due-date');
  dueDate.tabIndex = 1;
  
  let dueDateContainer = document.createElement('div');
  dueDateContainer.classList.add('task-due-date-container');
  // dueDateContainer.type = 'button';
  
  let dueDateSVG = document.createElement('iframe');
  dueDateSVG.setAttribute('src', calendarSVG);
  dueDateSVG.classList.add('calendar-svg');

  let dueDateTime = document.createElement('input');
  dueDateTime.classList.add('task-due-date-time');
  dueDateTime.type = 'time';

  // let customTimePicker = document.createElement('div');
  // customTimePicker.classList.add('custom-time-picker');
  // customTimePicker.style.display = 'none';

  // let customTime = document.createElement('input');
  // customTime.classList.add('custom-time');

  // let confirmButton = document.createElement('button');
  // confirmButton.classList.add('confirm-button');
  // confirmButton.textContent = '✔️';

  // customTimePicker.appendChild(customTime);
  // customTimePicker.appendChild(confirmButton);
  // document.body.appendChild(customTimePicker);

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

  for (let i = 0; i < footerUtil.locationForTasks.length; i++) {
    let option = document.createElement('option');
    option.classList.add('option-item');
    option.value = footerUtil.locationForTasks[i].toLowerCase();
    option.textContent = footerUtil.locationForTasks[i];

    taskLocationDropdown.appendChild(option);
  }

  dueDateContainer.appendChild(dueDateSVG);
  dueDateContainer.appendChild(dueDate);

  bottomRow.appendChild(taskLocationDropdown);
  bottomRow.appendChild(sendButton);
  
  sendButton.appendChild(buttonSVG);

  // buttons.appendChild(dueDate);
  buttons.appendChild(dueDateContainer);
  buttons.appendChild(dueDateTime);
  buttons.appendChild(priorityDropdown);

  form.append(title, description, buttons, bottomRow);
  dialog.appendChild(form);

  return dialog;
}

export default createFooter;