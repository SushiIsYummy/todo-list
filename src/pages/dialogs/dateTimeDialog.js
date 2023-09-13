import flatpickr from "flatpickr";
import { DateTime } from 'luxon';
import sharedDialogElements from "./sharedDialogElements";
import { setCalendarIconColor } from "./addTaskDialog";

let lastSavedDate = '';
let lastSavedTime = '';

function createDateTimeDialog() {
  let content = document.querySelector('#content');

  let dateTimeDialog = document.createElement('dialog');
  dateTimeDialog.classList.add('task-date-time-dialog');

  let dueDateInputContainer = document.createElement('div');
  dueDateInputContainer.classList.add('task-due-date-input-container');

  let dueDateInput = document.createElement('input');
  dueDateInput.classList.add('task-due-date-input');
  dueDateInput.placeholder = 'No Date';

  let dueDateInputButtons = document.createElement('div')
  dueDateInputButtons.classList.add('task-due-date-input-buttons');

  let dueDateTodayButton = document.createElement('button');
  dueDateTodayButton.classList.add('task-due-date-today-button');
  dueDateTodayButton.type = 'button';
  dueDateTodayButton.textContent = 'Today';

  let dueDateClearButton = document.createElement('button');
  dueDateClearButton.classList.add('task-due-date-clear-button');
  dueDateClearButton.type = 'button';
  dueDateClearButton.textContent = 'Clear Date';

  let timeInputContainer = document.createElement('div');
  timeInputContainer.classList.add('task-time-input-container');

  let timeInput = document.createElement('input');
  timeInput.classList.add('task-time-input');
  timeInput.type = 'time';

  let timeClearButton = document.createElement('button');
  timeClearButton.classList.add('task-time-clear-button');
  timeClearButton.type = 'button';
  timeClearButton.textContent = '✖';

  let dateTimeActionButtons = document.createElement('div');
  dateTimeActionButtons.classList.add('task-date-time-dialog-action-buttons');

  let cancelButton = document.createElement('button');
  cancelButton.classList.add('task-date-time-dialog-cancel-button');
  cancelButton.textContent = 'CANCEL';
  
  let saveButton = document.createElement('button');
  saveButton.classList.add('task-date-time-dialog-save-button');
  saveButton.textContent = 'SAVE';
  
  dueDateInputButtons.append(dueDateTodayButton, dueDateClearButton);

  dueDateInputContainer.appendChild(dueDateInput);
  dueDateInputContainer.appendChild(dueDateInputButtons);
  
  timeInputContainer.appendChild(timeInput);
  timeInputContainer.appendChild(timeClearButton);
  
  dateTimeActionButtons.append(cancelButton, saveButton);

  dateTimeDialog.appendChild(dueDateInputContainer);
  dateTimeDialog.appendChild(timeInputContainer);
  dateTimeDialog.appendChild(dateTimeActionButtons);
  
  content.appendChild(dateTimeDialog);

  initializeFlatpickrDateInput();
  activateDateTimeDialogActionButtons();
  activateTimeInputClearButton();
  activateDueDateInputTodayButton();
  activateDueDateInputClearButton();
}

function initializeFlatpickrDateInput() {
  let datepicker = flatpickr('.task-due-date-input', {
    minDate: 'today',
    altInput: true,
    inline: true,
  })
}

function activateTimeInputClearButton() {
  let clearButton = document.querySelector('.task-time-clear-button');
  let timeInput = document.querySelector('.task-time-input');
  clearButton.addEventListener('click', () => {
    console.log(timeInput.value);
    timeInput.value = '';
  });
}

function activateDateTimeDialogActionButtons() {  
  let timeInput = document.querySelector('.task-time-input');
  let dueDateInput = document.querySelector('.task-due-date-input');
  let dateTimeDialog = document.querySelector('.task-date-time-dialog');
  let cancelButton = document.querySelector('.task-date-time-dialog-cancel-button');
  let saveButton = document.querySelector('.task-date-time-dialog-save-button');

  cancelButton.addEventListener('click', () => {
    dueDateInput._flatpickr.setDate(getLastSavedDate());
    dateTimeDialog.close();
    console.log('date: ' + getLastSavedDate());
    console.log('time: ' + getLastSavedTime());
  });
  
  saveButton.addEventListener('click', () => {
    let dateRequiredDialog = document.querySelector('.date-required-dialog');
    if (onlyTimeIsSet()) {
      dateRequiredDialog.showModal();
      return;
    } 

    setLastSavedDate(dueDateInput.value);
    setLastSavedTime(timeInput.value);
    sharedDialogElements.dueDatePara.textContent = 
    getFormattedTextBasedOnDateTime(getLastSavedDate(), getLastSavedTime());
    setCalendarIconColor(getColorBasedOnDateTime(getLastSavedDate(), getLastSavedTime()));

    // remove previous color
    for (let i = 0; i < sharedDialogElements.dueDatePara.classList.length; i++) {
      if (sharedDialogElements.dueDatePara.classList[i] !== 'task-due-date-para') {
        sharedDialogElements.dueDatePara.classList.remove(sharedDialogElements.dueDatePara.classList[i]);
      }
    }

    sharedDialogElements.dueDatePara.classList.add(getClasslistBasedOnDateTime(getLastSavedDate(), getLastSavedTime()));

    dateTimeDialog.close();
    console.log('date: ' + getLastSavedDate());
    console.log('time: ' + getLastSavedTime());
  })
}

