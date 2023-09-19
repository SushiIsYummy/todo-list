import sidebarUtils from "../sidebar/sidebarUtilitiesManager";

function createAddProjectDialog() {
  let content = document.querySelector('#content');

  let addProjectDialog = document.createElement('dialog');
  addProjectDialog.classList.add('add-project-dialog');

  let addProjectForm = document.createElement('form');
  addProjectForm.classList.add('add-project-form');
  
  let addProjectHeader = document.createElement('header');
  addProjectHeader.classList.add('add-project-item-header');

  let addProjectTitle = document.createElement('h1');
  addProjectTitle.classList.add('add-project-item-name');
  addProjectTitle.textContent = 'Add Project';

  let nameInput = document.createElement('input');
  nameInput.classList.add('add-project-dialog-name-input');
  nameInput.placeholder = 'Project Name';
  nameInput.required = true;
  nameInput.minLength = 1;

  let addProjectDialogActionButtons = document.createElement('div');
  addProjectDialogActionButtons.classList.add('add-project-dialog-action-buttons');

  let addProjectDialogCancelButton = document.createElement('button');
  addProjectDialogCancelButton.classList.add('add-project-dialog-cancel-button');
  addProjectDialogCancelButton.textContent = 'CANCEL';
  addProjectDialogCancelButton.type = 'button';

  let addProjectDialogConfirmButton = document.createElement('button');
  addProjectDialogConfirmButton.classList.add('add-project-dialog-confirm-button');
  addProjectDialogConfirmButton.textContent = 'CONFIRM';
  addProjectDialogConfirmButton.type = 'submit';

  addProjectDialogActionButtons.append(addProjectDialogCancelButton, addProjectDialogConfirmButton);

  addProjectHeader.appendChild(addProjectTitle);
  addProjectForm.append(addProjectHeader, nameInput, addProjectDialogActionButtons);
  addProjectDialog.appendChild(addProjectForm);

  content.appendChild(addProjectDialog);
  activateAddProjectButton();
  activateAddProjectDialogActionButtons();
}

function activateAddProjectButton() {
  let addProjectButton = document.querySelector('.add-project-button');
  let addProjectDialog = document.querySelector('.add-project-dialog');

  addProjectButton.addEventListener('click', () => {
    addProjectDialog.showModal();
  });
}

function activateAddProjectDialogActionButtons() {
  let addProjectDialog = document.querySelector('.add-project-dialog');
  let addProjectForm = document.querySelector('.add-project-form');
  let cancelButton = document.querySelector('.add-project-dialog-cancel-button')
  let nameInput = document.querySelector('.add-project-dialog-name-input');
  
  cancelButton.addEventListener('click', () => {
    addProjectDialog.close();
    clearAddProjectForm();
  });
  
  addProjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let nameInput = document.querySelector('.add-project-dialog-name-input');
    let projectList = JSON.parse(localStorage.getItem('projectsList'));

    if (projectNameExists(nameInput.value)) {
      nameInput.setCustomValidity('The project name already exists. Please enter a different name.');
      nameInput.reportValidity();
      return;
    }

    if (projectList !== null) {
      projectList.push(nameInput.value);
      localStorage.setItem('projectsList', JSON.stringify(projectList));
      clearAddProjectForm();
    } else {
      projectList = ['Home'];
      projectList.push(nameInput.value);
      localStorage.setItem('projectsList', JSON.stringify(projectList));
    }
    sidebarUtils.updateSidebarProjectsList();

    const projectAddedRemovedRenamed = new Event('projectAddedRemovedRenamed');
    window.dispatchEvent(projectAddedRemovedRenamed);
    addProjectDialog.close();
  });

  // remove error message if one is displayed while user is typing
  nameInput.addEventListener('input', (e) => {
    if (e.target.validity.customError) {
      e.target.setCustomValidity('');
    } 
  });
}

function projectNameExists(projectName) {
  let projectsList = JSON.parse(localStorage.getItem('projectsList'));
  if (projectsList.includes(projectName)) {
    return true;
  }
  return false;
}

function clearAddProjectForm() {
  let addProjectDialogForm = document.querySelector('.add-project-form');
  addProjectDialogForm.reset();
}

export default createAddProjectDialog;