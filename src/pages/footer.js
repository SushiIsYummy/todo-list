import { DateTime } from 'luxon';
import sendButtonSVG from '../svgs/send.svg';
import calendarSVG from '../svgs/calendar-outline.svg';
import { moveInboxListDown } from './inbox';
import { addTaskToLocalStorage, createTask } from './tasks';
import flatpickr from 'flatpickr';

let taskList = [];

// more locations after user adds projects.
let locationForTasks = ['Inbox'];

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

  // footerBar.style.height = '400px';
  footerContainer.appendChild(createFooterBarWithHamburgerMenu());
  content.appendChild(footerContainer);

  activateAddTaskButton();
  handleAddTaskDialogOutsideClick();
  // activateDueDateButton();
  activateDueDateTime();
  addEventListenerPriorityDropdown();
  activateDiscardChangesButtons();
  addEventListenerTaskTitle();
  // activateSendButton();
  addEventListenerSubmitForm();
  activateHamburgerMenu();
  customizeFlatpickrDateInput();
  // customizeFlatpickrTimeInput();
  adjustDateInputWidthToPlaceHolderWidth();

  let priorityDropdown = document.querySelector('.priority-dropdown');

  // let dialog = document.querySelector('.discard-changes-dialog');
  // dialog.close();

  let form = document.querySelector('.footer-add-task-form');
  // console.log(taskList[0]);

  // store default values of form elements and the form elements themselves
  Array.from(form.elements).forEach(element => {
    if (element.tagName !== 'BUTTON' && element.tagName !== 'OBJECT' &&
        element.tagName !== 'IFRAME' &&
        !element.matches('.task-due-date.form-control') && 
        !element.classList.contains('flatpickr-monthDropdown-months') && 
        !element.classList.contains('numInput')) {
      addTaskFormElementDefaultValues.push(element.value);
      addTaskFormElements.push(element);
      console.log(element);
    }
  })

  console.log('addTaskFormElements: ' + addTaskFormElements);
  // console.log('addTaskFormElementDefaultValues: ' + addTaskFormElementDefaultValues);
  let dialog = document.querySelector('.footer-add-task-dialog');
  // dialog.showModal();
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

function activateHamburgerMenu() {
  let hamburgerMenu = document.querySelector('.hamburger-menu');
  let sidebarDialog = document.querySelector('.sidebar-dialog');

  hamburgerMenu.addEventListener('click', () => {
    sidebarDialog.showModal();
  })
}

export function getAddTaskDialogHeight() {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  return addTaskDialog.offsetHeight;
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
      addTaskToLocalStorage(task);
      clearAddTaskForm();
      form.querySelector('.task-title').focus();
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

  for (let i = 0; i < locationForTasks.length; i++) {
    let option = document.createElement('option');
    option.classList.add('option-item');
    option.value = locationForTasks[i].toLowerCase();
    option.textContent = locationForTasks[i];

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

// function customizeFlatpickrTimeInput() {
//   console.log(document.querySelector('custom-time-picker'));
//   const timepicker = flatpickr('.task-due-date-time', {
//     enableTime: true,
//     noCalendar: true,
//     dateFormat: "H:i", // Use a 24-hour time format (e.g., "14:30")
//     // time_24hr: true, // Use a 24-hour time format
//     static: true,
//     appendTo: document.querySelector('.custom-time-picker'),
//   })
// }

function customizeFlatpickrDateInput() {
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
        dialog.style.top = `calc(100% - ${getAddTaskDialogHeight()}px - ${calendarHeight} + ${bottomRowHeight})`;
        
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
        dialog.style.top =  `calc(100% - ${getAddTaskDialogHeight()}px)`;

        formatDateInputText();
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
      setDateToToday();
      formatDateInputText();
    }
    adjustDateInputWidthToContentWidth();
  })

  let dueDateContainer = document.querySelector('.task-due-date-container');
  dueDateContainer.addEventListener('click', function () {
    datepicker.open();
  })

  
}

function setDateToToday() {
  let dueDate = document.querySelector('.task-due-date');

  let now = DateTime.now();
  let todayDate = now.toFormat('YYYY-MM-DD');
  console.log(todayDate);
  dueDate.value = DateTime.now().toFormat('yyyy-MM-dd');
}

function adjustDateInputWidthToContentWidth() {
  let dueDateAltInput = document.querySelector('.task-due-date.form-control');
  let dueDateSpan = document.createElement('span');
  dueDateSpan.style.visibility = 'hidden';

  document.body.appendChild(dueDateSpan);
  dueDateSpan.textContent = dueDateAltInput.value;

  let contentWidth = dueDateSpan.offsetWidth;
  // console.log('client width: ' + contentWidth);
  if (dueDateAltInput.value === '') {
    let dueDatePlaceholder = dueDateAltInput.placeholder;
    dueDateSpan.textContent = dueDatePlaceholder;
    contentWidth = dueDateSpan.offsetWidth;
  }

  dueDateAltInput.style.width = `${contentWidth}px`;
  document.body.removeChild(dueDateSpan);
}

// note: only usable when the add task dialog is opened since the
// calendar svg is in the dialog and it is not loaded until it is
// opened.
function setCalendarIconColor(color) {
  const svgIframe = document.querySelector('.calendar-svg');
  const svgIframeWindow = svgIframe.contentWindow;
  const svgIframeDocument = svgIframeWindow.document;
  const pathElement = svgIframeDocument.querySelector('svg');
  pathElement.style.fill = color;
}

