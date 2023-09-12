import inboxOutlineSVG from '../../svgs/inbox-outline.svg';
import todayOutlineSVG from '../../svgs/today-outline.svg';
import upcomingOutlineSVG from '../../svgs/upcoming-outline.svg';
// import createProjectPage from '../project';
import * as utils from '../utils';
import sidebarELM from './sidebarEventListenerManager';
import sidebarUtils from './sidebarUtilitiesManager';

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

  // sidebarELM.handleSidebarDialogOutsideClick();
  // sidebarELM.activateAddProjectDialogActionButtons();
  // sidebarELM.activateAddProjectButton();
  // sidebarELM.closeSidebarOnItemClick();
  // sidebarUtils.updateProjectsList();

  // activateProjectItemClick();
  
  // window.addEventListener('projectAddedToLocalStorage', () => {
  //   closeSidebarOnItemClick();
  // });

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

  sidebarELM.setSidebarSVGColors(sidebarItemSVG);

  linkContainer.appendChild(sidebarItemSVG);
  linkContainer.appendChild(sidebarItemName);
  sidebarItem.appendChild(linkContainer);

  return sidebarItem;
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

export default createSidebar;