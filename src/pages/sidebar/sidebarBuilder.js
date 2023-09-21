import inboxOutlineSVG from '../../svgs/inbox-outline.svg';
import todayOutlineSVG from '../../svgs/today-outline.svg';
import upcomingOutlineSVG from '../../svgs/upcoming-outline.svg';
import * as utils from '../../utils';
// import createProjectPage from '../project';
import sidebarELM from './sidebarEventListenerManager.js';
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
  content.appendChild(sidebarDialog);

  sidebarUtils.updateSidebarProjectsList();
  sidebarELM.closeSidebarOnItemClick();
  sidebarELM.goToProjectPageOnProjectItemClick();
  utils.handleDialogOutsideClick(sidebarDialog, function(){ utils.hideDialogWithAnimation(sidebarDialog) });

}

const createSidebarItem = (itemName, itemClass, svg) => {
  if (itemName === undefined || itemClass === undefined || svg === undefined) {
    return;
  }

  let sidebarItem = document.createElement('li');
  sidebarItem.classList.add('sidebar-item');
  sidebarItem.classList.add('close-sidebar');
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

const createSidebarItemList = (itemName, itemClass) => {
  let sidebarItemList = document.createElement('li');
  sidebarItemList.classList.add('sidebar-item-list');
  sidebarItemList.classList.add(itemClass);

  let projectHeader = document.createElement('a');
  projectHeader.classList.add('projects-header');

  let addProjectButton = document.createElement('button');
  addProjectButton.classList.add('add-project-button');
  addProjectButton.textContent = '➕';

  let sidebarItemName = document.createElement('p');
  sidebarItemName.textContent = itemName;

  let projectList = document.createElement('ul');
  projectList.classList.add('projects-list');

  projectHeader.appendChild(sidebarItemName);
  projectHeader.appendChild(addProjectButton);
  sidebarItemList.appendChild(projectHeader);
  sidebarItemList.appendChild(projectList);

  return sidebarItemList;
}

export default createSidebar;