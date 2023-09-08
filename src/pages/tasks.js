import scrollIntoView from 'scroll-into-view-if-needed';
import { DateTime } from 'luxon';
import footerUtils from './footer/footerUtilities';
import * as utils from './utils';
import calendarSVG from '../svgs/calendar.svg'

const taskAddedToLocalStorage = new Event('taskAddedToLocalStorage');

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
    // removeIdFromAllTasks();
    addIdToAllTasks();
    // console.log('added id');
    let taskList = JSON.parse(localStorage.getItem('taskList'));
    if (taskList === null) {
      taskList = [];
      localStorage.setItem('taskList', JSON.stringify(taskList));
    }
    task.id = taskList.length;
    let nextId = taskList.length+1;
    localStorage.setItem('idNumber', JSON.stringify(nextId));
    // console.log('next id: ' + nextId);
    // console.log(JSON.parse(localStorage.getItem('idNumber')));
  } else {
    id = parseInt(id);
    task.id = id;
    id += 1;
    localStorage.setItem('idNumber', JSON.stringify(id));
  }

  return task;
}

// function removeIdFromAllTasks() {
//   let taskList = JSON.parse(localStorage.getItem('taskList'));

//   taskList.forEach(task => {
//     delete task.id;
//   })
// }

function addIdToAllTasks() {
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  for (let i = 0; i < taskList.length; i++) {
    console.log(taskList[i]);
    taskList[i].id = i;
  }

  localStorage.setItem('taskList', JSON.stringify(taskList));
}


export function addTaskToLocalStorage(task) { 
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
  window.dispatchEvent(taskAddedToLocalStorage);
}

const taskAddedInfo = (() => {
  let taskAddedOnPageWithTaskList = false;
  let pageTaskWasAdded = '';
  const getTaskAddedOnPageWithTaskList = () => taskAddedOnPageWithTaskList;
  const setTaskAddedOnPageWithTaskList = (boolean) => taskAddedOnPageWithTaskList = boolean;
  const getPageTaskWasAdded = () => pageTaskWasAdded;
  // const setPageTaskWasAdded = 
  return { getTaskAddedOnPageWithTaskList, setTaskAddedOnPageWithTaskList };
})();

function showAddedTaskIfHidden(taskListElement) {
  // if (taskAddedInfo.getTaskAddedOnPageWithTaskList()) {
    // if (taskListElement != null && taskListElement.childElementCount > 0) {
      moveTaskListUp(taskListElement);
      
      scrollIntoView(taskListElement.lastElementChild, {
        behavior: 'smooth', // You can customize the scroll behavior
        block: 'start', // Scroll to the bottom of the element
      }); 

      // moveTaskListDown(taskListElement);
    // }
}

export function updateTaskList(pageName, taskListElement, addedTask) {
  clearTaskList(taskListElement);
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  // if (addedTask) {
  //   let addedTaskItem = createTaskItem(taskList[taskList.length-1]);
  //   console.log('tasklist length: ' + taskList.length);
  //   console.log('added task item: ' + taskList[taskList.length-1].title);
  //   taskListElement.appendChild(addedTaskItem);
  //   showAddedTaskIfHidden(taskListElement);
  // } else {
    if (pageName === 'today') {
      taskList = filterTaskListByToday(taskList);
    } else {
      taskList = filterTaskListByLocation(pageName, taskList);
    }
    
    taskList.forEach((task) => {
      let taskItem = createTaskItem(task);
      taskListElement.appendChild(taskItem);
    });
  // }



  return taskList;
}

export function addTaskToTaskListToday(taskListElement) {
  let taskList = JSON.parse(localStorage.getItem('taskList'));
  let addedTask = taskList[taskList.length-1];
  let relativeDate = DateTime.fromISO(addedTask.dueDate).toRelativeCalendar();

  // ignore added task if its due date is not today
  if (relativeDate !== 'today') {
    return;
  }

  taskList = filterTaskListByToday(taskList);

  taskList.sort(utils.compareTodayItems);

  let index = taskList.findIndex(task => task.id === addedTask.id);
  console.log('index: ' + index);

  let newTaskItem = createTaskItem(addedTask);

  // list is empty or added task is at the end of the list
  if (taskListElement.childElementCount === 0 || index === taskList.length-1) {
    taskListElement.appendChild(newTaskItem);
  } else {
    taskListElement.insertBefore(newTaskItem, taskListElement.childNodes[index]);
  }

  // may need to improve scrolling function later on
  scrollIntoView(newTaskItem, {
    behavior: 'smooth',
    // block: 'bottom'
  });
  
}

