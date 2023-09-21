import { activateDueDateButtonOnClick, addEventListenerPriorityDropdown, populateTaskLocationDropdown, setCalendarIconColor, setCurrentPriorityValueWithCorrespondingColor } from './addTaskDialog';
import { getLastSavedTime, getLastSavedDate, resetLastSavedDateAndTime, setLastSavedDate, setLastSavedTime } from './dateTimeDialog';
import sharedElements from './sharedElements';
import calendarSVG from '/src/svgs/calendar-outline.svg';
import * as dateTimeDialog from '/src/pages/dialogs/dateTimeDialog';
import { getTaskListFromLocalStorage, removeHighlightedFromTaskItem, removeHighlightedTaskFromDOM, removeHighlightedTaskFromLocalStorage } from '../tasks';
import { updateSingleTaskItem } from '/src/pages/task-list-updater';
import { calculateTextareaRows, createKebabMenu, setTextAreaHeightToContentHeight, textareaAutoResize } from '../../utils';

let editTaskItem = null;

function createEditTaskItemDialog() {
  let editTaskItemDialog = document.createElement('dialog');
  editTaskItemDialog.classList.add('edit-task-item-dialog');

  let header = document.createElement('h1');
  header.classList.add('edit-task-item-header');
  header.textContent = 'Edit Task';

  let kebabMenu = createKebabMenu(['Delete Task']);

  let headerAndKebab = document.createElement('div');
  headerAndKebab.classList.add('header-and-kebab');

  // growing textarea
  // https://codepen.io/devrasta07/pen/GRMPMGG

  let taskTitle = document.createElement('textarea');
  taskTitle.classList.add('edit-task-title');
  taskTitle.rows = '1';
  taskTitle.placeholder = 'Title';
  taskTitle.classList.add('overflow-y-hidden');
  taskTitle.addEventListener('input', textareaAutoResize);

  let taskDescription = document.createElement('textarea');
  taskDescription.classList.add('edit-task-description');
  taskDescription.rows = '1';
  taskDescription.placeholder = 'Description';
  taskDescription.classList.add('overflow-y-hidden');
  taskDescription.addEventListener('input', textareaAutoResize);

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

  headerAndKebab.append(header, kebabMenu);
  actionButtons.append(cancelButton, saveButton)
  editTaskItemDialog.append(headerAndKebab, taskTitle, taskDescription, taskLocationDropdown, priorityDropdown);
  editTaskItemDialog.append(actionButtons);

  activateKebabMenuOptions(editTaskItemDialog);
  addEventListenerPriorityDropdown(priorityDropdown);
  activateEditTaskItemDialogActionButtons(cancelButton, saveButton, taskTitle);

  populateTaskLocationDropdown(taskLocationDropdown);
  window.addEventListener('projectAddedRemovedRenamed', () => {
    populateTaskLocationDropdown(taskLocationDropdown);
  })
  
  return editTaskItemDialog;
}

function activateEditTaskItemDialogActionButtons(cancelButton, saveButton, taskTitle) {
  let dateTimeDialog = sharedElements.dateTimeDialog;

  cancelButton.addEventListener('click', () => {
    closeEditTaskItemDialog();
    removeHighlightedFromTaskItem();
  })

  saveButton.addEventListener('click', () => {
    if (taskTitle.value.length === 0) {
      taskTitle.setCustomValidity('Title must be at least one character.');
      taskTitle.reportValidity();
    } else {
      saveTaskItemDataToLocalStorage();
      updateSingleTaskItem()
      closeEditTaskItemDialog();
      removeHighlightedFromTaskItem();
    }
  })

  // remove error message if one is displayed while user is typing
  taskTitle.addEventListener('input', (e) => {
    if (e.target.validity.customError) {
      e.target.setCustomValidity('');
    } 
  });
}

function activateKebabMenuOptions(dialog) {
  let kebabMenuList = dialog.querySelector('.kebab-menu .menu-list');

  kebabMenuList.addEventListener('click', (e) => {
    let clickedElement = e.target;
    console.log(clickedElement);
    if (clickedElement.tagName === 'LI' && clickedElement.classList.contains('delete-task')) {
      closeEditTaskItemDialog();
      removeHighlightedTaskFromLocalStorage();
      removeHighlightedTaskFromDOM();
    } else if (clickedElement.tagName !== 'LI') {
      let liElement = clickedElement.closest('li');
      if (liElement) {
        if (liElement.classList.contains('delete-task')) {
          closeEditTaskItemDialog();
          removeHighlightedTaskFromLocalStorage();
          removeHighlightedTaskFromDOM();
        }
      }
    }
  })

  
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
  let taskList = getTaskListFromLocalStorage();

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

  if (dialog.querySelector('.task-due-date-button-container') === null) {
    dialog.insertBefore(dueDateButton, taskLocationDropdown);
  } 

  dialog.showModal();

  // set title and description to height of content
  setTextAreaHeightToContentHeight(taskTitle);
  setTextAreaHeightToContentHeight(taskDescription);
}

export function closeEditTaskItemDialog() {
  let dialog = document.querySelector('.edit-task-item-dialog');
  dialog.close();
}

export default createEditTaskItemDialog;