import calendarSVG from '../svgs/calendar.svg'
import * as dateTimeDialog from './dialogs/dateTimeDialog';
import { getTaskListFromLocalStorage } from './tasks';

function createTaskBuilder() {
  const task = {};

  function setTitle(title) {
    task.title = title;
    return builder;
  }

  function setDescription(description) {
    task.description = description;
    return builder;
  }

  function setDueDate(dueDate) {
    task.dueDate = dueDate;
    return builder;
  }

  function setDueDateTime(dueDateTime) {
    task.dueDateTime = dueDateTime;
    return builder;
  }

  function setPriority(priority) {
    task.priority = priority;
    return builder;
  }

  function setTaskLocation(taskLocation) {
    task.taskLocation = taskLocation;
    return builder;
  }

  function build() {
    return { ...task }; // Return a copy of the task object
  }

  const builder = {
    setTitle,
    setDescription,
    setDueDate,
    setDueDateTime,
    setPriority,
    setTaskLocation,
    build,
  };

  return builder;
}

export function createTask(listOfFormElements) {
  let builder = createTaskBuilder();
  let i = 0;
  for (const methodName in builder) {
    if (methodName.startsWith('set') && typeof builder[methodName] === 'function') {
      builder[methodName](listOfFormElements[i].value);
    }
    i++;
  }
  
  let task = builder.build();

  // add id to task
  let id = localStorage.getItem('idNumber');
  if (id === null) {
    addIdToAllTasks();
    let taskList = getTaskListFromLocalStorage();
    if (taskList === null) {
      taskList = [];
      localStorage.setItem('taskList', JSON.stringify(taskList));
    }
    task.id = taskList.length;
    let nextId = taskList.length+1;
    localStorage.setItem('idNumber', JSON.stringify(nextId));
  } else {
    id = parseInt(id);
    task.id = id;
    id += 1;
    localStorage.setItem('idNumber', JSON.stringify(id));
  }

  // add checked property to false on creation of task
  task.checked = false;

  return task;
}

function addIdToAllTasks() {
  let taskList = getTaskListFromLocalStorage();

  if (taskList !== null) {
    for (let i = 0; i < taskList.length; i++) {
      console.log(taskList[i]);
      taskList[i].id = i;
    }
  
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }
}

export function createTaskDOMElement(task) {
  let nonEmptyOptionalTaskItemElements = [];

  let taskItem = document.createElement('li');
  taskItem.classList.add('task-item');
  taskItem.setAttribute('data-task-id', task.id);

  let priorityCheckbox = document.createElement('input');
  priorityCheckbox.type = 'checkbox';
  priorityCheckbox.classList.add('task-item-priority-checkbox');
  // add corresponding priority color to checkbox border and background color
  priorityCheckbox.classList.add(`task-item-priority-${task.priority}`);

  // save value of checkbox to corresponding task in local storage
  // when a checkbox is clicked
  priorityCheckbox.addEventListener('click', (e) => {
    let taskList = getTaskListFromLocalStorage();
    let targetTask = taskList.find(task => parseInt(task.id) === parseInt(taskItem.dataset.taskId));

    targetTask.checked = (priorityCheckbox.checked === true);

    localStorage.setItem('taskList', JSON.stringify(taskList));
  });

  if (task.checked === true) {
    priorityCheckbox.checked = true;
  }

  let title = document.createElement('h1');
  title.classList.add('task-item-title');
  title.textContent = task.title;

  let description = document.createElement('p');
  if (task.description !== '') {
    description.classList.add('task-item-description');
    description.textContent = task.description;
    nonEmptyOptionalTaskItemElements.push(description);
  }

  let dateAndTimeContainer = document.createElement('div');
  dateAndTimeContainer.classList.add('task-item-date-and-time-container');

  let calendar = document.createElement('iframe');
  calendar.classList.add('task-item-calendar');
  calendar.src = calendarSVG;
  
  let dateAndTime = document.createElement('p');
  dateAndTime.classList.add('task-item-date-and-time');
  
  if (task.dueDate !== '') {
    nonEmptyOptionalTaskItemElements.push(dateAndTimeContainer);
    dateAndTime.textContent = dateTimeDialog.getFormattedTextBasedOnDateTime(task.dueDate, task.dueDateTime);
    dateAndTime.classList.add(dateTimeDialog.getClasslistBasedOnDateTime(task.dueDate, task.dueDateTime));
    
    // color calendar based on date and time when loaded
    calendar.addEventListener('load', () => {
      const svgIframeWindow = calendar.contentWindow;
      const svgIframeDocument = svgIframeWindow.document;
      const pathElement = svgIframeDocument.querySelector('svg');
      pathElement.style.fill = dateTimeDialog.getColorBasedOnDateTime(task.dueDate, task.dueDateTime);
    });
  }

  dateAndTimeContainer.append(calendar, dateAndTime);

  // append required elements
  taskItem.append(priorityCheckbox, title);

  for (let i = 0; i < nonEmptyOptionalTaskItemElements.length; i++) {
    taskItem.appendChild(nonEmptyOptionalTaskItemElements[i]);
  }

  
  return taskItem;
}

