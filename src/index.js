import createSidebar from './pages/sidebar';
import createFooter from './pages/footer';
import createInbox from './pages/inbox';

import './styles/global.css';
import './styles/sidebar.css';
import './styles/footer.css'
import './styles/inbox.css'
import './styles/today.css';
import createToday from './pages/today';

createSidebar();
createFooter(); 
// createToday();
createInbox();

let content = document.querySelector('#content');
let inbox = document.querySelector('.sidebar-item.inbox');
let today = document.querySelector('.sidebar-item.today');
let upcoming = document.querySelector('.sidebar-item.upcoming');
let sidebarDialog = document.querySelector('.sidebar-dialog');

inbox.addEventListener('click', () => {
  removeAllElements();
  createInbox();
});

today.addEventListener('click', () => {
  removeAllElements();
  createToday();
});
// createInbox();
// createToday();

function removeAllElements() {
  while (content.childElementCount > 2) {
    content.lastChild.remove();
  }
}