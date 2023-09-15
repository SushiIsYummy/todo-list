import scrollIntoView from 'scroll-into-view-if-needed'
import { updateTaskList, addTaskToTaskList } from './tasks';
import { addMarginBottomToTaskList, addMarginTopToTaskList } from '../utils';

function createProjectPage(projectName) {
  let content = document.querySelector('#content');

  let projectContainer = document.createElement('div');
  projectContainer.classList.add('project-container');

  let projectHeader = document.createElement('header');
  projectHeader.classList.add('project-header');
  projectHeader.setAttribute('data-project-name', projectName);

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
  
  window.addEventListener('taskAddedToLocalStorage', function() {
    addTaskToTaskList(projectName, projectList);
  });
  window.addEventListener('taskItemUpdated', () => {
    updateTaskList(projectName, projectList);
  })
  
  addMarginTopToTaskList(projectHeader, projectList);
  addMarginBottomToTaskList(projectList);
}

export default createProjectPage;