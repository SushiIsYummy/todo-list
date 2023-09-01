import inboxOutlineSVG from '../svgs/inbox-outline.svg';
import todayOutlineSVG from '../svgs/today-outline.svg';
import upcomingOutlineSVG from '../svgs/upcoming-outline.svg';


// default sidebar items
// let sidebarItems = ['Inbox', 'Today', 'Upcoming', 'Projects'];

// localStorage.setItem('sidebarItems', JSON.stringify(sidebarItems));

function createSidebar() {
  let content = document.querySelector('#content');

  let sidebar = document.createElement('aside');
  sidebar.classList.add('sidebar');
  
  let sidebarList = document.createElement('ul');
  sidebarList.classList.add('sidebar-list');

  sidebarList.appendChild(createSidebarItem('Inbox', 'inbox', inboxOutlineSVG));
  sidebarList.appendChild(createSidebarItem('Today', 'today', todayOutlineSVG));
  sidebarList.appendChild(createSidebarItem('Upcoming', 'upcoming', upcomingOutlineSVG));
  sidebarList.appendChild(createSidebarItemList('Projects', 'projects'));

  sidebar.appendChild(sidebarList);
  content.appendChild(sidebar);
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

  let sidebarItemSVG = document.createElement('object');
  sidebarItemSVG.setAttribute('data', svg);
  sidebarItemSVG.setAttribute('type', 'image/svg+xml');

  linkContainer.appendChild(sidebarItemSVG);
  linkContainer.appendChild(sidebarItemName);
  sidebarItem.appendChild(linkContainer);

  return sidebarItem;
}

const createSidebarItemList = (itemName, itemClass, itemListItems) => {
  let sidebarItemList = document.createElement('li');
  sidebarItemList.classList.add('sidebar-item');
  sidebarItemList.classList.add(itemClass);

  let linkContainer = document.createElement('a');
  linkContainer.href = '#';

  let sidebarItemName = document.createElement('p');
  sidebarItemName.textContent = itemName;

  let list = document.createElement('ul');

  if (Array.isArray(itemListItems)) {
    for (let i = 0; i < itemListItems.length; i++) {
      // let listItems = document.createElement('p');
    }
  }

  linkContainer.appendChild(sidebarItemName);
  sidebarItemList.appendChild(linkContainer);

  return sidebarItemList;
}

export default createSidebar;