function changeDateInputTextColor(color) {
  let dateInput = document.querySelector('.task-due-date.form-control');
  dateInput.style.color = color;
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
    setCalendarIconColor('#757575');
    // set add task dialog at the bottom of page
    // dialog.style.top =  `calc(100% - ${getAddTaskDialogHeight()}px)`;
    // dialog.style.bottom = 0;
  })
}

function activateDueDateTime() {
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

function formatDateInputText() {
  let dueDate = document.querySelector('.task-due-date');

  if (dueDate.value !== '') {
      let altInput = document.querySelector('.task-due-date.form-control');
      const calendarInput = document.querySelector('.task-due-date');
      console.log('calendar input: ' + calendarInput.value);
      const selectedDate = DateTime.fromISO(calendarInput.value);

      let dayNumber = selectedDate.toFormat('d');
      const formattedDay = selectedDate.toFormat('cccc'); // Day of the week
      const formattedYear = selectedDate.toFormat('yyyy'); // Year
      const formattedMonth = selectedDate.toFormat('LLLL'); // Month
      
      console.log('Selected Day:', formattedDay);
      console.log('Selected Year:', formattedYear);
      console.log('Selected Month:', formattedMonth);
      
      const currentYear = DateTime.now().toFormat('yyyy');

      const relativeDate = selectedDate.toRelative();
      console.log(selectedDate.toRelative());

      if (relativeDate.endsWith('hours ago')) {
        altInput.value = 'Today';
        setCalendarIconColor('green');
        changeDateInputTextColor('green');
      } else if (/^in \d+ hours$/.test(relativeDate)) {
        altInput.value = 'Tomorrow';
        setCalendarIconColor('#CC6600');
        changeDateInputTextColor('#CC6600');
      } else if (/^in [1-5] day(s)?$/.test(relativeDate)) {
        altInput.value = formattedDay;
        setCalendarIconColor('purple');
        changeDateInputTextColor('purple');
      } else if (formattedYear > currentYear){
        altInput.value = `${formattedMonth.slice(0,3)} ${dayNumber} ${formattedYear}`
        setCalendarIconColor('#757575');
        changeDateInputTextColor('#757575');
      } else {
        altInput.value = `${formattedMonth.slice(0,3)} ${dayNumber}`;
        setCalendarIconColor('#757575');
        changeDateInputTextColor('#757575');
      }
  } else {
    // Clear button is clicked
    const calendarInput = document.querySelector('.task-due-date');

    // dueDateButtonPara.textContent = 'No Date';
    console.log(calendarInput.value);
    console.log('clear');
  }

  // })
}

function handleAddTaskDialogOutsideClick() {
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
      if (allElementsAreUntouched()) {
        hideAddTaskDialog();
        clearAddTaskForm();
      } else {
        let discardChangesDialog = document.querySelector('.discard-changes-dialog');
        discardChangesDialog.showModal();
      }
    }
  });
  
}

function handleDiscardChangesDialogOutsideClick() {

}

function hideAddTaskDialog() {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  addTaskDialog.classList.add('hide');

  let inboxListDiv = document.querySelector('.inbox-list-div');
  console.log('inbox list div: ' + inboxListDiv);
  if (inboxListDiv !== null) {
    inboxListDiv.classList.add('hide');
  }

  addTaskDialog.addEventListener('animationend', dialogAnimationEnd);
  // clearAddTaskForm();
}

function dialogAnimationEnd() {
  let dialog = document.querySelector('.footer-add-task-dialog');
  dialog.close();
  dialog.classList.remove('hide');
  dialog.removeEventListener('animationend', dialogAnimationEnd);
  // clearAddTaskForm();
}

function adjustDateInputWidthToPlaceHolderWidth() {
  let dueDateAltInput = document.querySelector('.task-due-date.form-control');
  let dueDateSpan = document.createElement('span');
  let dueDatePlaceholder = dueDateAltInput.placeholder;

  dueDateSpan.style.visibility = 'hidden';
  document.body.appendChild(dueDateSpan);
  dueDateSpan.textContent = dueDatePlaceholder;

  let dueDatePaddingLeft = parseInt(getComputedStyle(dueDateAltInput).paddingLeft);
  let contentWidth = dueDateSpan.offsetWidth;

  dueDateAltInput.style.width = `${contentWidth + dueDatePaddingLeft}px`;
  document.body.removeChild(dueDateSpan);
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
    clearAddTaskForm();
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

  let dueDateFlatpickr = document.querySelector('.task-due-date')._flatpickr;

  // empty the flatpickr alt input
  let dueDateFlatpickrInput = document.querySelector('.task-due-date.flatpickr-input');
  dueDateFlatpickrInput.value = '';

  adjustDateInputWidthToPlaceHolderWidth();
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

  // reset option to last option which is priority 4
  // priorityDropdown.value = priorityDropdown.options[priorityDropdown.options.length-1].value;
  
  // let colorOfLastOption = getComputedStyle(priorityDropdown.options[priorityDropdown.options.length-1]).color;
  // priorityDropdown.style.color = colorOfLastOption;

}

export default createFooter;