function createInbox() {
  let content = document.querySelector('#content');

  let inboxContainer = document.createElement('div');
  inboxContainer.classList.add('inbox-container');

  let inboxHeader = document.createElement('header');
  inboxHeader.classList.add('inbox-header');

  let inboxTitle = document.createElement('h1');
  inboxTitle.classList.add('inbox-title');
  inboxTitle.textContent = 'Inbox';

  let inboxMainContent = document.createElement('main');
  inboxMainContent.classList.add('inbox-main-content');

  let inboxList = document.createElement('ul');
  inboxList.classList.add('inbox-list');

  inboxHeader.appendChild(inboxTitle);
  inboxMainContent.appendChild(inboxList);
  inboxContainer.appendChild(inboxHeader);
  inboxContainer.appendChild(inboxMainContent);

  content.appendChild(inboxContainer);

  updateInboxListItems();
  // let rootElement = document.querySelector(':root');
  // let cs = getComputedStyle(rootElement);
  // console.log(cs);
  // console.log(typeof cs.getPropertyValue('--priority-1-color'));

  // Listen for changes in the localStorage 'taskList' variable
  window.addEventListener('taskListChange', updateInboxListItems);

  inboxMainContent.style.marginTop = getComputedStyle(inboxHeader).height;

}

function updateInboxListItems() {
  let inboxList = document.querySelector('.inbox-list');

  clearInboxList(inboxList);

  let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (taskList !== null) {
    taskList.forEach(task => {
      let taskItem = createTaskItem(task);
      inboxList.appendChild(taskItem);
    });
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
    import('luxon').then(Luxon => {
      let now = Luxon.DateTime.now();
      let dueDate = Luxon.DateTime.fromISO(task.dueDate);
      let dueDateFormatted = dueDate.toFormat('MMMM d');
      
      let relativeDate = dueDate.toRelative();
      if (relativeDate.startsWith('in') && relativeDate.endsWith('hours')) {
        dueDateFormatted = 'Tomorrow';
        
      } else if ( /^in [1-5] days$/.test(relativeDate)) {
        dueDateFormatted = dueDate.weekdayLong;
      }
      
      date.textContent = dueDateFormatted;
      console.log(relativeDate);

    })
  }

  let time = document.createElement('p');
  if (task.dueDateTime !== '') {
    time.classList.add('task-item-time');
    // date.textContent = task.dueDateTime;

  // console.log('hours: ' + hours);
  let hours = parseInt(task.dueDateTime.split(':')[0]);
  let minutes = task.dueDateTime.split(':')[0];
  let suffix = hours >= 12 ? "PM":"AM"; 

  // convert 24 hour to 12 hour
  hours = ((hours + 11) % 12 + 1);

  time.textContent = hours + ':' + minutes + suffix;
  }

  let dateAndTime = document.createElement('div');
  dateAndTime.classList.add('task-item-date-and-time');
  dateAndTime.append(date, time);


  taskItem.append(priorityCheckbox, title, description, dateAndTime);

  return taskItem;
}

function clearInboxList(inboxList) {

  while (inboxList.firstChild) {
    inboxList.firstChild.remove();
  }
}

export default createInbox;