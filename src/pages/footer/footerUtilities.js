import { DateTime } from 'luxon';
import sendButtonSVG from '../../svgs/send.svg';
import calendarSVG from '../../svgs/calendar-outline.svg';
import { addTaskToLocalStorage, createTask } from '../tasks';
import flatpickr from 'flatpickr';

import * as footerEL from './footerEventHandlers';
import footerEventListenerManager from './footerEventHandlers';


const footerUtilitiesManager = {

  addTaskFormElementDefaultValues: [],
  addTaskFormElements: [],
  // more locations after user adds projects.
  locationForTasks: ['Inbox'],
  
  lastSavedDate: '',
  lastSavedTime: '',
  
  
  getAddTaskDialogHeight() {
    let addTaskDialog = document.querySelector('.footer-add-task-dialog');
    return addTaskDialog.offsetHeight;
  },
  
  // setDateToToday() {
  //   let dueDate = document.querySelector('.task-due-date');
  
  //   let now = DateTime.now();
  //   let todayDate = now.toFormat('YYYY-MM-DD');
  //   console.log(todayDate);
  //   dueDate.value = DateTime.now().toFormat('yyyy-MM-dd');
  // }
  
  adjustDateInputWidthToContentWidth() {
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
  },
  
  // note: only usable when the add task dialog is opened since the
  // calendar svg is in the dialog and it is not loaded until it is
  // opened.
  setCalendarIconColor(color) {
    const svgIframe = document.querySelector('.calendar-svg');
    const svgIframeWindow = svgIframe.contentWindow;
    const svgIframeDocument = svgIframeWindow.document;
    const pathElement = svgIframeDocument.querySelector('svg');
    pathElement.style.fill = color;
  },

  setTaskItemCalendarIconColor(color) {
    const svgIframe = document.querySelector('.task-item-calendar');
    console.log(svgIframe);
    console.log(color);
    const svgIframeWindow = svgIframe.contentWindow;
    const svgIframeDocument = svgIframeWindow.document;
    const pathElement = svgIframeDocument.querySelector('svg');
    pathElement.style.fill = color;
  },
  
  setDueDateParaColor(color) {
    let dueDatePara = document.querySelector('.task-due-date-para');
    dueDatePara.style.color = color;
  },
  
  setLastSavedDate(date) {
    let dueDateInput = document.querySelector('.task-due-date-input');
    dueDateInput.value = date;
    this.lastSavedDate = date;
  },
  
  getLastSavedDate() {
    return this.lastSavedDate;
  },

  setLastSavedTime(time) {
    let timeInput = document.querySelector('.task-time-input');
    timeInput.value = time;
    this.lastSavedTime = time;
  },
  
  getLastSavedTime() {
    return this.lastSavedTime;
  },

  calculateDateTimeTextColorClasslist(dateString, timeString) {
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

    
    // for overdue task items
    if (selectedDate < now) {
      classlist = 'overdue';
      color = rootCS.getPropertyValue('--overdue-color');
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
    } else {
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
  },

  getFormattedTextBasedOnDateTime(dateString, timeString) {
    let formattedText = this.calculateDateTimeTextColorClasslist(dateString, timeString).formattedDateTime;
    return formattedText;
  },

  getColorBasedOnDateTime(dateString, timeString) {
    let color = this.calculateDateTimeTextColorClasslist(dateString, timeString).color;
    return color;
  },

  getClasslistBasedOnDateTime(dateString, timeString) {
    let classlist = this.calculateDateTimeTextColorClasslist(dateString, timeString).classlist;
    return classlist;
  },
  
  
  // adjustDateInputWidthToPlaceHolderWidth() {
  //   let dueDateAltInput = document.querySelector('.task-due-date.form-control');
  //   let dueDateSpan = document.createElement('span');
  //   let dueDatePlaceholder = dueDateAltInput.placeholder;
  
  //   dueDateSpan.style.visibility = 'hidden';
  //   document.body.appendChild(dueDateSpan);
  //   dueDateSpan.textContent = dueDatePlaceholder;
  
  //   let dueDatePaddingLeft = parseInt(getComputedStyle(dueDateAltInput).paddingLeft);
  //   let contentWidth = dueDateSpan.offsetWidth;
  
  //   dueDateAltInput.style.width = `${contentWidth + dueDatePaddingLeft}px`;
  //   document.body.removeChild(dueDateSpan);
  // }
  
  allElementsAreUntouched() {
  
    for (let i = 0; i < this.addTaskFormElementDefaultValues.length; i++) {
      if (this.addTaskFormElementDefaultValues[i] !== this.addTaskFormElements[i].value) {
        return false;
      }
      // console.log('element value: ' + addTaskFormElements[i].value);
      // console.log('default value: ' + addTaskFormElementDefaultValues[i]);  
    }
    return true;
  },
  
  clearAddTaskForm() {
    let form = document.querySelector('.footer-add-task-form');
    form.reset();
  
    let dueDatePara = document.querySelector('.task-due-date-para');
    dueDatePara.textContent = 'No Date';
    // empty the flatpickr alt input
    let dueDateFlatpickrInput = document.querySelector('.task-due-date-input.flatpickr-input');
    dueDateFlatpickrInput.value = '';
  
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
  
    this.setLastSavedDate('');
    this.setLastSavedTime('');
    
    footerEventListenerManager.datepicker.clear();

    this.setCalendarIconColor('#646464');

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
  
  },
  
  // store default values of form elements and the form elements themselves
  storeFormElementsAndDefaultValues() {
    
    let title = document.querySelector('.task-title');
    let description = document.querySelector('.task-description');
    let date = document.querySelector('.task-due-date-input');
    let time = document.querySelector('.task-time-input');
    let priorityDropdown = document.querySelector('.priority-dropdown');
    let taskLocationDropdown = document.querySelector('.task-location-dropdown');
    
    this.addTaskFormElements = [title, description, date, time, priorityDropdown, taskLocationDropdown];

    this.addTaskFormElements.forEach(element => {
      this.addTaskFormElementDefaultValues.push(element.value);
    })
    // Array.from(form.elements).forEach(element => {
    //   if (element.tagName !== 'BUTTON' && element.tagName !== 'OBJECT' &&
    //       element.tagName !== 'IFRAME' &&
    //       !element.matches('.task-due-date.form-control') && 
    //       !element.classList.contains('flatpickr-monthDropdown-months') && 
    //       !element.classList.contains('numInput')) {
    //     this.addTaskFormElementDefaultValues.push(element.value);
    //     this.addTaskFormElements.push(element);
    //     // console.log(element);
    //   }
    // })
  
    // this.addTaskFormElementDefaultValues.push(dueDateInput.value);
    // this.addTaskFormElements.push(dueDateInput);

  },

  moveClearButtonNextToDateInput() {

  }


}

export default footerUtilitiesManager;