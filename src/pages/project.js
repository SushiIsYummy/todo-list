import scrollIntoView from 'scroll-into-view-if-needed'
import { updateTaskList, addTaskToTaskList } from './task-list-updater';
import { addMarginBottomToTaskList, addMarginTopToTaskList, createKebabMenu, setDropdownLocationToCurrentPage } from '../utils';
import * as editProjectNameDialog from '/src/pages/dialogs/editProjectNameDialog';
import * as deleteProjectDialog from '/src/pages/dialogs/deleteProjectDialog';

function createProjectPage(projectName) {
  let content = document.querySelector('#content');

  let pageContainer = document.querySelector('.page-container');

  let projectContainer = document.createElement('div');
  projectContainer.classList.add('project-container');
  projectContainer.classList.add('page');

  let projectHeader = document.createElement('header');
  projectHeader.classList.add('project-header');
  projectHeader.setAttribute('data-task-location', projectName);

  let projectTitle = document.createElement('h1');
  projectTitle.classList.add('project-title');
  projectTitle.textContent = projectName;

  let projectMainContent = document.createElement('main');
  projectMainContent.classList.add('project-main-content');

  let projectList = document.createElement('ul');
  projectList.classList.add('project-list');

  let options = ['Edit Project Name', 'Delete Project'];
  let kebabMenu = createKebabMenu(options);
  // console.log(kebabMenu)
  projectHeader.append(projectTitle, kebabMenu);
  projectMainContent.appendChild(projectList);
  projectContainer.appendChild(projectHeader);
  projectContainer.appendChild(projectMainContent);

  // content.appendChild(projectContainer);
  pageContainer.appendChild(projectContainer);

  kebabMenuOptionsHandler(kebabMenu);

  updateTaskList(projectName, projectList);

  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskList(projectName, projectList);
  });
  
  // addMarginTopToTaskList(projectHeader, projectList);
  addMarginBottomToTaskList(projectList);
}

function kebabMenuOptionsHandler(kebabMenu) {
  let menuList = kebabMenu.querySelector('.menu-list');
  
  
  menuList.addEventListener('click', (e) => {
    let clickedElement = e.target;
    let projectHeader = document.querySelector('header[data-task-location]');
    let projectName = null;

    if (projectHeader) {
      projectName = projectHeader.dataset.taskLocation;
    } else {
      return;
    }

    if (clickedElement.tagName === 'LI') {
      if (clickedElement.classList.contains('edit-project-name')) {
        editProjectNameDialog.showDialog();
        editProjectNameDialog.setProjectNameInput(projectName);
      } else if (clickedElement.classList.contains('delete-project')) {
        deleteProjectDialog.showDialog();
        deleteProjectDialog.setWarningMessage(projectName);
      }
      return;
    }
    
    if (clickedElement.tagName !== 'LI') {
      let liElement = clickedElement.closest('li');
      if (liElement) {
        if (liElement.classList.contains('edit-project-name')) {
          editProjectNameDialog.showDialog();
          editProjectNameDialog.setProjectNameInput(projectName);
        } else if (liElement.classList.contains('delete-project')) {
          deleteProjectDialog.showDialog();
          deleteProjectDialog.setWarningMessage(projectName);
        }
      }
    }
  })
}
export default createProjectPage;