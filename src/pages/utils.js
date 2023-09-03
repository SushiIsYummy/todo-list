export function addMarginTopToTaskList(headerElement, taskListElement) {
  taskListElement.style.marginTop = getComputedStyle(headerElement).height;
}

export function addMarginBottomToTaskList(taskListElement) {
  let footerBar = document.querySelector('.footer-bar');
  taskListElement.style.marginBottom = getComputedStyle(footerBar).height;
}