export function setLastSavedDate(date) {
  let dueDateInput = document.querySelector('.task-due-date-input');
  dueDateInput.value = date;
  lastSavedDate = date;
}

export function getLastSavedDate() {
  return lastSavedDate;
}

export function setLastSavedTime(time) {
  let timeInput = document.querySelector('.task-time-input');
  timeInput.value = time;
  lastSavedTime = time;
}

export function getLastSavedTime() {
  return lastSavedTime;
}

function onlyTimeIsSet() {
  let dueDateInput = document.querySelector('.task-due-date-input');
  let timeInput = document.querySelector('.task-time-input');
  if (dueDateInput.value === '' && timeInput.value !== '') {
    return true;
  }
  return false;
}

function activateDueDateInputTodayButton() {
  let todayButton = document.querySelector('.task-due-date-today-button');
  let todayFormatted = DateTime.now().toFormat('yyyy-MM-dd');
  let dueDateInput = document.querySelector('.task-due-date-input');
  todayButton.addEventListener('click', () => {
    dueDateInput._flatpickr.setDate(todayFormatted);
  }) 
}

function activateDueDateInputClearButton() {
  let clearButton = document.querySelector('.task-due-date-clear-button');
  let dueDateInput = document.querySelector('.task-due-date-input');
  clearButton.addEventListener('click', () => {
    dueDateInput._flatpickr.clear();
  })
}

function calculateDateTimeTextColorClasslist(dateString, timeString) {
  const now = DateTime.now();
  let formattedDateTime = '';
  let color = '';
  let classlist = '';
  let selectedDate = '';
  let root = document.querySelector(':root');
  let rootCS = getComputedStyle(root);

  if (dateString === '' && timeString === '') {
    formattedDateTime = 'No Date';
    color = rootCS.getPropertyValue('--no-date-color');
    classlist = 'no-date';
    return { formattedDateTime, color, classlist };
  }

  if (timeString === '') {
    selectedDate = DateTime.fromISO(dateString);
  } else {
    selectedDate = DateTime.fromISO(dateString + 'T' + timeString);
  }
  
  let dayNumber = selectedDate.toFormat('d');
  const formattedDay = selectedDate.toFormat('cccc'); // Day of the week
  const formattedYear = selectedDate.toFormat('yyyy'); // Year
  const formattedMonth = selectedDate.toFormat('LLLL'); // Month
  const currentYear = DateTime.now().toFormat('yyyy');

  let relativeDate = selectedDate.toRelativeCalendar();

  
  // for overdue task items not including today
  if (selectedDate < now && relativeDate !== 'today') {
    if (formattedYear < currentYear) {
      formattedDateTime = `${formattedMonth.slice(0,3)} ${dayNumber} ${formattedYear}`;
    } else {
      formattedDateTime = `${formattedMonth.slice(0,3)} ${dayNumber}`;
    }
    classlist = 'overdue';
    color = rootCS.getPropertyValue('--overdue-color');

    if (timeString !== '') {
      const time = DateTime.fromFormat(timeString, "HH:mm");

      // Format the time in 12-hour format with AM/PM
      const formattedTime = time.toFormat("h:mma");

      formattedDateTime += ' ' + formattedTime;
    }

    return { formattedDateTime, color, classlist };
  } 
  
  if (relativeDate === 'today') {
    formattedDateTime = 'Today';
    if (timeString !== '' && selectedDate < now) {
      classlist = 'overdue';
      color = rootCS.getPropertyValue('--overdue-color');
    } else {
      classlist = 'due-later-today';
      color = rootCS.getPropertyValue('--due-later-today-color');
    }
  } else if (relativeDate === 'tomorrow') {
    formattedDateTime = 'Tomorrow';
    classlist = 'due-tomorrow';
    color = rootCS.getPropertyValue('--due-tomorrow-color');
  } else if (/^in [1-6] day(s)?$/.test(relativeDate)) {
    formattedDateTime = formattedDay;
    classlist = 'due-this-week';
    color = rootCS.getPropertyValue('--due-this-week-color');
  } else if (formattedYear > currentYear){
    formattedDateTime = `${formattedMonth.slice(0,3)} ${dayNumber} ${formattedYear}`;
    classlist = 'due-in-future';
    color = rootCS.getPropertyValue('--due-in-future-color');
  } else  {
    formattedDateTime = `${formattedMonth.slice(0,3)} ${dayNumber}`;
    classlist = 'due-in-future';
    color = rootCS.getPropertyValue('--due-in-future-color');
  }

  if (timeString !== '') {
    // console.log('time string: ' + timeString);
    const time = DateTime.fromFormat(timeString, "HH:mm");

    // Format the time in 12-hour format with AM/PM
    const formattedTime = time.toFormat("h:mma");

    formattedDateTime += ' ' + formattedTime;
  }

  return { formattedDateTime, color, classlist };
} 

function getFormattedTextBasedOnDateTime(dateString, timeString) {
  let formattedText = calculateDateTimeTextColorClasslist(dateString, timeString).formattedDateTime;
  return formattedText;
} 

function getColorBasedOnDateTime(dateString, timeString) {
  let color = calculateDateTimeTextColorClasslist(dateString, timeString).color;
  return color;
} 

function getClasslistBasedOnDateTime(dateString, timeString) {
  let classlist = calculateDateTimeTextColorClasslist(dateString, timeString).classlist;
  return classlist;
}

export default createDateTimeDialog;