export function createTaskItemTodayUpcoming(task) {
  let nonEmptyOptionalTaskItemElements = [];

  let taskItem = document.createElement('li');
  taskItem.classList.add('task-item');
  taskItem.setAttribute('data-task-id', task.id);

  let rootElement = document.querySelector(':root');
  let cs = getComputedStyle(rootElement);

  let priorityCheckbox = document.createElement('input');
  priorityCheckbox.type = 'checkbox';
  priorityCheckbox.classList.add('task-item-priority-checkbox');
  // add corresponding priority color to checkbox border and background color
  priorityCheckbox.classList.add(`task-item-priority-${task.priority}`);

  // save value of checkbox to corresponding task in local storage
  // when a checkbox is clicked
  priorityCheckbox.addEventListener('click', (e) => {
    let taskList = getTaskListFromLocalStorage();
    let targetTask = taskList.find(task => parseInt(task.id) === parseInt(taskItem.dataset.taskId));

    targetTask.checked = (priorityCheckbox.checked === true);

    localStorage.setItem('taskList', JSON.stringify(taskList));
  });

  if (task.checked === true) {
    priorityCheckbox.checked = true;
  }

  let title = document.createElement('h1');
  title.classList.add('task-item-title');
  title.textContent = task.title;

  let description = document.createElement('p');
  if (task.description !== '') {
    description.classList.add('task-item-description');
    description.textContent = task.description;
    nonEmptyOptionalTaskItemElements.push(description);
  }

  let dateTimeAndLocationContainer = document.createElement('div');
  dateTimeAndLocationContainer.classList.add('task-item-date-time-and-location-container');

  let location = document.createElement('p');
  location.classList.add('task-item-location');
  location.textContent = task.taskLocation;

  let dateTimeContainer = document.createElement('div');
  dateTimeContainer.classList.add('task-item-date-and-time-container');

  let calendar = document.createElement('iframe');
  calendar.classList.add('task-item-calendar');
  calendar.src = calendarSVG;
  
  let dateAndTime = document.createElement('p');
  dateAndTime.classList.add('task-item-date-and-time');
  
  if (task.dueDate !== '') {
    // nonEmptyOptionalTaskItemElements.push(dateTimeContainer);
    dateAndTime.textContent = dateTimeDialog.getFormattedTextBasedOnDateTime(task.dueDate, task.dueDateTime);
    dateAndTime.classList.add(dateTimeDialog.getClasslistBasedOnDateTime(task.dueDate, task.dueDateTime));
    
    // color calendar based on date and time when loaded
    calendar.addEventListener('load', () => {
      const svgIframeWindow = calendar.contentWindow;
      const svgIframeDocument = svgIframeWindow.document;
      const pathElement = svgIframeDocument.querySelector('svg');
      pathElement.style.fill = dateTimeDialog.getColorBasedOnDateTime(task.dueDate, task.dueDateTime);
    });
    dateTimeContainer.append(calendar, dateAndTime);
  }

  dateTimeAndLocationContainer.append(dateTimeContainer, location);

  // append required elements
  taskItem.append(priorityCheckbox, title);

  for (let i = 0; i < nonEmptyOptionalTaskItemElements.length; i++) {
    taskItem.appendChild(nonEmptyOptionalTaskItemElements[i]);
  }
  taskItem.appendChild(dateTimeAndLocationContainer);

  
  return taskItem;
}