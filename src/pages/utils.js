import { DateTime } from "luxon";

export function addMarginTopToTaskList(headerElement, taskListElement) {
  taskListElement.style.marginTop = getComputedStyle(headerElement).height;
}

export function addMarginBottomToTaskList(taskListElement) {
  let footerBar = document.querySelector('.footer-bar');
  taskListElement.style.marginBottom = getComputedStyle(footerBar).height;
}

export function compareTodayItems(a, b) {
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


  // return timeComparison;
}