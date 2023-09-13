import sendButtonSVG from '/src/svgs/send.svg';
import calendarSVG from '/src/svgs/calendar-outline.svg';
import { getLastSavedDate, getLastSavedTime, setLastSavedDate, setLastSavedTime } from './dateTimeDialog';
import sharedDialogElements from './sharedDialogElements';
import { addTaskToLocalStorage, createTask } from '../tasks';
import * as utils from '../../utils';

let addTaskFormElementDefaultValues = [];
let addTaskFormElements = [];
let locationForTasks = ['Inbox'];

function createAddTaskDialog() {
  let content = document.querySelector('#content');

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

  let dueDatePara = document.createElement('p');
  dueDatePara.textContent = 'No Date';
  dueDatePara.classList.add('task-due-date-para');
  
  let dueDateContainer = document.createElement('div');
  dueDateContainer.classList.add('task-due-date-button-container');
  dueDateContainer.type = 'button';
  
  let dueDateSVG = document.createElement('iframe');
  dueDateSVG.setAttribute('src', calendarSVG);
  dueDateSVG.classList.add('calendar-svg');

  let buttons = document.createElement('div');
  buttons.classList.add('date-and-priority-buttons');

  let priorityDropdown = document.createElement('select');
  priorityDropdown.classList.add('priority-dropdown');

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

  bottomRow.appendChild(taskLocationDropdown);
  bottomRow.appendChild(sendButton);
  
  sendButton.appendChild(buttonSVG);

  buttons.appendChild(dueDateContainer);
  buttons.appendChild(priorityDropdown);

  form.append(title, description, buttons, bottomRow);
  dialog.appendChild(form);

  content.appendChild(dialog);

  populateTaskLocationDropdown();
  // storeFormElementsAndDefaultValues();
  addEventListenerPriorityDropdown();
  addEventListenerTaskTitle();
  // handleDialogOutsideClick(dialog);
  utils.handleDialogOutsideClick(dialog, function () { showDiscardChangesDialogIfChangesMade(dialog) });
  activateDueDateButton();
  setUpFormSubmitHandler();
  console.log(addTaskFormElementDefaultValues);

  window.addEventListener('projectAddedToLocalStorage', () => {
    populateTaskLocationDropdown();
  })
}

function addEventListenerPriorityDropdown() {
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

// Checks if the title is empty or not
// If title is empty, the add button is disabled.
// Otherwise, it is enabled.
function addEventListenerTaskTitle() {
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
}

function showDiscardChangesDialogIfChangesMade(addTaskDialog) {
  let discardChangesDialog = document.querySelector('.discard-changes-dialog');
  // let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  if (allElementsAreUntouched()) {
    utils.hideDialogWithAnimation(addTaskDialog);
    clearAddTaskForm();
  } else { 
    discardChangesDialog.showModal();
  }
}

function allElementsAreUntouched() { 
  for (let i = 0; i < addTaskFormElementDefaultValues.length; i++) {
    if (addTaskFormElementDefaultValues[i] !== addTaskFormElements[i].value) {
      return false;
    }
  }
  return true;
}

export function clearAddTaskForm() {
  let form = document.querySelector('.footer-add-task-form');
  form.reset();

  let dueDatePara = document.querySelector('.task-due-date-para');
  dueDatePara.textContent = 'No Date';

  // empty the flatpickr alt input
  let dueDateFlatpickrInput = document.querySelector('.task-due-date-input.flatpickr-input');
  dueDateFlatpickrInput.value = '';

  let dueDateInput = document.querySelector('.task-due-date-input');

  // adjustDateInputWidthToPlaceHolderWidth();
  // let dueDateButtonPara = document.querySelector('.task-due-date-button-para');
  // dueDateButtonPara.textContent = 'No Date';

  let priorityDropdown = document.querySelector('.priority-dropdown');
  priorityDropdown.classList.forEach(className => {
    if (/^priority-\d-color$/.test(className)) {
      priorityDropdown.classList.remove(className);
    }
  })

  // reset to last option's color (priority 4)
  priorityDropdown.classList.add(`priority-${priorityDropdown.value}-color`);

  setLastSavedDate('');
  setLastSavedTime('');
  
  dueDateInput._flatpickr.clear();

  setCalendarIconColor('#646464');

  // remove colors
  for (let i = 0; i < dueDatePara.classList.length; i++) {
    if (dueDatePara.classList[i] !== 'task-due-date-para') {
      dueDatePara.classList.remove(dueDatePara.classList[i]);
    }
  }

  dueDatePara.classList.add('no-date');
  // this.setDueDateParaColor('#646464');

  // reset option to last option which is priority 4
  // priorityDropdown.value = priorityDropdown.options[priorityDropdown.options.length-1].value;
  
  // let colorOfLastOption = getComputedStyle(priorityDropdown.options[priorityDropdown.options.length-1]).color;
  // priorityDropdown.style.color = colorOfLastOption;

}

