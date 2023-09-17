import { activateDueDateButtonOnClick, addEventListenerPriorityDropdown, populateTaskLocationDropdown, setCalendarIconColor, setCurrentPriorityValueWithCorrespondingColor } from './addTaskDialog';
import { getLastSavedTime, getLastSavedDate, resetLastSavedDateAndTime, setLastSavedDate, setLastSavedTime } from './dateTimeDialog';
import sharedElements from './sharedElements';
import calendarSVG from '/src/svgs/calendar-outline.svg';
import * as dateTimeDialog from '/src/pages/dialogs/dateTimeDialog';
import { removeHighlightedTaskItem, updateSingleTaskItem } from '../tasks';

let editTaskItem = null;

function createEditTaskItemDialog() {
  let editTaskItemDialog = document.createElement('dialog');
  editTaskItemDialog.classList.add('edit-task-item-dialog');

  let taskTitle = document.createElement('input');
  taskTitle.classList.add('edit-task-title');
  taskTitle.type = 'text';
  taskTitle.placeholder = 'Title';

  let taskDescription = document.createElement('input');
  taskDescription.classList.add('edit-task-description');
  taskDescription.type = 'text';
  taskDescription.placeholder = 'Description';

  let buttons = document.createElement('div');
  buttons.classList.add('edit-date-and-priority-buttons');

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

  let cancelButton = document.createElement('button');
  cancelButton.classList.add('edit-task-item-cancel-button');
  cancelButton.type = 'button';
  cancelButton.textContent = 'CANCEL';

  let saveButton = document.createElement('button');
  saveButton.classList.add('edit-task-item-save-button');
  saveButton.type = 'button';
  saveButton.textContent = 'SAVE';

  // dueDateContainer.append(dueDateSVG, dueDatePara);
  editTaskItemDialog.append(taskTitle, taskDescription, priorityDropdown, taskLocationDropdown);
  editTaskItemDialog.append(cancelButton, saveButton);

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
  let cancelButton = document.querySelector('.edit-task-item-cancel-button');
  let dueDateButton = document.querySelector('.task-due-date-button-container');

  if (dialog.querySelector('.task-due-date-button-container') === null) {
    dialog.insertBefore(dueDateButton, cancelButton);
  } 

  dialog.showModal();
}

export function closeEditTaskItemDialog() {
  let dialog = document.querySelector('.edit-task-item-dialog');
  dialog.close();
}

export default createEditTaskItemDialog;