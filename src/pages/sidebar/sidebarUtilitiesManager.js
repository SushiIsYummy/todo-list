import * as utils from '../utils';

const sidebarUtilitiesManager = {
  updateSidebarProjectsList() {
    let projectList = JSON.parse(localStorage.getItem('projectsList'));
    let projectsListElement = document.querySelector('.projects-list');
    utils.clearAllChildrenOfElement(projectsListElement);

    if (projectList !== null) {
      for (let i = 0; i < projectList.length; i++) {
        let projectItem = document.createElement('li');
        projectItem.classList.add('projects-list-item');
        projectItem.setAttribute('data-project-name', projectList[i]);
    
        let projectItemName = document.createElement('p');
        projectItemName.textContent = projectList[i];
    
        projectItem.appendChild(projectItemName);
        projectsListElement.appendChild(projectItem);
      }
    }
  },

  clearAddProjectForm() {
    let addProjectDialogForm = document.querySelector('.add-project-form');
    addProjectDialogForm.reset();
  },
  
  projectNameExists(projectName) {
    let projectsList = JSON.parse(localStorage.getItem('projectsList'));
    if (projectsList.includes(projectName)) {
      return true;
    }
  
    return false;
  }
}

export default sidebarUtilitiesManager;