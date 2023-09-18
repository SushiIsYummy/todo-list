import { filterTaskListByLocation, filterTaskListByToday, filterTaskListByOverdue, filterTaskListByUpcoming } from "./task-list-filtering";
import { DateTime } from 'luxon';
import scrollIntoView from 'scroll-into-view-if-needed';
import * as utils from '/src/utils';
import { createTaskDOMElement, createTaskItemTodayUpcoming } from './task-creator';
import { createGroupedTasksByDateElement, groupTasksByDueDate } from './tasks';
import { getTaskFromTaskList } from "./tasks";
import { getTaskListFromLocalStorage } from "./tasks";
import { showAddedTaskIfHidden } from "./tasks";


export function updateTaskList(pageName, taskListElement) {
  clearTaskList(taskListElement);
  let taskList = getTaskListFromLocalStorage();

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
    let taskItem = createTaskDOMElement(task);
    taskListElement.appendChild(taskItem);
  });

}

export function updateTaskListWithDateHeaders(pageName, taskListElement) {
  clearTaskList(taskListElement);
  let taskList = getTaskListFromLocalStorage();

  if (pageName === 'upcoming') {
    taskList = filterTaskListByUpcoming(taskList);
  } else {
    return;
  }

  taskList.sort(utils.compareUpcomingTasks);

  let groupedTasks = Object.values(groupTasksByDueDate(taskList));
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

export function updateSingleTaskItem() {
  let selectedTaskItem = document.querySelector('.task-item.highlighted');
  let taskItemId = parseInt(selectedTaskItem.dataset.taskId);
  let task = getTaskFromTaskList(taskItemId);
  let headerElementLocation = document.querySelector('header[data-task-location]');
  let headerElementPageName = document.querySelector('header[data-page-name]');

  let updatedTaskItem = null;
  if (headerElementLocation) {
    updatedTaskItem = createTaskDOMElement(task);
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
    if ((pageName === 'today' && relativeDate !== 'today')) {
        updatedTaskItem.remove();
      return;
    }

    if (pageName === 'upcoming' && relativeDate === 'today') {
      if (updatedTaskItem.parentNode && updatedTaskItem.parentNode.childElementCount === 1) {
        let groupedTasksByDate = updatedTaskItem.closest('.grouped-tasks-by-date');
        if (groupedTasksByDate) {
          groupedTasksByDate.remove();
        }
      }
      return;
    }

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
  let groupedTasks = groupTasksByDueDate(taskList);
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

  console.log(oldGroupedTasksByDateElement);
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

export function addTaskToTaskList(pageName, taskListElement) {
  let taskList = getTaskListFromLocalStorage();
  let addedTask = taskList[taskList.length-1];
  let taskDate = addedTask.dueDate;
  let taskDateLuxon = DateTime.fromISO(taskDate);
  let relativeDate = DateTime.fromISO(taskDate).toRelativeCalendar();
  let now = DateTime.now();

  // console.log('if: ' + (pageName === 'upcoming' && relativeDate !== 'today' && addedTask.dueDate > now));
  if (pageName === addedTask.taskLocation) {

    let extraDiv = taskListElement.querySelector('.extra-div');
    let addedTaskItem = createTaskDOMElement(addedTask);
    taskListElement.appendChild(addedTaskItem);

    // remove the last item (the div that pushes list up)
    // on subsequent added tasks
    if (extraDiv !== null) {
      extraDiv.remove();
    }

    showAddedTaskIfHidden(taskListElement);
  }
}

export function addTaskToTaskListToday(taskListElement) {
  let taskList = getTaskListFromLocalStorage();
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
  let taskList = getTaskListFromLocalStorage();
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

  let groupedTasksObjectWithoutAddedTask = groupTasksByDueDate(taskListWithoutAddedTask);
  
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

export function clearTaskList(taskListElement) {
  while (taskListElement.lastChild) {
    taskListElement.lastChild.remove();
  }
}