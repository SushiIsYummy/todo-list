import createSidebar from './pages/sidebar';
import createFooter from './pages/footer/footerBuilder';
import createInbox from './pages/inbox';

import './styles/global.css';
import './styles/sidebar.css';
import './styles/footer.css'
import './styles/inbox.css'
import './styles/today.css';
import createToday from './pages/today';
import flatpickr from 'flatpickr';
createSidebar();
createFooter(); 
createToday();
// createInbox();

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

// let dueDate = document.querySelector('.task-due-date');
// let dueDateFlatpickr = document.querySelector('.task-due-date')._flatpickr;
// console.log(dueDateFlatpickr);
// dueDate.addEventListener('click', () => {
//   let calendar = document.querySelector('.flatpickr-calendar');
//   let calendarHeight = getComputedStyle(calendar).height;
//   let dialog = document.querySelector('.footer-add-task-dialog');
//   dialog.style.top = `500px`;
//   dialog.style.height = '600px';
//   console.log(calendarHeight);
// })


// createInbox();
// createToday();

// flatpickr('.task-due-date', {
  // altInput: true,
  // altFormat: 'F j, Y',
  // dateFormat: 'Y-m-d',
  // // Other options go here
// });


// // console.log(dueDate.value);
// dueDate.addEventListener('change', () => {
//   console.log('changed value to: ' + dueDate.value);
//   // datepicker.altInput.value = 'hi'
//   if (dueDate.value === '') {
//     datePicker.altInput.value = 'No Date';
//   } else {
//     datePicker.altInput.value = 'Hello';
//   }
//   // datepicker.config.onClose.push(() => {
//   //     // Set the altInput value to 'Hello'
//   //     console.log(datepickerElement.value);
//   // });
// })

function removeAllElements() {
  while (content.childElementCount > 2) {
    content.lastChild.remove();
  }
}