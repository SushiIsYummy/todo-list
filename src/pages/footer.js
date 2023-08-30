import sendButtonSVG from '../svgs/send.svg';
import { createTask } from './tasks';

let taskList = [];

let locationForTasks = ['Inbox', 'Projects'];

// console.log('local storage: ' + JSON.parse(localStorage.getItem('sidebarItems'))[0]);

let addTaskFormElementDefaultValues = [];
let addTaskFormElements = [];

// localStorage.setItem('touchedElements', '{}');

function createFooter() {
  let content = document.querySelector('#content');

  let footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');
  
  // inboxContainer.appendChild(createHeader());
  footerContainer.appendChild(createAddTaskButton());
  footerContainer.appendChild(createAddTaskDialog());
  footerContainer.appendChild(createDiscardChangesDialog());
  content.appendChild(footerContainer);

  activateAddTaskButton();
  addEventListenerAddTaskDialog();
  activateDueDateButton();
  addEventListenerPriorityDropdown();
  activateDiscardChangesButtons();
  addEventListenerTaskTitle();
  // activateSendButton();
  addEventListenerSubmitForm();

  let priorityDropdown = document.querySelector('.priority-dropdown');

  // let dialog = document.querySelector('.discard-changes-dialog');
  let dialog = document.querySelector('.footer-add-task-dialog');
  // dialog.close();
  // dialog.showModal();

  let form = document.querySelector('.footer-add-task-form');
  // console.log(taskList[0]);

  // store default values of form elements and the form elements themselves
  Array.from(form.elements).forEach(element => {
    if (element.tagName !== 'BUTTON' && element.tagName !== 'OBJECT') {
      addTaskFormElementDefaultValues.push(element.value);
      addTaskFormElements.push(element);
    }
  })

}

// Checks if the title is empty or not
// If title is empty, the add button is disabled.
// Otherwise, it is enabled.
function addEventListenerTaskTitle() {
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

// adds a Task when send button is active and clicked
function addEventListenerSubmitForm() {
  let form = document.querySelector('.footer-add-task-form');
  let sendButton = document.querySelector('.send-button');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (sendButton.classList.contains('active')) {
      let task = createTask(addTaskFormElements);
      
      // add task to local storage
      if (localStorage.getItem('taskList') === null) {
        let taskList = [];
        taskList.push(task);
        localStorage.setItem('taskList', JSON.stringify(taskList));
      } else {
        let taskList = JSON.parse(localStorage.getItem('taskList'));
        taskList.push(task);
        localStorage.setItem('taskList', JSON.stringify(taskList));
      }

      clearAddTaskForm();
      sendButton.classList.remove('active');
    }
  })
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

  let dueDate = document.createElement('input');
  dueDate.type = 'date';
  dueDate.classList.add('task-due-date');
  dueDate.tabIndex = -1;
  
  let dueDateButton = document.createElement('button');
  dueDateButton.classList.add('task-due-date-button');
  dueDateButton.type = 'button';
  
  let dueDateButtonDate = document.createElement('p');
  dueDateButtonDate.classList.add('task-due-date-button-para');
  dueDateButtonDate.textContent = 'No Date';

  dueDateButton.appendChild(dueDate);
  dueDateButton.appendChild(dueDateButtonDate);

  let dueDateTime = document.createElement('input');
  dueDateTime.classList.add('task-due-date-time');
  dueDateTime.type = 'time';

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

  for (let i = 0; i < locationForTasks.length; i++) {
    let option = document.createElement('option');
    option.classList.add('option-item');
    option.value = locationForTasks[i].toLowerCase();
    option.textContent = locationForTasks[i];

    taskLocationDropdown.appendChild(option);
  }

  bottomRow.appendChild(taskLocationDropdown);
  bottomRow.appendChild(sendButton);
  
  sendButton.appendChild(buttonSVG);

  buttons.appendChild(dueDateButton);
  buttons.appendChild(dueDateTime);
  buttons.appendChild(priorityDropdown);

  form.append(title, description, buttons, bottomRow);
  dialog.appendChild(form);

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

function activateAddTaskButton() {
  let button = document.querySelector('.footer-add-task-button');

  button.addEventListener('click', () => {
    let dialog = document.querySelector('.footer-add-task-dialog');

    dialog.showModal();

    // set add task dialog at the bottom of page
    dialog.style.top =  `calc(100% - ${dialog.offsetHeight}px)`;
  })
}

