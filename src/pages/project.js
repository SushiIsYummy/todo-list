import scrollIntoView from 'scroll-into-view-if-needed'
import { updateTaskList, addTaskToTaskList } from './task-list-updater';
import { addMarginBottomToTaskList, addMarginTopToTaskList, setDropdownLocationToCurrentPage } from '../utils';

function createProjectPage(projectName) {
  let content = document.querySelector('#content');

  let projectContainer = document.createElement('div');
  projectContainer.classList.add('project-container');

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

  projectHeader.appendChild(projectTitle);
  projectMainContent.appendChild(projectList);
  projectContainer.appendChild(projectHeader);
  projectContainer.appendChild(projectMainContent);

  content.appendChild(projectContainer);

  updateTaskList(projectName, projectList);
  // setDropdownLocationToCurrentPage();

  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskList(projectName, projectList);
  });
  
  addMarginTopToTaskList(projectHeader, projectList);
  addMarginBottomToTaskList(projectList);
}

export default createProjectPage;