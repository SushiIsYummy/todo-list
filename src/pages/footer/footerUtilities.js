import { DateTime } from 'luxon';
import sendButtonSVG from '../../svgs/send.svg';
import calendarSVG from '../../svgs/calendar-outline.svg';
import { addTaskToLocalStorage, createTask } from '../tasks';
import flatpickr from 'flatpickr';

import * as footerEL from './footerEventHandlers';
export let addTaskFormElementDefaultValues = [];
export let addTaskFormElements = [];
// more locations after user adds projects.
export let locationForTasks = ['Inbox'];

export function getAddTaskDialogHeight() {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  return addTaskDialog.offsetHeight;
}

export function setDateToToday() {
  let dueDate = document.querySelector('.task-due-date');

  let now = DateTime.now();
  let todayDate = now.toFormat('YYYY-MM-DD');
  console.log(todayDate);
  dueDate.value = DateTime.now().toFormat('yyyy-MM-dd');
}

export function adjustDateInputWidthToContentWidth() {
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
export function setCalendarIconColor(color) {
  const svgIframe = document.querySelector('.calendar-svg');
  const svgIframeWindow = svgIframe.contentWindow;
  const svgIframeDocument = svgIframeWindow.document;
  const pathElement = svgIframeDocument.querySelector('svg');
  pathElement.style.fill = color;
}

export function changeDateInputTextColor(color) {
  let dateInput = document.querySelector('.task-due-date.form-control');
  dateInput.style.color = color;
}

export function formatDateInputText() {
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

      const relativeDate = selectedDate.toRelativeCalendar();
      console.log('relative date: ' + selectedDate.toRelative());

      if (relativeDate === 'today') {
        // console.log(relativeDate)
        altInput.value = 'Today';
        setCalendarIconColor('green');
        changeDateInputTextColor('green');
      } else if (relativeDate === 'tomorrow') {
        altInput.value = 'Tomorrow';
        setCalendarIconColor('#CC6600');
        changeDateInputTextColor('#CC6600');
      } else if (/^in [1-6] day(s)?$/.test(relativeDate)) {
        altInput.value = formattedDay;
        setCalendarIconColor('purple');
        changeDateInputTextColor('purple');
      } else if (formattedYear > currentYear){
        altInput.value = `${formattedMonth.slice(0,3)} ${dayNumber} ${formattedYear}`
        setCalendarIconColor('#646464');
        changeDateInputTextColor('#646464');
      } else {
        altInput.value = `${formattedMonth.slice(0,3)} ${dayNumber}`;
        setCalendarIconColor('#646464');
        changeDateInputTextColor('#646464');
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

export function hideAddTaskDialog() {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  addTaskDialog.classList.add('hide');

  let inboxListDiv = document.querySelector('.inbox-list-div');
  console.log('inbox list div: ' + inboxListDiv);
  if (inboxListDiv !== null) {
    inboxListDiv.classList.add('hide');
  }

  addTaskDialog.addEventListener('animationend', footerEL.dialogAnimationEnd);
  // clearAddTaskForm();
}

export function adjustDateInputWidthToPlaceHolderWidth() {
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

export function allElementsAreUntouched() {

  for (let i = 0; i < addTaskFormElementDefaultValues.length; i++) {
    if (addTaskFormElementDefaultValues[i] !== addTaskFormElements[i].value) {
      return false;
    }
    // console.log('element value: ' + addTaskFormElements[i].value);
    // console.log('default value: ' + addTaskFormElementDefaultValues[i]);  
  }
  return true;
}

export function clearAddTaskForm() {
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

// store default values of form elements and the form elements themselves
export function storeFormElementsAndDefaultValues() {
  let form = document.querySelector('.footer-add-task-form');
  Array.from(form.elements).forEach(element => {
    if (element.tagName !== 'BUTTON' && element.tagName !== 'OBJECT' &&
        element.tagName !== 'IFRAME' &&
        !element.matches('.task-due-date.form-control') && 
        !element.classList.contains('flatpickr-monthDropdown-months') && 
        !element.classList.contains('numInput')) {
      addTaskFormElementDefaultValues.push(element.value);
      addTaskFormElements.push(element);
      // console.log(element);
    }
  })
}