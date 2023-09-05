import scrollIntoView from 'scroll-into-view-if-needed';
import { DateTime } from 'luxon';

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
  return task;
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

// window.addEventListener('taskAddedToLocalStorage', () => {
//   if (onPageWithTaskList()) {
//     taskAddedInfo.setTaskAddedOnPageWithTaskList(true);
//   } else {
//     taskAddedInfo.setTaskAddedOnPageWithTaskList(false);
//   }
// });

function showAddedTaskIfHidden(taskListElement) {
  // if (taskAddedInfo.getTaskAddedOnPageWithTaskList()) {
    // if (taskListElement != null && taskListElement.childElementCount > 0) {
      moveTaskListUp(taskListElement);
      
      scrollIntoView(taskListElement.lastElementChild, {
        behavior: 'smooth', // You can customize the scroll behavior
        block: 'start', // Scroll to the bottom of the element
      }); 
    // }
}


// function onPageWithTaskList() {
//   let inbox = document.querySelector('.inbox-container');
//   let today = document.querySelector('.today-container');
//   if (inbox != null || today != null) {
//     return true;
//   }

//   return false;
// }

export function updateTaskList(pageName, taskListElement, addedTask) {
  clearTaskList(taskListElement);
  let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (pageName === 'today') {
    taskList = filterTaskListByToday(taskList);
  } else {
    taskList = filterTaskListByLocation(pageName, taskList);
  }
  
  taskList.forEach((task) => {
    let taskItem = createTaskItem(task);
    taskListElement.appendChild(taskItem);
  });

  if (addedTask) {
    showAddedTaskIfHidden(taskListElement);
  }

  return taskList;
}

function moveTaskListUp(taskListElement) {
  let addTaskDialog = document.querySelector('.footer-add-task-dialog');
  // console.log('add task dialog open: ' + addTaskDialog.open);

  if (addTaskDialog.open) {
    let div = document.createElement('div');
    let footerBarHeight = document.querySelector('.footer-bar').offsetHeight;
    div.classList.add('inbox-list-div');
    div.style.height = `${addTaskDialog.offsetHeight-footerBarHeight-1}px`;

    let div2 = document.createElement('div');
    div2.style.height = '1px';

    taskListElement.appendChild(div);
    taskListElement.appendChild(div2);

    div.addEventListener('animationend', () => {
      div.remove();
      div2.remove();
    })
  }
}

function createTaskItem(task) {
  let taskItem = document.createElement('li');
  taskItem.classList.add('task-item');

  // let priorityContainer = document.createElement('label');
  // priorityContainer.classList.add('task-item-priority-container');
  let rootElement = document.querySelector(':root');
  let cs = getComputedStyle(rootElement);

  let priorityCheckbox = document.createElement('input');
  priorityCheckbox.type = 'checkbox';
  // priorityCheckbox.classList.add()
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
  }

  let date = document.createElement('p');
  if (task.dueDate !== '') {
    date.classList.add('task-item-date');
    // date.textContent = task.dueDate;

    // convert the 'yyyy-mm-dd' format to different format
    // depending on the due date relative to current date
    let now = DateTime.now();
    let dueDate = DateTime.fromISO(task.dueDate);
    let dueDateFormatted = dueDate.toFormat('MMMM d');
    
    let relativeDate = dueDate.toRelative();
    // if (relativeDate.endsWith())
    if (relativeDate.startsWith('in') && relativeDate.endsWith('hours')) {
      dueDateFormatted = 'Tomorrow';
      
    } else if ( /^in [1-5] days$/.test(relativeDate)) {
      dueDateFormatted = dueDate.weekdayLong;
    }
    
    date.textContent = dueDateFormatted;
    // console.log(relativeDate);

    
  }

  let time = document.createElement('p');
  if (task.dueDateTime !== '') {
    time.classList.add('task-item-time');
    // date.textContent = task.dueDateTime;

    // console.log('hours: ' + hours);
    let hours = parseInt(task.dueDateTime.split(':')[0]);
    let minutes = task.dueDateTime.split(':')[1];
    let suffix = hours >= 12 ? "PM":"AM"; 

    // convert 24 hour to 12 hour
    hours = ((hours + 11) % 12 + 1);

    time.textContent = hours + ':' + minutes + suffix;

  }

  let dateAndTime = document.createElement('div');
  dateAndTime.classList.add('task-item-date-and-time');
  dateAndTime.append(date, time);


  taskItem.append(priorityCheckbox, title, description, dateAndTime);

  // Array.from(dateAndTime.children).forEach(element => {
  //   if (element.value === '') {
  //     element.remove();
  //   }
  // });

  // if (dateAndTime.childElementCount === 0) {
  //   dateAndTime.remove();
  // }

  // Array.from(taskItem.children).forEach(element => {
  //   if (element.value === '') {
  //     element.remove();
  //   }
  // })

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
      // console.log('task.dueDate: ' + task.dueDate);
      if (task.dueDate !== '') {
        // let dueDateFormat = task.dueDate;
        let dueDate = DateTime.fromISO(task.dueDate);
        // console.log('due date: ' + dueDate);
        let relativeDate = dueDate.toRelative();
        // console.log('today: ' + relativeDate);
        // console.log(now);
        // if (now.compare(dueDate)) {
          // console.log(now > (dueDate));
          // console.log('relative date today: ' + relativeDate);

        if (relativeDate.startsWith('in') && relativeDate.endsWith('hours')) {
          return true;
        }

        return false;
      }
  });
  } else {
    taskList = [];
  }
  // })
  // console.log('after: ' + taskList);

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