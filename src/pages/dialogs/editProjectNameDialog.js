import sidebarUtils from "../sidebar/sidebarUtilitiesManager";
import { getProjectsListFromLocalStorage, moveTaskLocationsOfTasks } from "../tasks";

function createEditProjectNameDialog() {
  let content = document.querySelector('#content');

  let editProjectNameDialog = document.createElement('dialog');
  editProjectNameDialog.classList.add('edit-project-name-dialog');

  let editProjectNameForm = document.createElement('form');
  editProjectNameForm.classList.add('edit-project-name-form');
  
  let editProjectNameHeader = document.createElement('header');
  editProjectNameHeader.classList.add('edit-project-name-header');

  let editProjectNameTitle = document.createElement('h1');
  editProjectNameTitle.classList.add('edit-project-name-item-name');
  editProjectNameTitle.textContent = 'Edit Project Name';

  let nameInput = document.createElement('input');
  nameInput.classList.add('name-input');
  nameInput.placeholder = 'Project Name';
  nameInput.required = true;
  nameInput.minLength = 1;

  let actionButtons = document.createElement('div');
  actionButtons.classList.add('action-buttons');

  let cancelButton = document.createElement('button');
  cancelButton.classList.add('cancel-button');
  cancelButton.textContent = 'CANCEL';
  cancelButton.type = 'button';

  let deleteButton = document.createElement('button');
  deleteButton.classList.add('confirm-button');
  deleteButton.textContent = 'CONFIRM';
  deleteButton.type = 'submit';

  actionButtons.append(cancelButton, deleteButton);

  editProjectNameHeader.appendChild(editProjectNameTitle);
  editProjectNameForm.append(editProjectNameHeader, nameInput, actionButtons);
  editProjectNameDialog.appendChild(editProjectNameForm);

  content.appendChild(editProjectNameDialog);

  handleActionButtons(editProjectNameDialog);
  // editProjectNameDialog.showModal();
}

function handleActionButtons(editProjectNameDialog) {
  let cancelButton = editProjectNameDialog.querySelector('.cancel-button');
  let confirmButton = editProjectNameDialog.querySelector('.confirm-button');
  let nameInput = editProjectNameDialog.querySelector('.name-input');
  let editProjectNameForm = editProjectNameDialog.querySelector('.edit-project-name-form');

  cancelButton.addEventListener('click', () => {
    editProjectNameDialog.close();
  });

  editProjectNameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let projectsList = getProjectsListFromLocalStorage();
    let taskLocationHeader = document.querySelector('header[data-task-location]');
    let oldProjectName = null;
    let index = -1;
    let newProjectName = nameInput.value;

    if (newProjectName === '') {
      return;
    }

    if (taskLocationHeader) {
      oldProjectName = taskLocationHeader.dataset.taskLocation;
      index = projectsList.indexOf(oldProjectName);
    }

    if (index !== -1) {
      let projectTitle = taskLocationHeader.querySelector('.project-title');
      projectTitle.textContent = newProjectName;
      projectsList[index] = newProjectName;
      taskLocationHeader.dataset.taskLocation = newProjectName;
      sidebarUtils.updateSingleSidebarProjectName(oldProjectName, newProjectName);
      moveTaskLocationsOfTasks(oldProjectName, newProjectName);
    }

    closeDialog();

    localStorage.setItem('projectsList', JSON.stringify(projectsList));

    const projectAddedRemovedRenamed = new Event('projectAddedRemovedRenamed');
    window.dispatchEvent(projectAddedRemovedRenamed);
    
  });
}

export function setProjectNameInput(projectName) {
  let nameInput = document.querySelector('.edit-project-name-dialog .name-input');
  nameInput.value = projectName;
}

export function showDialog() {
  let editProjectNameDialog = document.querySelector('.edit-project-name-dialog');
  editProjectNameDialog.showModal();
}

export function closeDialog() {
  let editProjectNameDialog = document.querySelector('.edit-project-name-dialog');
  editProjectNameDialog.close();

}
function clearForm() {
  let nameInput = document.querySelector('.edit-project-name-dialog .name-input');
  nameInput.value = '';
}
export default createEditProjectNameDialog;