import createSidebar from './pages/sidebar';
import createFooter from './pages/footer/footerBuilder';
import createInbox from './pages/inbox';
import createUpcoming from './pages/upcoming';

import './styles/global.css';
import './styles/sidebar.css';
import './styles/footer.css'
import './styles/inbox.css'
import './styles/today.css';
import './styles/upcoming.css';
import './styles/task-item.css';
import createToday from './pages/today';
import flatpickr from 'flatpickr';
createFooter(); 
createSidebar();
// createToday();
// createInbox();
// createUpcoming();

let content = document.querySelector('#content');
let inboxSidebarItem = document.querySelector('.sidebar-item.inbox');
let todaySidebarItem = document.querySelector('.sidebar-item.today');
let upcomingSidebarItem = document.querySelector('.sidebar-item.upcoming');
let sidebarDialog = document.querySelector('.sidebar-dialog');
// sidebarDialog.showModal();
let addProjectDialog = document.querySelector('.add-project-dialog');
// addProjectDialog.showModal();
let todayContainer = document.querySelector('.today-container');
let upcomingContainer = document.querySelector('.upcoming-container');

inboxSidebarItem.addEventListener('click', () => {
  let inboxContainer = document.querySelector('.inbox-container');
  if (inboxContainer === null) {
    removeAllElementsExceptFooterAndSidebar();
    createInbox();
  }
});

todaySidebarItem.addEventListener('click', () => {
  let todayContainer = document.querySelector('.today-container');
  if (todayContainer === null) {
    removeAllElementsExceptFooterAndSidebar();
    createToday();
  }
});

upcomingSidebarItem.addEventListener('click', () => {
  let upcomingContainer = document.querySelector('.upcoming-container');
  if (upcomingContainer === null) {
    removeAllElementsExceptFooterAndSidebar();
    createUpcoming();
  }
})

function removeAllElementsExceptFooterAndSidebar() {
  let elementsToBeRemoved = content.children;

  for (let i = elementsToBeRemoved.length - 1; i >= 0; i--) {
    const child = elementsToBeRemoved[i];
    
    // Check if the child element does not have the specified class name
    if (!child.classList.contains('footer-container') &&
        !child.classList.contains('sidebar-dialog') &&
        !child.classList.contains('add-project-dialog')) {
      // Remove the child element from the parent
      content.removeChild(child);
    }
  }
}