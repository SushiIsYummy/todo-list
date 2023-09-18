import { DateTime } from "luxon";
import * as utils from '/src/utils';

export function filterTaskListByLocation(pageName, taskList) {
  // let pageNameLower = pageName.toLowerCase();
  // let taskList = JSON.parse(localStorage.getItem('taskList'));

  if (taskList !== null) {
    taskList = taskList.filter((task) => task.taskLocation === pageName);
  } else {
    taskList = [];
  }
  

  return taskList;
}

export function filterTaskListByToday(taskList) {

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

export function filterTaskListByUpcoming(taskList) {
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

export function filterTaskListByOverdue(taskList) {
    let now = DateTime.now();
    taskList.forEach((task) => {
      // if (task.dueDateTime === '')
      let dueDateAndTime = task.dueDate + 'T' + task.dueDateTime;
      let dueDate = Luxon.DateTime.fromISO(task.dueDate);
    });
}