import scrollIntoView from 'scroll-into-view-if-needed';
import { DateTime } from 'luxon';
import * as utils from '../utils';
import calendarSVG from '../svgs/calendar.svg'
import sendButtonSVG from '../svgs/send.svg';
import { showEditTaskItemDialog } from '/src/pages/dialogs/editTaskItemDialog'
import { setEditTaskItemDialogInputs } from './dialogs/editTaskItemDialog';
import * as dateTimeDialog from '/src/pages/dialogs/dateTimeDialog';
import { getClasslistBasedOnDateTime, getColorBasedOnDateTime } from './dialogs/dateTimeDialog';

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
    addIdToAllTasks();
    let taskList = JSON.parse(localStorage.getItem('taskList'));
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
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (taskList !== null) {
    for (let i = 0; i < taskList.length; i++) {
      console.log(taskList[i]);
      taskList[i].id = i;
    }
  
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }
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

function showAddedTaskIfHidden(taskListElement) {
  moveTaskListUp(taskListElement);
  
  scrollIntoView(taskListElement.lastElementChild, {
    behavior: 'smooth', // You can customize the scroll behavior
    block: 'start', // Scroll to the bottom of the element
  }); 
}

export function updateTaskList(pageName, taskListElement) {
  clearTaskList(taskListElement);
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (pageName === 'today') {
    taskList = filterTaskListByToday(taskList);
    taskList.forEach((task) => {
      let taskItem = createTaskItemTodayUpcoming(task);
      taskListElement.appendChild(taskItem);
    });
    return;
  } else if (pageName === 'upcoming') {
    taskList = filterTaskListByUpcoming(taskList);
  } else { 
    // taskList = filterTaskListByUpcoming(taskList);
    taskList = filterTaskListByLocation(pageName, taskList);
  }
  
  taskList.forEach((task) => {
    let taskItem = createTaskItem(task);
    taskListElement.appendChild(taskItem);
  });

}

export function updateTaskListWithDateHeaders(pageName, taskListElement) {
  clearTaskList(taskListElement);
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (pageName === 'upcoming') {
    taskList = filterTaskListByUpcoming(taskList);
  } else {
    return;
  }

  taskList.sort(utils.compareUpcomingTasks);

  let groupedTasks = Object.values(groupByDueDate(taskList));
  // console.log(groupedTasks);
  groupedTasks.forEach((taskGroup) => {
    let groupedTasksByDate = document.createElement('li');
    groupedTasksByDate.classList.add('grouped-tasks-by-date');
    groupedTasksByDate.setAttribute('data-due-date', taskGroup[0].dueDate);

    let dayOfWeek = DateTime.fromISO(taskGroup[0].dueDate).weekdayLong;
    let dueDateFormatted = DateTime.fromISO(taskGroup[0].dueDate).toFormat(`MMM d`);
    dueDateFormatted += ' · ' + dayOfWeek

    let headerDate = document.createElement('h1');
    headerDate.classList.add('grouped-task-items-date-header');
    headerDate.textContent = dueDateFormatted;

    let groupedTaskItems = document.createElement('ul');
    groupedTaskItems.classList.add('grouped-task-items');

    groupedTasksByDate.appendChild(headerDate);
    groupedTasksByDate.appendChild(groupedTaskItems);

    taskGroup.forEach((task) =>  {
      let taskItem = createTaskItemTodayUpcoming(task);
      groupedTaskItems.appendChild(taskItem);
    });

    taskListElement.appendChild(groupedTasksByDate);
  })

}

function groupByDueDate(taskList) {

  // Create an object to group tasks by due date
  const groupedTasks = {};

  // Iterate through the tasks and group them by due date
  for (const task of taskList) {
    const dueDate = task.dueDate;
    if (!groupedTasks[dueDate]) {
      groupedTasks[dueDate] = [];
    }
    groupedTasks[dueDate].push(task);
  }

  // Convert the grouped tasks object to an array of arrays
  // const result = Object.values(groupedTasks);

  return groupedTasks;
}

