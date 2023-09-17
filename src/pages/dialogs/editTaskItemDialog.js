import { activateDueDateButtonOnClick, addEventListenerPriorityDropdown, populateTaskLocationDropdown, setCalendarIconColor, setCurrentPriorityValueWithCorrespondingColor } from './addTaskDialog';
import { getLastSavedTime, getLastSavedDate, resetLastSavedDateAndTime, setLastSavedDate, setLastSavedTime } from './dateTimeDialog';
import sharedElements from './sharedElements';
import calendarSVG from '/src/svgs/calendar-outline.svg';
import * as dateTimeDialog from '/src/pages/dialogs/dateTimeDialog';
import { removeHighlightedTaskItem, updateSingleTaskItem } from '../tasks';
import { calculateTextareaRows } from '../../utils';

let editTaskItem = null;

function createEditTaskItemDialog() {
  let editTaskItemDialog = document.createElement('dialog');
  editTaskItemDialog.classList.add('edit-task-item-dialog');

  let header = document.createElement('h1');
  header.classList.add('edit-task-item-header');
  header.textContent = 'Edit Task';

  // growing textarea
  // https://codepen.io/devrasta07/pen/GRMPMGG

  let taskTitle = document.createElement('textarea');
  taskTitle.classList.add('edit-task-title');
  taskTitle.rows = '1';
  taskTitle.placeholder = 'Title';
  taskTitle.addEventListener("input", () => {
    taskTitle.style.height = "auto"
    taskTitle.style.height = taskTitle.scrollHeight + "px"
  })

  let taskDescription = document.createElement('textarea');
  taskDescription.classList.add('edit-task-description');
  taskDescription.rows = '1';
  taskDescription.placeholder = 'Description';
  taskDescription.addEventListener("input", () => {
    taskDescription.style.height = "auto"
    taskDescription.style.height = taskDescription.scrollHeight + "px"
  })

  let priorityDropdown = document.createElement('select');
  priorityDropdown.classList.add('edit-priority-dropdown');

  for (let i = 1; i <= 4; i++) {
    let option = document.createElement('option');
    option.classList.add(`priority-${i}`);
    option.value = i;
    option.textContent = `Priority ${i}`;
    priorityDropdown.appendChild(option);
  }

  let taskLocationDropdown = document.createElement('select');
  taskLocationDropdown.classList.add('edit-task-location-dropdown');

  let actionButtons = document.createElement('div');
  actionButtons.classList.add('edit-task-item-action-buttons');

  let cancelButton = document.createElement('button');
  cancelButton.classList.add('edit-task-item-cancel-button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'CANCEL';

  let saveButton = document.createElement('button');
  saveButton.classList.add('edit-task-item-save-button');
  saveButton.type = 'button';
  saveButton.textContent = 'SAVE';

  // taskTitleGrowWrap.appendChild(taskTitle);
  // dropdownsAndDueDateButton.append(taskLocationDropdown, priorityDropdown);
  actionButtons.append(cancelButton, saveButton)
  // dueDateContainer.append(dueDateSVG, dueDatePara);
  editTaskItemDialog.append(header, taskTitle, taskDescription, taskLocationDropdown, priorityDropdown);
  editTaskItemDialog.append(actionButtons);

  // activateDueDateButtonOnClick(dueDateContainer);
  addEventListenerPriorityDropdown(priorityDropdown);
  activateEditTaskItemDialogActionButtons(cancelButton, saveButton, taskTitle);

  populateTaskLocationDropdown(taskLocationDropdown);
  window.addEventListener('projectAddedToLocalStorage', () => {
    populateTaskLocationDropdown(taskLocationDropdown);
  })
  
  return editTaskItemDialog;
}

function activateEditTaskItemDialogActionButtons(cancelButton, saveButton, taskTitle) {
  let dateTimeDialog = sharedElements.dateTimeDialog;

  cancelButton.addEventListener('click', () => {
    closeEditTaskItemDialog();
    removeHighlightedTaskItem();
  })

  saveButton.addEventListener('click', () => {
    if (taskTitle.value.length === 0) {
      taskTitle.setCustomValidity('Title must be at least one character.');
      taskTitle.reportValidity();
    } else {
      saveTaskItemDataToLocalStorage();
      updateSingleTaskItem()
      closeEditTaskItemDialog();
      removeHighlightedTaskItem();
    }
  })

  // remove error message if one is displayed while user is typing
  taskTitle.addEventListener('input', (e) => {
    if (e.target.validity.customError) {
      e.target.setCustomValidity('');
    } 
  });
}

function saveTaskItemDataToLocalStorage() {
  let taskTitle = document.querySelector('.edit-task-title');
  let taskDescription = document.querySelector('.edit-task-description');
  let dueDatePara = document.querySelector('.task-due-date-para');
  let dueDate = document.querySelector('.task-due-date-input');
  let dueDateFlatpickrInput = document.querySelector('.task-due-date-input.flatpickr-input');
  let dueDateTime = document.querySelector('.task-time-input');
  let priorityDropdown = document.querySelector('.edit-priority-dropdown');
  let taskLocationDropdown = document.querySelector('.edit-task-location-dropdown');
  let calendarIcon = document.querySelector('.calendar-svg');
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  let index = taskList.findIndex((task) => parseInt(task.id) == parseInt(editTaskItem.id));
  console.log(index);
  let taskToBeUpdated = taskList[index];

  taskToBeUpdated.title = taskTitle.value;
  taskToBeUpdated.description = taskDescription.value;
  taskToBeUpdated.dueDate = dueDate.value;
  taskToBeUpdated.priority = priorityDropdown.value;
  taskToBeUpdated.dueDateTime = dueDateTime.value;
  taskToBeUpdated.taskLocation = taskLocationDropdown.value;

  localStorage.setItem('taskList', JSON.stringify(taskList));
}

export function setEditTaskItemDialogInputs(task) {
  let taskTitle = document.querySelector('.edit-task-title');
  let taskDescription = document.querySelector('.edit-task-description');
  let dueDatePara = document.querySelector('.task-due-date-para');
  let dueDate = document.querySelector('.task-due-date-input');
  let priorityDropdown = document.querySelector('.edit-priority-dropdown');
  let taskLocationDropdown = document.querySelector('.edit-task-location-dropdown');

  editTaskItem = task;
  taskTitle.value = task.title;
  taskDescription.value = task.description;
  setLastSavedDate(task.dueDate);
  dueDate._flatpickr.setDate(task.dueDate);
  setLastSavedTime(task.dueDateTime);
  priorityDropdown.value = task.priority;
  setCurrentPriorityValueWithCorrespondingColor(priorityDropdown);
  taskLocationDropdown.value = task.taskLocation;
  
  dueDatePara.textContent = 
  dateTimeDialog.getFormattedTextBasedOnDateTime(getLastSavedDate(), getLastSavedTime());
  console.log('color: ' + dateTimeDialog.getColorBasedOnDateTime(getLastSavedDate(), getLastSavedTime()));
  setCalendarIconColor(dateTimeDialog.getColorBasedOnDateTime(getLastSavedDate(), getLastSavedTime()));

  // remove previous color
  for (let i = 0; i < dueDatePara.classList.length; i++) {
    if (dueDatePara.classList[i] !== 'task-due-date-para') {
      dueDatePara.classList.remove(dueDatePara.classList[i]);
    }
  }
  
  dueDatePara.classList.add(dateTimeDialog.getClasslistBasedOnDateTime(getLastSavedDate(), getLastSavedTime()));
}

export function showEditTaskItemDialog() {
  let dialog = document.querySelector('.edit-task-item-dialog');
  let taskLocationDropdown = document.querySelector('.edit-task-location-dropdown');
  let dueDateButton = document.querySelector('.task-due-date-button-container');
  let taskDescription = document.querySelector('.edit-task-description');
  let taskTitle = document.querySelector('.edit-task-title');

  // console.log('textarea rows: ' + calculateTextareaRows(taskTitle));
  // taskTitle.style.height = 'auto';
  // taskTitle.style.height = taskTitle.scrollHeight + 'px';
  // taskDescription.style.height = taskTitle.scrollHeight + 'px';
  if (dialog.querySelector('.task-due-date-button-container') === null) {
    dialog.insertBefore(dueDateButton, taskLocationDropdown);
  } 

  dialog.showModal();
  console.log(taskTitle.scrollHeight)
  // set title and description to height of content
  taskTitle.style.height = 'auto';
  taskTitle.style.height = taskTitle.scrollHeight + 'px';
  taskDescription.style.height = 'auto';
  taskDescription.style.height = taskDescription.scrollHeight + 'px';
}

export function closeEditTaskItemDialog() {
  let dialog = document.querySelector('.edit-task-item-dialog');
  dialog.close();
}

export default createEditTaskItemDialog;