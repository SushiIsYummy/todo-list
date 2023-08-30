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
// const task = createTaskBuilder()
//   .setPriority(1)
//   .build();

// console.log(task);

// function removeLastItem() {
//   let taskList = JSON.parse(localStorage.getItem('taskList'));

//   if (taskList !== null) {
//     taskList.pop();
//   }
  
//   localStorage.setItem('taskList', JSON.stringify(taskList));

//   console.log(localStorage.getItem('taskList'));
// }

// removeLastItem();