import inboxOutlineSVG from '../svgs/inbox-outline.svg';
import todayOutlineSVG from '../svgs/today-outline.svg';
import upcomingOutlineSVG from '../svgs/upcoming-outline.svg';
import * as utils from './utils';

function createSidebar() {
  let content = document.querySelector('#content');

  let sidebarDialog = document.createElement('dialog');
  sidebarDialog.classList.add('sidebar-dialog');

  let sidebar = document.createElement('aside');
  sidebar.classList.add('sidebar');
  
  let sidebarList = document.createElement('ul');
  sidebarList.classList.add('sidebar-list');

  sidebarList.appendChild(createSidebarItem('Inbox', 'inbox', inboxOutlineSVG));
  sidebarList.appendChild(createSidebarItem('Today', 'today', todayOutlineSVG));
  sidebarList.appendChild(createSidebarItem('Upcoming', 'upcoming', upcomingOutlineSVG));
  
  sidebarList.appendChild(createSidebarItemList('Projects', 'projects'));


  sidebar.appendChild(sidebarList)
  sidebarDialog.appendChild(sidebar);
  content.appendChild(createAddProjectDialog());
  content.appendChild(sidebarDialog);

  // sidebarDialog.showModal();
  updateProjectsList();
  activateAddProjectButton();
  handleSidebarDialogOutsideClick();
  closeSidebarOnItemClick();
  activateAddProjectDialogActionButtons();
}

// export function getSidebarItems() {
//   return [...sidebarItems];
// }


const createSidebarItem = (itemName, itemClass, svg) => {
  if (itemName === undefined || itemClass === undefined || svg === undefined) {
    return;
  }

  let sidebarItem = document.createElement('li');
  sidebarItem.classList.add('sidebar-item');
  sidebarItem.classList.add(itemClass);

  let linkContainer = document.createElement('a');
  linkContainer.href = '#';

  let sidebarItemName = document.createElement('p');
  sidebarItemName.textContent = itemName;

  let sidebarItemSVG = document.createElement('iframe');
  sidebarItemSVG.classList.add(`${itemClass}-svg`);
  sidebarItemSVG.setAttribute('src', svg);

  setSidebarSVGColors(sidebarItemSVG);

  linkContainer.appendChild(sidebarItemSVG);
  linkContainer.appendChild(sidebarItemName);
  sidebarItem.appendChild(linkContainer);

  return sidebarItem;
}

function setSidebarSVGColors(sidebarItemSVG) {
  sidebarItemSVG.addEventListener('load', () => {
    const svgIframeWindow = sidebarItemSVG.contentWindow;
    const svgIframeDocument = svgIframeWindow.document;

    // Access and manipulate SVG elements within the iframe as needed
    const pathElement = svgIframeDocument.querySelector('svg');
    // pathElement.style.fill = "red"; // Change the fill color to blue

    if (sidebarItemSVG.classList.contains('inbox-svg')) {
      pathElement.style.fill = 'blue';
    } else if (sidebarItemSVG.classList.contains('today-svg')) {
      pathElement.style.fill = 'green'
    } else if (sidebarItemSVG.classList.contains('upcoming-svg')) {
      pathElement.style.fill = 'purple'
    }
  })
}

const createSidebarItemList = (itemName, itemClass, itemListItems) => {
  let sidebarItemList = document.createElement('li');
  sidebarItemList.classList.add('sidebar-item-list');
  sidebarItemList.classList.add(itemClass);

  let projectHeader = document.createElement('a');
  projectHeader.classList.add('projects-header');

  let addProjectButton = document.createElement('button');
  addProjectButton.classList.add('add-project-button');
  addProjectButton.textContent = '+';

  let sidebarItemName = document.createElement('p');
  sidebarItemName.textContent = itemName;

  let projectList = document.createElement('ul');
  projectList.classList.add('projects-list');

  if (itemListItems !== undefined) {
    for (let i = 0; i < itemListItems.length; i++) {
      let projectItemName = document.createElement('p');
      projectItemName.textContent = itemListItems[i];

      let projectItem = document.createElement('li');
      projectItem.classList.add('projects-list-item');

      projectItem.appendChild(projectItemName);

      projectList.appendChild(projectItem);
    }
  }

  projectHeader.appendChild(sidebarItemName);
  projectHeader.appendChild(addProjectButton);
  // projectHeader.appendChild(projectList);
  sidebarItemList.appendChild(projectHeader);
  sidebarItemList.appendChild(projectList);

  return sidebarItemList;
}

function closeSidebarOnItemClick() {
  let allSidebarItems = document.querySelectorAll('.sidebar-item');

  allSidebarItems.forEach((sidebarItem) => {
    sidebarItem.addEventListener('click', () => {
      hideSidebarDialog();
    });
  })
}

