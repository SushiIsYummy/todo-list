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
createSidebar();
createFooter(); 
// createToday();
// createInbox();
createUpcoming();

let content = document.querySelector('#content');
let inbox = document.querySelector('.sidebar-item.inbox');
let today = document.querySelector('.sidebar-item.today');
let upcoming = document.querySelector('.sidebar-item.upcoming');
let sidebarDialog = document.querySelector('.sidebar-dialog');

inbox.addEventListener('click', () => {
  removeAllElementsExceptFooterAndSidebar();
  createInbox();
});

today.addEventListener('click', () => {
  removeAllElementsExceptFooterAndSidebar();
  createToday();
});

upcoming.addEventListener('click', () => {
  removeAllElementsExceptFooterAndSidebar();
  createUpcoming();
})

function removeAllElementsExceptFooterAndSidebar() {
  while (content.childElementCount > 2) {
    content.lastChild.remove();
  }
}