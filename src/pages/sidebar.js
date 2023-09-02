import inboxOutlineSVG from '../svgs/inbox-outline.svg';
import todayOutlineSVG from '../svgs/today-outline.svg';
import upcomingOutlineSVG from '../svgs/upcoming-outline.svg';

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

  // sidebarDialog.showModal();
  handleSidebarDialogOutsideClick();
  closeSidebarOnItemClick();
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
  sidebarItemList.classList.add('sidebar-item-list');
  sidebarItemList.classList.add(itemClass);

  let linkContainer = document.createElement('a');
  // linkContainer.href = '#';

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
    console.log(isMouseOutsideModal);
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

export default createSidebar;