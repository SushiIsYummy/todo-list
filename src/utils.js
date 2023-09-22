import { DateTime } from "luxon";
import kebabSVG from '/src/svgs/dots-vertical.svg';

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

export function compareDates(a, b) {
  // Parse the dates as strings into Date objects
  const dateA = new Date(a);
  const dateB = new Date(b);

  // Compare the Date objects
  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
}

export function clearAllChildrenOfElement(listElement) {
  while (listElement.childElementCount > 0) {
    listElement.lastChild.remove();
  }
}

export function removeAllElementsExceptFooterSidebarDialogs() {
  let elementsToBeRemoved = content.children;

  for (let i = 0; i < elementsToBeRemoved.length; i++) {
    const child = elementsToBeRemoved[i];
    
    if (!child.classList.contains('footer-container') &&
        child.nodeName !== 'DIALOG' && !child.classList.contains('sidebar-div') &&
        !child.classList.contains('page-container')) {
      content.removeChild(child);
    }
  }
}

export function removePage() {
  let pageContainer = document.querySelector('.page-container');
  
  if (pageContainer) {
    let page = pageContainer.querySelector('.page');
    if (page) {
      page.remove();
    }
  }

}

export function elementContainsClassEndingWith(element, suffix) {
  const classList = element.classList;
  for (let i = 0; i < classList.length; i++) {
    if (classList[i].endsWith(suffix)) {
      return true;
    }
  }
  return false;
}

export function handleDialogOutsideClick(dialogElement, actionWhenClickedOutside) {
  let isMouseOutsideModal = false;

  dialogElement.addEventListener("mousedown", (event) => {
    const dialogDimensions = dialogElement.getBoundingClientRect();
    if (
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom
    ) {
      isMouseOutsideModal = true;
    } else {
      isMouseOutsideModal = false;
    }
  });

  dialogElement.addEventListener("mouseup", (event) => {
    const modalArea = dialogElement.getBoundingClientRect();
    if (isMouseOutsideModal && 
      (event.clientX < modalArea.left ||
      event.clientX > modalArea.right ||
      event.clientY < modalArea.top ||
      event.clientY > modalArea.bottom)) {
      isMouseOutsideModal = false;
        if (actionWhenClickedOutside !== undefined) {
          actionWhenClickedOutside();
        }
    }
  });
}

// to use this function, the dialog needs to have an animation when
// the dialog has a class of 'hide'
export function hideDialogWithAnimation(dialog) {
  dialog.classList.add('hide');
  
  let extraDiv = document.querySelector('.extra-div');
  console.log('extra div: ' + extraDiv);
  if (extraDiv !== null) {
    extraDiv.classList.add('hide');
  }
  
  dialog.addEventListener('animationend', dialogAnimationEnd);
}

function dialogAnimationEnd(e) {
  let dialog = e.target;
  dialog.close();
  dialog.classList.remove('hide');
  dialog.removeEventListener('animationend', dialogAnimationEnd);
}

export function setDropdownLocationToCurrentPage() {
  let pageHeader = document.querySelector('header[data-task-location]');
  let taskLocationDropdown = document.querySelector('.add-task-dialog .task-location-dropdown');
  if (pageHeader && taskLocationDropdown) {
    taskLocationDropdown.value = pageHeader.dataset.taskLocation;
  }
}

export function setTextAreaHeightToContentHeight(textarea) {
  textarea.style.height = 'auto';
  if (textarea.value !== '') {
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}

export function textareaAutoResize(e) {
  let textarea = e.target;
  let scrollHeight = parseInt(textarea.scrollHeight);
  let maxHeight = parseInt(getComputedStyle(textarea).maxHeight);
  if (typeof maxHeight !== 'number') {
    return;
  }
  if (scrollHeight > maxHeight) {
    textarea.classList.remove('overflow-y-hidden');
    textarea.classList.add('overflow-y-visible');
  } else {
    textarea.classList.remove('overflow-y-visible');
    textarea.classList.add('overflow-y-hidden');
  }
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

export function createKebabMenu(menuList) {
  let kebabMenu = document.createElement('div');
  kebabMenu.classList.add('kebab-menu');

  document.addEventListener('click', function (event) {
    // Check if the click target is outside of the kebab menu and its list
    if (!kebabMenu.contains(event.target)) {
        // If the click is outside, close the menu
        kebabMenu.classList.remove('show-menu');
    }
  });

  let kebabIframe = document.createElement('iframe');
  kebabIframe.classList.add('kebab-icon');
  kebabIframe.src = kebabSVG;

  kebabIframe.addEventListener('load', function () {
    // The code here will run when the iframe has finished loading its content.
    // You can now safely add event listeners to elements within the iframe.
    
    // Example: Add a click event listener to an element within the iframe
    const iframeDocument = kebabIframe.contentDocument || kebabIframe.contentWindow.document;
    const iframeElement = iframeDocument.querySelector('svg');
    
    iframeElement.addEventListener('click', (e) => {
        // Your click event handler code here
        console.log(e.target);
        kebabMenu.classList.toggle('show-menu');
    });
  });


  let kebabMenuList = document.createElement('ul');
  kebabMenuList.classList.add('menu-list');

  kebabMenuList.addEventListener('click', () => {
    kebabMenu.classList.toggle('show-menu');
  })  
  
  if (menuList !== undefined) {
    for (let i = 0; i < menuList.length; i++) {
      let option = document.createElement('li');
      option.classList.add(convertStringToClassName(menuList[i]));

      let optionName = document.createElement('a');
      optionName.textContent = menuList[i];
  
      option.appendChild(optionName);
      kebabMenuList.appendChild(option);
    }
  }

  kebabMenu.append(kebabIframe, kebabMenuList);
  // console.log(kebabMenu);
  return kebabMenu;
}

// converts string to lower case and joins words with a hyphen '-'
export function convertStringToClassName(string) {
  return string.toLowerCase().replaceAll(' ', '-');
}