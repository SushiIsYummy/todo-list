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
  
  // setDueDateValue() {
  //   let timeValue = document.querySelector('.task-time-value');
  // }
  
  // setTimeValue() {
  //   let dueDateValue = document.querySelector('.task-due-date-value');
  //   let dueDateFlatpickrInput = document.querySelector('.task-due-date-input.flatpickr-input');
  //   dueDateValue.value = dueDateFlatpickrInput.value;
  // }
  
  formatDateInputText() {
    // let dueDate = document.querySelector('.task-due-date');
    let dateInput = document.querySelector('.task-due-date-input')
    let dueDatePara = document.querySelector('.task-due-date-para');
    let timeInput = document.querySelector('.task-time-input');
  
    if (dateInput.value !== '') {
        let altInput = document.querySelector('.task-due-date.form-control');
        // const dateInput = document.querySelector('.task-due-date-input');
        console.log('calendar input: ' + dateInput.value);
        const selectedDate = DateTime.fromISO(dateInput.value);
  
        
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
          const now = DateTime.now();
          const dateTime = DateTime.fromISO(dateInput.value + 'T' + timeInput.value);
          // console.log('dateTime: ' + dateTime);
          dueDatePara.textContent = 'Today';
          // console.log('dateTime < now: ' + dateTime < now);
          if (timeInput.value !== '' && dateTime < now) {
            this.setCalendarIconColor('red');
            this.setDueDateParaColor('red');
          } else {
            this.setCalendarIconColor('green');
            this.setDueDateParaColor('green');
          }
        } else if (relativeDate === 'tomorrow') {
          dueDatePara.textContent = 'Tomorrow';
          this.setCalendarIconColor('#CC6600');
          this.setDueDateParaColor('#CC6600');
        } else if (/^in [1-6] day(s)?$/.test(relativeDate)) {
          dueDatePara.textContent = formattedDay;
          this.setCalendarIconColor('purple');
          this.setDueDateParaColor('purple');
        } else if (formattedYear > currentYear){
          dueDatePara.textContent = `${formattedMonth.slice(0,3)} ${dayNumber} ${formattedYear}`
          this.setCalendarIconColor('#646464');
          this.setDueDateParaColor('#646464');
        } else {
          dueDatePara.textContent = `${formattedMonth.slice(0,3)} ${dayNumber}`;
          this.setCalendarIconColor('#646464');
          this.setDueDateParaColor('#646464');
        }
  
        // add time to due date para
        if (timeInput.value !== '') {
          const time = DateTime.fromFormat(timeInput.value, "HH:mm");
  
          // Format the time in 12-hour format with AM/PM
          const formattedTime = time.toFormat("h:mma");
          dueDatePara.textContent += ' ' + formattedTime;
        }
    } else {
      // date is empty
      if (timeInput.value !== '') {
        let dateRequiredDialog = document.querySelector('.date-required-dialog');
        dateRequiredDialog.showModal();
      } else {
        dueDatePara.textContent = 'No Date';
        this.setCalendarIconColor('#646464');
        this.setDueDateParaColor('#646464');
      }

      console.log('date: ' + dateInput.value);
      console.log('time: ' + timeInput.value);
  
      // dueDateButtonPara.textContent = 'No Date';
      // console.log(calendarInput.value);
      // console.log('clear');
    }
  
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