import { DateTime } from "luxon";

export function addMarginTopToTaskList(headerElement, taskListElement) {
  taskListElement.style.marginTop = getComputedStyle(headerElement).height;
}

export function addMarginBottomToTaskList(taskListElement) {
  let footerBar = document.querySelector('.footer-bar');
  taskListElement.style.marginBottom = getComputedStyle(footerBar).height;
}

export function compareTodayTasks(a, b) {
  // compare by time and no time
  // object with time will be higher on the list than objects with no time
  if (a.dueDateTime === '' && b.dueDateTime === '') {
    return a.priority - b.priority; // Sort by priority if times are empty
  } else if (a.dueDateTime === '') {
    return 1; // Object with empty time should come after the one with time
  } else if (b.dueDateTime === '') {
    return -1; // Object with empty time should come before the one with time
  }

  // Compare by time
  const aTime = DateTime.fromISO(a.dueDateTime);
  const bTime = DateTime.fromISO(b.dueDateTime);

  if (aTime < bTime) {
    return -1;
  } else if (aTime > bTime) {
    return 1;
  } else {
    return a.priority - b.priority;
  }

}

export function compareUpcomingTasks(a, b) {
  // compare by date vs no date
  if (a.dueDate === '' && b.dueDate === '') {
    return a.priority - b.priority; 
  } else if (a.dueDate === '') {
    return 1; 
  } else if (b.dueDate === '') {
    return -1; 
  } else {
    
  }

  // Compare by date
  if (a.dueDate !== '' && b.dueDate !== '') {
    const aDate = DateTime.fromISO(a.dueDate);
    const bDate = DateTime.fromISO(b.dueDate);
  
    if (aDate < bDate) {
      return -1;
    } else if (aDate > bDate) {
      return 1;
    } else {
      // compare by time vs no time
      if (a.dueDateTime === '' && b.dueDateTime === '') {
        return a.priority - b.priority; 
      } else if (a.dueDateTime === '') {
        return 1;
      } else if (b.dueDateTime === '') {
        return -1;
      }

      // Compare by time
      const aTime = DateTime.fromISO(a.dueDateTime);
      const bTime = DateTime.fromISO(b.dueDateTime);

      if (aTime < bTime) {
        return -1;
      } else if (aTime > bTime) {
        return 1;
      } else {
        return a.priority - b.priority;
      }
    }
  }
}