export function addTaskToTaskList(pageName, taskListElement) {
  let taskList = JSON.parse(localStorage.getItem('taskList'));
  let addedTask = taskList[taskList.length-1];
  let taskDate = addedTask.dueDate;
  let relativeDate = DateTime.fromISO(taskDate).toRelativeCalendar();

  if (pageName === addedTask.taskLocation ||
      pageName === 'today' && relativeDate === 'today') {

    let extraDiv = taskListElement.querySelector('.extra-div');
    let addedTaskItem = createTaskItem(addedTask);
    taskListElement.appendChild(addedTaskItem);

    // remove the last item (the div that pushes list up)
    // on subsequent added tasks
    if (extraDiv !== null) {
      extraDiv.remove();
    }

    showAddedTaskIfHidden(taskListElement);
  }
}

function moveTaskListUp(taskListElement) {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  // console.log('add task dialog open: ' + addTaskDialog.open);

  if (addTaskDialog.open) {
    let extraDiv = document.createElement('div');
    let footerBarHeight = document.querySelector('.footer-bar').offsetHeight;
    extraDiv.classList.add('extra-div');
    extraDiv.style.height = `${addTaskDialog.offsetHeight-footerBarHeight-1}px`;

    // let div2 = document.createElement('div');
    // div2.style.height = '1px';

    taskListElement.appendChild(extraDiv);
    // taskListElement.appendChild(div2);

    extraDiv.addEventListener('animationend', () => {
      extraDiv.remove();
      // div2.remove();
    })
  }
}

function createTaskItem(task) {
  let nonEmptyOptionalTaskItemElements = [];

  let taskItem = document.createElement('li');
  taskItem.classList.add('task-item');

  let rootElement = document.querySelector(':root');
  let cs = getComputedStyle(rootElement);

  let priorityCheckbox = document.createElement('input');
  priorityCheckbox.type = 'checkbox';
  priorityCheckbox.classList.add('task-item-priority-checkbox');
  // add corresponding priorty color to checkbox border and background color
  priorityCheckbox.classList.add(`task-item-priority-${task.priority}`);

  // priorityCheckbox.style.color = cs.getPropertyValue(`--priority-${task.priority}-color`);
  // priorityCheckbox.style.backgroundColor = 'rgba(cs.getPropertyValue(`--priority-${task.priority}-color`), 0.1)';
  // priorityCheckbox.style
  // priorityCheckbox.style.color = 

  // let span = document.createElement('span');
  // span.classList.add('task-item-priority-checkmark');

  // priorityContainer.append(priorityCheckbox, span);
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
    dateAndTime.textContent = footerUtils.getFormattedTextBasedOnDateTime(task.dueDate, task.dueDateTime);
    dateAndTime.classList.add(footerUtils.getClasslistBasedOnDateTime(task.dueDate, task.dueDateTime));
    
    // color calendar based on date and time when loaded
    calendar.addEventListener('load', () => {
      const svgIframeWindow = calendar.contentWindow;
      const svgIframeDocument = svgIframeWindow.document;
      const pathElement = svgIframeDocument.querySelector('svg');
      pathElement.style.fill = footerUtils.getColorBasedOnDateTime(task.dueDate, task.dueDateTime);
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

function filterTaskListByLocation(pageName, taskList) {
  // let pageNameLower = pageName.toLowerCase();
  // let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (taskList !== null) {
    taskList.filter((task) => {
      task.taskLocation === pageName;
    })
  } else {
    taskList = [];
  }
  

  return taskList;
}

// unfinished
function filterTaskListByOverdue(taskList) {

    let now = DateTime.now();

    
    taskList.forEach((task) => {
      // if (task.dueDateTime === '')
      let dueDateAndTime = task.dueDate + 'T' + task.dueDateTime;
      let dueDate = Luxon.DateTime.fromISO(task.dueDate);

    });
  
}

function filterTaskListByToday(taskList) {

  if (taskList !== null) {
    taskList = taskList.filter((task) => {
      if (task.dueDate !== '') {
        let dueDate = DateTime.fromISO(task.dueDate);
        let relativeDate = dueDate.toRelativeCalendar();

        if (relativeDate === 'today') {
          return true;
        }
        return false;
      }
    });

    // sort list by time, then by priority
    taskList.sort(utils.compareTodayItems);
  } else {
    taskList = [];
  }

  return taskList;
}

function clearTaskList(taskListElement) {

  while (taskListElement.lastChild) {
    taskListElement.lastChild.remove();
  }
}

// function removeLastItem() {
//   let taskList = JSON.parse(localStorage.getItem('taskList'));

//   if (taskList !== null) {
//     taskList.pop();
//   }
  
//   localStorage.setItem('taskList', JSON.stringify(taskList));

//   console.log(localStorage.getItem('taskList'));
// }

// removeLastItem();