import addButtonSVG from '../svgs/send.svg';

let taskList = [];

let locationForTasks = ['Inbox', 'Projects'];

// console.log('local storage: ' + JSON.parse(localStorage.getItem('sidebarItems'))[0]);

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

  let priorityDropdown = document.querySelector('.priority-dropdown');

  let dialog = document.querySelector('.discard-changes-dialog');
  // let dialog = document.querySelector('.footer-add-task-dialog');
  // dialog.close();
  // dialog.showModal();
}

// function createTaskList() {

// }

function addTask() {
  // taskList.push(task);
}

const Task = (title, description, dueDate, priority, checkList) => {

  return { title, description, dueDate, priority, checkList };
}

function openAddTaskForm() {

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

  let priority = document.createElement('select');
  priority.classList.add('priority-dropdown');

  for (let i = 1; i <= 4; i++) {
    let option = document.createElement('option');
    option.classList.add(`priority-${i}`);
    option.value = i;
    option.textContent = `Priority ${i}`;

    if (i === 4) {
      option.setAttribute('selected', true);
    }
    priority.appendChild(option);
  }

  let addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.classList.add('add-button');
  addButton.setAttribute('fill', 'white');

  let buttonSVG = document.createElement('object');
  buttonSVG.classList.add('add-button-svg');
  buttonSVG.setAttribute('data', addButtonSVG);
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

    let img = document.createElement('img');
    img.src = 'https://imgix.ranker.com/user_node_img/4373/87455191/original/satoru-gojo-u-495446080?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&bg=fff&h=150&w=150';

    option.appendChild(img);
    taskLocationDropdown.appendChild(option);
  }

  bottomRow.appendChild(taskLocationDropdown);
  bottomRow.appendChild(addButton);
  
  addButton.appendChild(buttonSVG);

  buttons.appendChild(dueDateButton);
  buttons.appendChild(dueDateTime);
  buttons.appendChild(priority);

  form.append(title, description, buttons, bottomRow);
  dialog.appendChild(form);

  return dialog;
}

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
      if (allElementsAreUntouched(form)) {
        dialog.classList.add('hide');
        dialog.addEventListener('animationend', dialogAnimationEnd);
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

function addEventListenerPriorityDropdown() {
  let priorityDropdown = document.querySelector('.priority-dropdown');

  // set color of initial selected item (priority 4)
  let currentOptionElement = document.querySelector(`.priority-${priorityDropdown.value}`);
  priorityDropdown.style.color = getComputedStyle(currentOptionElement).color;

  // change color of selected item to the user selected item
  priorityDropdown.addEventListener('change', () => {
    let dropdownOption = document.querySelector(`.priority-${priorityDropdown.value}`);
    priorityDropdown.style.color = getComputedStyle(dropdownOption).color;
  })
}

function activateDiscardChangesButtons() {
  let discardChangesDialog = document.querySelector('.discard-changes-dialog');
  let cancelButton = document.querySelector('.discard-changes-cancel-button');
  let discardButton = document.querySelector('.discard-changes-cancel-button');

  cancelButton.addEventListener('click', () => {
    discardChangesDialog.close();
  });

  discardButton.addEventListener('click', () => {
    discardChangesDialog.close();
  });

}

function allElementsAreUntouched(form) {
  console.log(form.elements.length);
  for (let i = 0; i < form.elements.length; i++) {
    const element = form.elements[i];
    console.log(element.touched);
    // Check if the element has been touched or modified
    if (element.touched || element.dirty) {
      return false; // At least one element has been touched
    }
  }

  return true; // All elements are untouched
}

function clearAddTaskForm() {
  let form = document.querySelector('.footer-add-task-form');
  form.reset();

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
  // // reset option to last option which is priority 4
  // priorityDropdown.value = priorityDropdown.options[priorityDropdown.options.length-1].value;
  
  let colorOfLastOption = getComputedStyle(priorityDropdown.options[priorityDropdown.options.length-1]).color;
  priorityDropdown.style.color = colorOfLastOption;

}

export default createFooter;