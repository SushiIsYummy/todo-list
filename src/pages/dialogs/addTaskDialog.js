import sendButtonSVG from '/src/svgs/send.svg';
import calendarSVG from '/src/svgs/calendar-outline.svg';
import { getLastSavedDate, getLastSavedTime, resetLastSavedDateAndTime, setLastSavedDate, setLastSavedTime } from './dateTimeDialog';
import sharedElements from './sharedElements';
import { addTaskToLocalStorage } from '../tasks';
import { createTask } from '../task-creator'; 
import * as utils from '/src/utils';
import * as dateTimeDialogUtils from '/src/pages/dialogs/dateTimeDialog';

let addTaskFormElementDefaultValues = [];
let addTaskFormElements = [];
let locationForTasks = ['Inbox'];

function createAddTaskDialog() {
  let content = document.querySelector('#content');

  let dialog = document.createElement('dialog');
  dialog.classList.add('add-task-dialog');

  let form = document.createElement('form');
  form.classList.add('add-task-form');
  form.method = 'dialog';

  let title = document.createElement('textarea');
  title.classList.add('task-title');
  title.placeholder = 'e.g. buy eggs at store';
  title.rows = '1';
  title.addEventListener("input", () => {
    title.style.height = "auto";
    title.style.height = title.scrollHeight + "px";
  })
  title.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
  }
  });

  let description = document.createElement('textarea');
  description.classList.add('task-description');
  description.placeholder = 'Description';
  description.rows = '1';
  description.addEventListener("input", () => {
    description.style.height = "auto";
    description.style.height = description.scrollHeight + "px";
  })

  let dueDatePara = document.createElement('p');
  dueDatePara.textContent = 'No Date';
  dueDatePara.classList.add('task-due-date-para');
  
  let dueDateContainer = document.createElement('div');
  dueDateContainer.classList.add('task-due-date-button-container');
  dueDateContainer.type = 'button';
  
  let dueDateSVG = document.createElement('iframe');
  dueDateSVG.setAttribute('src', calendarSVG);
  dueDateSVG.classList.add('calendar-svg');
  dueDateSVG.addEventListener('load', () => {
    setCalendarIconColor(dateTimeDialogUtils.getColorBasedOnDateTime(dateTimeDialogUtils.getLastSavedDate(), dateTimeDialogUtils.getLastSavedTime()));
  });

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

  populateTaskLocationDropdown(taskLocationDropdown);
  addEventListenerPriorityDropdown(priorityDropdown);
  addEventListenerTaskTitle();
  utils.handleDialogOutsideClick(dialog, function () { showDiscardChangesDialogIfChangesMade(dialog) });
  activateDueDateButtonOnClick(dueDateContainer);
  setUpFormSubmitHandler();
  // console.log(addTaskFormElementDefaultValues);

  window.addEventListener('projectAddedToLocalStorage', () => {
    populateTaskLocationDropdown(taskLocationDropdown);
  })
}

export function addEventListenerPriorityDropdown(priorityDropdown) {
  // let priorityDropdown = document.querySelector('.priority-dropdown');

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
  // let addTaskDialog = document.querySelector('.add-task-dialog');
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

export function setCurrentPriorityValueWithCorrespondingColor(priorityDropdown) {
  // let priorityDropdown = document.querySelector('.priority-dropdown');
  priorityDropdown.classList.forEach(className => {
    if (/^priority-\d-color$/.test(className)) {
      priorityDropdown.classList.remove(className);
    }
  })

  // reset to last option's color (priority 4)
  priorityDropdown.classList.add(`priority-${priorityDropdown.value}-color`);
}
export function clearAddTaskForm() {
  let form = document.querySelector('.add-task-form');
  form.reset();

  // reset height of title and description to 1 row
  let taskTitle = document.querySelector('.task-title');
  utils.setTextAreaHeightToContentHeight(taskTitle);

  let taskDescription = document.querySelector('.task-description');
  utils.setTextAreaHeightToContentHeight(taskDescription);

  let dueDatePara = document.querySelector('.task-due-date-para');
  dueDatePara.textContent = 'No Date';

  // empty the flatpickr alt input
  let dueDateFlatpickrInput = document.querySelector('.task-due-date-input.flatpickr-input');
  dueDateFlatpickrInput.value = '';

  let dueDateInput = document.querySelector('.task-due-date-input');

  let priorityDropdown = document.querySelector('.priority-dropdown');
  setCurrentPriorityValueWithCorrespondingColor(priorityDropdown);

  resetLastSavedDateAndTime();
  
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
  addTaskFormElementDefaultValues = [];
  addTaskFormElements.forEach(element => {
    console.log(element.value);
    addTaskFormElementDefaultValues.push(element.value);
  })
}

function setUpFormSubmitHandler() {
  let addTaskForm = document.querySelector('.add-task-form');
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

export function activateDueDateButtonOnClick(dueDateButton) {
  // let dueDateButton = document.querySelector('.task-due-date-button-container');
  let timeInput = document.querySelector('.task-time-input');
  let dueDateInput = document.querySelector('.task-due-date-input'); 
    
  dueDateButton.addEventListener('click', () => {
    dueDateInput.value = getLastSavedDate();
    timeInput.value = getLastSavedTime();
    sharedElements.dateTimeDialog.showModal();
  })
}

export function populateTaskLocationDropdown(taskLocationDropdown) {
  // let taskLocationDropdown = document.querySelector('.task-location-dropdown');
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
    option.value = locationForTasks[i];
    option.textContent = locationForTasks[i];

    taskLocationDropdown.appendChild(option);
  }

  // add projects
  for (let i = 0; i < projectList.length; i++) {
    let option = document.createElement('option');
    option.classList.add('option-item');
    option.value = projectList[i];
    option.textContent = projectList[i];

    taskLocationDropdown.appendChild(option);
  }
}

export default createAddTaskDialog;