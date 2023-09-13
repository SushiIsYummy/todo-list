import * as utils from '/src/utils';

const sidebarUtilitiesManager = {
  updateSidebarProjectsList() {
    let projectsList = JSON.parse(localStorage.getItem('projectsList'));
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
  }
}

export default sidebarUtilitiesManager;