function handleSidebarDialogOutsideClick() {
  let dialog = document.querySelector('.sidebar-dialog');

  let isMouseOutsideModal = false;

  dialog.addEventListener("mousedown", (event) => {
    const dialogDimensions = dialog.getBoundingClientRect();
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

  dialog.addEventListener("mouseup", (event) => {
    const modalArea = dialog.getBoundingClientRect();
    // console.log(isMouseOutsideModal);
    if (isMouseOutsideModal && 
      (event.clientX < modalArea.left ||
      event.clientX > modalArea.right ||
      event.clientY < modalArea.top ||
      event.clientY > modalArea.bottom)) {
      isMouseOutsideModal = false;
      hideSidebarDialog();
    }
  });
  
}

function hideSidebarDialog() {
  let sidebarDialog = document.querySelector('.sidebar-dialog');
  sidebarDialog.classList.add('hide');
  sidebarDialog.addEventListener('animationend', dialogAnimationEnd);
}

function dialogAnimationEnd() {
  let dialog = document.querySelector('.sidebar-dialog');
  dialog.close();
  dialog.classList.remove('hide');
  dialog.removeEventListener('animationend', dialogAnimationEnd);
}

function createAddProjectDialog() {
  let addProjectDialog = document.createElement('dialog');
  addProjectDialog.classList.add('add-project-dialog');

  let addProjectForm = document.createElement('form');
  addProjectForm.classList.add('add-project-form');
  
  let addProjectHeader = document.createElement('header');
  addProjectHeader.classList.add('add-project-item-header');

  let addProjectTitle = document.createElement('h1');
  addProjectTitle.classList.add('add-project-item-name');
  addProjectTitle.textContent = 'Add Project';

  let nameInput = document.createElement('input');
  nameInput.classList.add('add-project-dialog-name-input');
  nameInput.placeholder = 'Project Name';
  nameInput.required = true;
  nameInput.minLength = 1;

  let addProjectDialogActionButtons = document.createElement('div');
  addProjectDialogActionButtons.classList.add('add-project-dialog-action-buttons');

  let addProjectDialogCancelButton = document.createElement('button');
  addProjectDialogCancelButton.classList.add('add-project-dialog-cancel-button');
  addProjectDialogCancelButton.textContent = 'CANCEL';
  addProjectDialogCancelButton.type = 'button';

  let addProjectDialogConfirmButton = document.createElement('button');
  addProjectDialogConfirmButton.classList.add('add-project-dialog-confirm-button');
  addProjectDialogConfirmButton.textContent = 'CONFIRM';
  addProjectDialogConfirmButton.type = 'submit';

  addProjectDialogActionButtons.append(addProjectDialogCancelButton, addProjectDialogConfirmButton);

  addProjectHeader.appendChild(addProjectTitle);
  addProjectForm.append(addProjectHeader, nameInput, addProjectDialogActionButtons);
  addProjectDialog.appendChild(addProjectForm);

  console.log(addProjectDialog);
  return addProjectDialog;
}

function activateAddProjectButton() {
  let addProjectButton = document.querySelector('.add-project-button');
  let addProjectDialog = document.querySelector('.add-project-dialog');

  addProjectButton.addEventListener('click', () => {
    addProjectDialog.showModal();
  });
}

function activateAddProjectDialogActionButtons() {
  let addProjectDialog = document.querySelector('.add-project-dialog');
  let addProjectForm = document.querySelector('.add-project-form');
  let cancelButton = document.querySelector('.add-project-dialog-cancel-button')
  let confirmButton = document.querySelector('.add-project-dialog-confirm-button')
  let nameInput = document.querySelector('.add-project-dialog-name-input');

  cancelButton.addEventListener('click', () => {
    addProjectDialog.close();
  });

  addProjectForm.addEventListener('submit', () => {
    let projectList = JSON.parse(localStorage.getItem('projectList'));

    if (projectList !== null) {
      projectList.push(nameInput.value);
      localStorage.setItem('projectList', JSON.stringify(projectList));
      clearAddProjectForm();
      updateProjectsList();
    } else {
      projectList = ['Home'];
      projectList.push(nameInput.value);
      localStorage.setItem('projectList', JSON.stringify(projectList));
      updateProjectsList();
    }
    addProjectDialog.close();
  });
}

function updateProjectsList() {
  let projectList = JSON.parse(localStorage.getItem('projectList'));
  let projectsListElement = document.querySelector('.projects-list');
  utils.clearElementList(projectsListElement);

  if (projectList !== null) {
    for (let i = 0; i < projectList.length; i++) {
      let projectItem = document.createElement('li');
      projectItem.classList.add('projects-list-item');
  
      let projectItemName = document.createElement('p');
      projectItemName.textContent = projectList[i];
  
      projectItem.appendChild(projectItemName);
      projectsListElement.appendChild(projectItem);
    }
  }
}

function clearAddProjectForm() {
  let addProjectDialogForm = document.querySelector('.add-project-form');
  addProjectDialogForm.reset();
}

export default createSidebar;