function activateDueDateButton() {
  let dueDateButton = document.querySelector('.task-due-date-button');
  let dueDate = document.querySelector('.task-due-date');
  let dueDateButtonPara = document.querySelector('.task-due-date-button-para');

  dueDateButton.addEventListener('click', () => {
    dueDate.showPicker();
  });

  dueDate.addEventListener('change', () => {
    if (dueDate.value !== '') {
      
      import('luxon').then((Luxon) => {
        const calendarInput = document.querySelector('.task-due-date');
        console.log('calendar input: ' + calendarInput.value);
        const selectedDate = Luxon.DateTime.fromISO(calendarInput.value);

        // console.log("now: " + now);
        let dayNumber = selectedDate.toFormat('dd');
        const formattedDay = selectedDate.toFormat('cccc'); // Day of the week
        const formattedYear = selectedDate.toFormat('yyyy'); // Year
        const formattedMonth = selectedDate.toFormat('LLLL'); // Month
        
        console.log('Selected Day:', formattedDay);
        console.log('Selected Year:', formattedYear);
        console.log('Selected Month:', formattedMonth);
        
        const currentYear = Luxon.DateTime.now().toFormat('yyyy');

        if (dayNumber.slice(0,1) === '0') {
          dayNumber = dayNumber.slice(1);
          console.log('day number: ' + dayNumber);
        }

        if (formattedYear !== currentYear) {
          dueDateButtonPara.textContent = `${formattedMonth.slice(0,3)} ${dayNumber} ${formattedYear}`
        } else {
          dueDateButtonPara.textContent = `${formattedMonth.slice(0,3)} ${dayNumber}`
        }
      });
    } else {
      // Clear button is clicked
      const calendarInput = document.querySelector('.task-due-date');

      dueDateButtonPara.textContent = 'No Date';
      console.log(calendarInput.value);
      console.log('clear');
    }

  })
}

function addEventListenerAddTaskDialog() {
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
    console.log(isMouseOutsideModal);
    if (isMouseOutsideModal && 
      (event.clientX < modalArea.left ||
      event.clientX > modalArea.right ||
      event.clientY < modalArea.top ||
      event.clientY > modalArea.bottom)) {
      isMouseOutsideModal = false;
      if (allElementsAreUntouched()) {
        hideAddTaskDialog();
      } else {
        let discardChangesDialog = document.querySelector('.discard-changes-dialog');
        discardChangesDialog.showModal();
      }
    }
  });
  
}

function dialogAnimationEnd() {
  let dialog = document.querySelector('.footer-add-task-dialog');
  dialog.close();
  dialog.classList.remove('hide');
  dialog.removeEventListener('animationend', dialogAnimationEnd);
  clearAddTaskForm();
}

function hideAddTaskDialog() {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  addTaskDialog.classList.add('hide');
  addTaskDialog.addEventListener('animationend', dialogAnimationEnd);
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

function activateDiscardChangesButtons() {
  let discardChangesDialog = document.querySelector('.discard-changes-dialog');
  let cancelButton = document.querySelector('.discard-changes-cancel-button');
  let discardButton = document.querySelector('.discard-changes-discard-button');

  cancelButton.addEventListener('click', () => {
    discardChangesDialog.close();
  });

  discardButton.addEventListener('click', () => {
    let addTaskDialog = document.querySelector('.footer-add-task-dialog');
    let discardChangesDialog = document.querySelector('.discard-changes-dialog');
    hideAddTaskDialog();
    discardChangesDialog.close();
    // clearAddTaskForm();
  });

}

function allElementsAreUntouched() {

  for (let i = 0; i < addTaskFormElementDefaultValues.length; i++) {
    if (addTaskFormElementDefaultValues[i] !== addTaskFormElements[i].value) {
      return false;
    }
    // console.log('element value: ' + addTaskFormElements[i].value);
    // console.log('default value: ' + addTaskFormElementDefaultValues[i]);  
  }
  return true;
}

function clearAddTaskForm() {
  let form = document.querySelector('.footer-add-task-form');
  form.reset();

  localStorage.setItem('touchedElements', '{}');
  // let title = document.querySelector('.task-title');
  // title.value = '';

  // let description = document.querySelector('.task-description');
  // description.value = '';

  // let dueDate = document.querySelector('.task-due-date');
  // dueDate.value = '';
  
  // let dueDateButton = document.querySelector('.task-due-date-button');

  let dueDateButtonPara = document.querySelector('.task-due-date-button-para');
  dueDateButtonPara.textContent = 'No Date';

  // let dueDateTime = document.querySelector('.task-due-date-time');
  // dueDateTime.value = '';

  let priorityDropdown = document.querySelector('.priority-dropdown');
  priorityDropdown.classList.forEach(className => {
    if (/^priority-\d-color$/.test(className)) {
      priorityDropdown.classList.remove(className);
    }
  })

  // reset to last option's color (priority 4)
  priorityDropdown.classList.add(`priority-${priorityDropdown.value}-color`);

  // reset option to last option which is priority 4
  // priorityDropdown.value = priorityDropdown.options[priorityDropdown.options.length-1].value;
  
  // let colorOfLastOption = getComputedStyle(priorityDropdown.options[priorityDropdown.options.length-1]).color;
  // priorityDropdown.style.color = colorOfLastOption;

}

export default createFooter;