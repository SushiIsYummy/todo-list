import { getProjectsListFromLocalStorage } from '../tasks';
import * as utils from '/src/utils';

const sidebarUtilitiesManager = {
  updateSidebarProjectsList() {
    let projectsList = getProjectsListFromLocalStorage();
    let projectsListElement = document.querySelector('.projects-list');
    utils.clearAllChildrenOfElement(projectsListElement);

    if (projectsList === null) {
      projectsList = ['Home'];
      localStorage.setItem('projectsList', JSON.stringify(projectsList));
    }

    for (let i = 0; i < projectsList.length; i++) {
      let projectItem = document.createElement('li');
      projectItem.classList.add('projects-list-item');
      projectItem.classList.add('close-sidebar');
      projectItem.setAttribute('data-project-name', projectsList[i]);
  
      let projectItemName = document.createElement('p');
      projectItemName.textContent = projectsList[i];
  
      projectItem.appendChild(projectItemName);
      projectsListElement.appendChild(projectItem);
    }
  },

  updateSingleSidebarProjectName(oldProjectName, newProjectName) {
    let projectLi = document.querySelector(`.projects-list-item[data-project-name="${oldProjectName}"]`)
    let p = projectLi.querySelector('p');

    if (projectLi) {
      p.textContent = newProjectName;
      projectLi.dataset.projectName = newProjectName;
    }
  },

  removeSidebarProject(projectName) {
    let projectLi = document.querySelector(`.projects-list-item[data-project-name="${projectName}"]`);
    projectLi.remove();
  }
}

export default sidebarUtilitiesManager;