export function addTaskToTaskListToday(taskListElement) {
  let taskList = JSON.parse(localStorage.getItem('taskList'));
  let addedTask = taskList[taskList.length-1];
  let relativeDate = DateTime.fromISO(addedTask.dueDate).toRelativeCalendar();

  if (relativeDate !== 'today') {
    return;
  }

  taskList = filterTaskListByToday(taskList);

  taskList.sort(utils.compareTodayTasks);

  let index = taskList.findIndex(task => task.id === addedTask.id);
  console.log('index: ' + index);

  let newTaskItem = createTaskItemTodayUpcoming(addedTask);

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

export function addTaskToTaskListUpcoming(taskListElement) {
  let taskList = JSON.parse(localStorage.getItem('taskList'));
  let addedTask = taskList[taskList.length-1];
  let taskListWithoutAddedTask = [...taskList];
  taskListWithoutAddedTask.pop();
  
  let now = DateTime.now();
  let dueDate = DateTime.fromISO(addedTask.dueDate);
  let relativeDate = DateTime.fromISO(addedTask.dueDate).toRelativeCalendar();

  if (addedTask.dueDate === '' || (dueDate < now && relativeDate === 'today')) {
    return;
  }

  taskListWithoutAddedTask = filterTaskListByUpcoming(taskListWithoutAddedTask);

  taskListWithoutAddedTask.sort(utils.compareUpcomingTasks);

  let newTaskItem = createTaskItemTodayUpcoming(addedTask);

  let groupedTasksObjectWithoutAddedTask = groupByDueDate(taskListWithoutAddedTask);
  
  if (!groupedTasksObjectWithoutAddedTask[addedTask.dueDate]) {
    console.log('new date added!');
    let groupedTasksByDate = document.createElement('li');
    groupedTasksByDate.classList.add('grouped-tasks-by-date');
    groupedTasksByDate.setAttribute('data-due-date', addedTask.dueDate);

    let dayOfWeek = DateTime.fromISO(addedTask.dueDate).weekdayLong;
    let dueDateFormatted = DateTime.fromISO(addedTask.dueDate).toFormat(`MMM d`);
    dueDateFormatted += ' · ' + dayOfWeek

    let headerDate = document.createElement('h1');
    headerDate.classList.add('grouped-task-items-date-header');
    headerDate.textContent = dueDateFormatted;

    let groupedTaskItems = document.createElement('ul');
    groupedTaskItems.classList.add('grouped-task-items');

    groupedTasksByDate.appendChild(headerDate);
    groupedTasksByDate.appendChild(groupedTaskItems);

    groupedTaskItems.appendChild(newTaskItem);

    let dueDatesWithoutAddedTask = Object.keys(groupedTasksObjectWithoutAddedTask);
    let dueDatesWithAddedTask = [...dueDatesWithoutAddedTask];
    dueDatesWithAddedTask.push(addedTask.dueDate);
    dueDatesWithoutAddedTask.sort(utils.compareDates);
    dueDatesWithAddedTask.sort(utils.compareDates);

    // console.log(dueDatesWithoutAddedTask);

    let index = dueDatesWithAddedTask.findIndex(dueDate => dueDate === addedTask.dueDate);
    console.log('index:' + index);

    if (index === 0) {
      if (taskListElement.childElementCount === 0) {
        taskListElement.appendChild(groupedTasksByDate);
      } else {
        taskListElement.insertBefore(groupedTasksByDate, taskListElement.firstChild);
      }
    } else if (index === dueDatesWithAddedTask.length-1) {
      taskListElement.appendChild(groupedTasksByDate);
    } else {
      let allGroupedTasks = [];
      dueDatesWithoutAddedTask.forEach(dueDate => {
        allGroupedTasks.push(taskListElement.querySelector(`.grouped-tasks-by-date[data-due-date="${dueDate}"]`));
      })
      console.log(allGroupedTasks);
      taskListElement.insertBefore(groupedTasksByDate, allGroupedTasks[index]);
    }
    
  } else {
    let groupedTasksByDate = taskListElement.querySelector(`.grouped-tasks-by-date[data-due-date="${addedTask.dueDate}"]`);
    let groupedTaskItems = groupedTasksByDate.querySelector('.grouped-task-items');
    let taskItemElements = Array.from(groupedTaskItems.querySelectorAll('.task-item'));
    let tasksWithoutAddedTask = groupedTasksObjectWithoutAddedTask[addedTask.dueDate];
    let tasksWithAddedTask = [...tasksWithoutAddedTask];
    tasksWithAddedTask.push(addedTask);
    tasksWithAddedTask.sort(utils.compareUpcomingTasks);
    tasksWithoutAddedTask.sort(utils.compareUpcomingTasks);

    let index = tasksWithAddedTask.findIndex((task) => task.id === addedTask.id);

    if (index === tasksWithoutAddedTask.length) {
      groupedTaskItems.appendChild(newTaskItem);
    } else {
      groupedTaskItems.insertBefore(newTaskItem, taskItemElements[index]);
    } 
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
  let taskDateLuxon = DateTime.fromISO(taskDate);
  let relativeDate = DateTime.fromISO(taskDate).toRelativeCalendar();
  let now = DateTime.now();

  // console.log('if: ' + (pageName === 'upcoming' && relativeDate !== 'today' && addedTask.dueDate > now));
  if (pageName === addedTask.taskLocation) {

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
    let taskList = JSON.parse(localStorage.getItem('taskList'));
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

function createTaskItemTodayUpcoming(task) {
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
    let taskList = JSON.parse(localStorage.getItem('taskList'));
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

function filterTaskListByLocation(pageName, taskList) {
  // let pageNameLower = pageName.toLowerCase();
  // let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (taskList !== null) {
    taskList = taskList.filter((task) => task.taskLocation === pageName);
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
    taskList.sort(utils.compareTodayTasks);
  } else {
    taskList = [];
  }

  return taskList;
}

function filterTaskListByUpcoming(taskList) {
  if (taskList !== null) {
    taskList = taskList.filter((task) => {
      if (task.dueDate !== '') {
        let now = DateTime.now();
        let dueDate = DateTime.fromISO(task.dueDate);
        let relativeDate = dueDate.toRelativeCalendar();

        if (relativeDate !== 'today' && dueDate > now) {
          return true;
        }
        return false;
      }
    });

    // sort list by date, then time, then by priority
    // console.log(taskList);
    // taskList.sort(utils.compareUpcomingTasks);
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

export function getTaskListFromLocalStorage() {
  let taskList = JSON.parse(localStorage.getItem('taskList'));
  if (taskList === null) {
    taskList = [];
    setTaskListInLocalStorage(taskList);
  }
  return taskList;
}

export function setTaskListInLocalStorage(taskList) {
  if (taskList) {
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }
}

function getTaskFromTaskList(taskId) {
  let taskList = JSON.parse(localStorage.getItem('taskList'));
  let targetTask = taskList.find((task) => parseInt(task.id) === parseInt(taskId));
  return targetTask;
}

export function updateSingleTaskItem() {
  let selectedTaskItem = document.querySelector('.task-item.highlighted');
  let taskItemId = parseInt(selectedTaskItem.dataset.taskId);
  let task = getTaskFromTaskList(taskItemId);
  let headerElementLocation = document.querySelector('header[data-task-location]');
  let headerElementPageName = document.querySelector('header[data-page-name]');

  let updatedTaskItem = null;
  if (headerElementLocation) {
    updatedTaskItem = createTaskItem(task);
  } else if (headerElementPageName) {
    updatedTaskItem = createTaskItemTodayUpcoming(task);
  }

  if (selectedTaskItem && task) {
    // editTaskItem(selectedTaskItem, task);
    selectedTaskItem.replaceWith(updatedTaskItem);
    // selectedTaskItem = updatedTaskItem;
    // selectedTaskItem = document.querySelector('.task-item.highlighted');
    console.log(updatedTaskItem);
  }
  // remove element if updated task location is not the current page opened
  if (headerElementLocation) {
    if (task.taskLocation !== headerElementLocation.dataset.taskLocation) {
      updatedTaskItem.remove();
      return;
    }
  }

  if (headerElementPageName) {
    let now = DateTime.now();
    let dueDate = DateTime.fromISO(task.dueDate);
    let relativeDate = dueDate.toRelativeCalendar();
    let pageName = headerElementPageName.dataset.pageName;
    if ((pageName === 'today' && relativeDate !== 'today') ||
        (pageName === 'upcoming' && relativeDate === 'today')) {
      updatedTaskItem.remove();
      return;
    }

    // not working properly
    if (pageName === 'upcoming' && relativeDate !== 'today' && dueDate > now) {
      updateTaskItemOnUpcoming(task, updatedTaskItem);
      console.log(selectedTaskItem.closest('.grouped-tasks-by-date'));
      // selectedTaskItem.remove();
      return;
    }
  }
}

function updateTaskItemOnUpcoming(taskToUpdate, updatedTaskItem) {
  let taskList = getTaskListFromLocalStorage();
  let groupedTasks = groupByDueDate(taskList);
  let now = DateTime.now();
  let tomorrow = now.plus({ days: 1 }).toFormat('yyyy-MM-dd');
  let sortedDates = Object.keys(groupedTasks).filter(date => date >= tomorrow).sort();
  let sortedDatesIndex = sortedDates.indexOf(taskToUpdate.dueDate);
  let taskGroup = groupedTasks[sortedDates[sortedDatesIndex]];
  taskGroup.sort(utils.compareTodayTasks);
  console.log(taskGroup);
  taskGroup.forEach(task => console.log(task.id));
  console.log('task to update id: ' + taskToUpdate.id);
  console.log('sorted dates: ' + sortedDates);
  // let updatedTaskItem = createTaskItem(taskToUpdate);
  let oldGroupedTasksByDateElement = updatedTaskItem.closest('.grouped-tasks-by-date');
  console.log(oldGroupedTasksByDateElement);
  // task group was created, it did not exist before
  console.log('task group length: ' + taskGroup.length);
  if (taskGroup.length === 1) {
    let indexInGroupedTasks = sortedDates.indexOf(taskToUpdate.dueDate);
    let groupedTasksByDateElement = createGroupedTasksByDateElement(taskToUpdate, updatedTaskItem);
    let groupedTasksByDateListDOM = document.querySelector('main ul');
    if (indexInGroupedTasks === sortedDates.length) {
      groupedTasksByDateListDOM.appendChild(groupedTasksByDateElement);
    } else {
      let referenceElement = groupedTasksByDateListDOM.children[indexInGroupedTasks];
      groupedTasksByDateListDOM.insertBefore(groupedTasksByDateElement, referenceElement);
      // oldGroupedTasksByDateElement.remove();
    }
    console.log('old grouped task items length: ' + oldGroupedTasksByDateElement.querySelector('.grouped-task-items').childElementCount)
    // if (oldGroupedTasksByDateElement.querySelector('.grouped-task-items').childElementCount === 0) {
    //   oldGroupedTasksByDateElement.remove();
    // }
  } else if (taskGroup.length > 1) {
    // task group already exists
    let groupedTasksDOM = document.querySelector(`.grouped-tasks-by-date[data-due-date="${taskToUpdate.dueDate}"]`);
    let groupedTaskItems = groupedTasksDOM.querySelector('ul.grouped-task-items');
    let indexInTaskGroup = taskGroup.findIndex(task => parseInt(task.id) === parseInt(taskToUpdate.id));
    // let indexInTaskGroup = taskGroup.indexOf(task => console.log('task id:'task.id));
    console.log(indexInTaskGroup);
    let referenceTaskElement = Array.from(groupedTaskItems.children)[indexInTaskGroup];
    console.log(referenceTaskElement);
    if (indexInTaskGroup === taskGroup.length) {
      groupedTaskItems.appendChild(updatedTaskItem);
    } else {
      groupedTaskItems.insertBefore(updatedTaskItem, referenceTaskElement);
    }
  }

  if (oldGroupedTasksByDateElement.querySelector('.grouped-task-items').childElementCount === 0) {
    oldGroupedTasksByDateElement.remove();
  }

  let groupedTasksByDate = updatedTaskItem.closest('.grouped-tasks-by-date');
  let groupedTasksByDateListDOM = document.querySelector('main ul');
  if (groupedTasksByDate.nextSibling) {
    if (groupedTasksByDate.nextSibling.dataset.dueDate < groupedTasksByDate.dataset.dueDate) {
      groupedTasksByDateListDOM.insertBefore(groupedTasksByDate.nextSibling, groupedTasksByDate);
    }
  }


}

function createGroupedTasksByDateElement(task, taskItem) {
  let groupedTasksByDate = document.createElement('li');
  groupedTasksByDate.classList.add('grouped-tasks-by-date');
  groupedTasksByDate.setAttribute('data-due-date', task.dueDate);

  let dayOfWeek = DateTime.fromISO(task.dueDate).weekdayLong;
  let dueDateFormatted = DateTime.fromISO(task.dueDate).toFormat(`MMM d`);
  dueDateFormatted += ' · ' + dayOfWeek

  let headerDate = document.createElement('h1');
  headerDate.classList.add('grouped-task-items-date-header');
  headerDate.textContent = dueDateFormatted;

  let groupedTaskItems = document.createElement('ul');
  groupedTaskItems.classList.add('grouped-task-items');

  groupedTaskItems.appendChild(taskItem);
  groupedTasksByDate.append(headerDate, groupedTaskItems);

  return groupedTasksByDate;
}

export function addEditFunctionToAllTaskItems() {
  let taskListElement = document.querySelector('main ul');
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  taskListElement.addEventListener('click', (e) => {
    let selection = getSelection().toString();
    if (selection) {
      return;
    }

    let elementClicked = e.target;
    if (elementClicked.tagName === 'LI' && elementClicked.classList.contains('task-item')) {
      if (taskList !== null) {
        let taskId = elementClicked.dataset.taskId;
        console.log(taskId);
        let task = getTaskFromTaskList(taskId);
        console.log(task);
        elementClicked.classList.add('highlighted');
        setEditTaskItemDialogInputs(task);
        showEditTaskItemDialog();
      }
    } 
  });
}

export function removeHighlightedTaskItem() {
  let highlightedTaskItem = document.querySelector('.task-item.highlighted');

  if (highlightedTaskItem) {
    highlightedTaskItem.classList.remove('highlighted');
  }
}
// let previousHighlightedTaskitem = null;
// function taskItemOnMouseDown(e) {
//   // console.log('selection :' + getSelection());
//   let clickedElement = e.target;

//   console.log('selection is empty : ' + getSelection().toString() !== '');
//   if (clickedElement.tagName === 'LI' && getSelection().toString() !== '') {
//     getSelection().empty();
//     // return;
//   }

//   if (clickedElement.tagName === 'LI' && clickedElement.classList.contains('task-item')) {
//     if (previousHighlightedTaskitem !== null) {
//       previousHighlightedTaskitem.classList.remove('highlighted');
//     }
//     clickedElement.classList.add('highlighted');
//     previousHighlightedTaskitem = clickedElement;
//   }
// }

// function taskItemOnMouseUp(e) {
//   let clickedElement = e.target;
//   if (clickedElement.tagName !== 'DIALOG' && clickedElement.closest('dialog') === null) {
//     if (clickedElement !== previousHighlightedTaskitem && previousHighlightedTaskitem !== null) {
//       previousHighlightedTaskitem.classList.remove('highlighted');
//     }
//   }
// }