// note: only usable when the add task dialog is opened since the
// calendar svg is in the dialog and it is not loaded until it is
// opened.
export function setCalendarIconColor(color) {
  const svgIframe = document.querySelector('.calendar-svg');
  const svgIframeWindow = svgIframe.contentWindow;
  const svgIframeDocument = svgIframeWindow.document;
  const pathElement = svgIframeDocument.querySelector('svg');
  pathElement.style.fill = color;
}

export function storeFormElementsAndDefaultValues() {
    
  let title = document.querySelector('.task-title');
  let description = document.querySelector('.task-description');
  let date = document.querySelector('.task-due-date-input');
  let time = document.querySelector('.task-time-input');
  let priorityDropdown = document.querySelector('.priority-dropdown');
  let taskLocationDropdown = document.querySelector('.task-location-dropdown');
  
  addTaskFormElements = [title, description, date, time, priorityDropdown, taskLocationDropdown];
  addTaskFormElements.forEach(element => {
    console.log(element);
    addTaskFormElementDefaultValues.push(element.value);
  })
}

function setUpFormSubmitHandler() {
  let addTaskForm = document.querySelector('.footer-add-task-form');
  let sendButton = document.querySelector('.send-button');
  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();  
    if (sendButton.classList.contains('active')) {
      processFormData(addTaskForm);
    }
  });
}

function processFormData(addTaskForm) {
  let sendButton = document.querySelector('.send-button');
  let task = createTask(addTaskFormElements);
  addTaskToLocalStorage(task);
  clearAddTaskForm();
  addTaskForm.querySelector('.task-title').focus();
  sendButton.classList.remove('active');
}

function activateDueDateButton() {
  let dueDateButton = document.querySelector('.task-due-date-button-container');
  let timeInput = document.querySelector('.task-time-input');
  let dueDateInput = document.querySelector('.task-due-date-input'); 
    
  dueDateButton.addEventListener('click', () => {
    dueDateInput.value = getLastSavedDate();
    timeInput.value = getLastSavedTime();
    sharedDialogElements.dateTimeDialog.showModal();
  })
}

export function populateTaskLocationDropdown() {
  let taskLocationDropdown = document.querySelector('.task-location-dropdown');
  let projectList = JSON.parse(localStorage.getItem('projectsList'));

  utils.clearAllChildrenOfElement(taskLocationDropdown);

  if (projectList === null) {
    projectList = ['Home'];
    localStorage.setItem('projectsList', JSON.stringify(projectList));
  }

  // add default locations
  for (let i = 0; i < locationForTasks.length; i++) {
    let option = document.createElement('option');
    option.classList.add('option-item');
    option.value = locationForTasks[i].toLowerCase();
    option.textContent = locationForTasks[i];

    taskLocationDropdown.appendChild(option);
  }

  // add projects
  for (let i = 0; i < projectList.length; i++) {
    let option = document.createElement('option');
    option.classList.add('option-item');
    option.value = projectList[i].toLowerCase();
    option.textContent = projectList[i];

    taskLocationDropdown.appendChild(option);
  }
}

export default createAddTaskDialog;