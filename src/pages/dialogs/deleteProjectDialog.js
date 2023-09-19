import { hideDialogWithAnimation, removeAllElementsExceptFooterSidebarDialogs } from "../../utils";
import sidebarUtils from "../sidebar/sidebarUtilitiesManager";
import { removeAllTasksWithProjectNameInLocalStorage, removeProjectFromLocalStorage } from "../tasks";
import createToday from "../today";
import { clearAddTaskForm } from "./addTaskDialog";
import sharedElements from "./sharedElements";

function createDeleteProjectDialog() {
  let content = document.querySelector('#content');
  
  let dialog = document.createElement('dialog');
  dialog.classList.add('delete-project-dialog');

  let label = document.createElement('h1');
  label.classList.add('dialog-header');
  label.textContent = 'Delete project?';

  let para = document.createElement('p');
  para.classList.add('warning-message');
  para.textContent = 
  'This will permanently delete {} and all of its tasks and can\'t be undone';

  let cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.classList.add('cancel-button');
  cancelButton.textContent = 'CANCEL'

  let deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'DELETE';

  let buttons = document.createElement('div');
  buttons.classList.add('action-buttons');

  buttons.append(cancelButton, deleteButton);

  dialog.append(label, para, buttons);

  content.appendChild(dialog);

  actionButtonsHandler(dialog);
}

function actionButtonsHandler(dialog) {
  let cancelButton = dialog.querySelector('.cancel-button');
  let deleteButton = dialog.querySelector('.delete-button');
  
  cancelButton.addEventListener('click', () => {
    dialog.close();
  });
  
  deleteButton.addEventListener('click', () => {
    let header = document.querySelector('header[data-task-location]');
    let projectName = null;

    if (header) {
      projectName = header.dataset.taskLocation;
    } else {
      return;
    }

    sidebarUtils.removeSidebarProject(projectName);
    removeAllTasksWithProjectNameInLocalStorage(projectName);
    removeProjectFromLocalStorage(projectName);
    
    removeAllElementsExceptFooterSidebarDialogs();
    createToday();

    const projectAddedRemovedRenamed = new Event('projectAddedRemovedRenamed');
    window.dispatchEvent(projectAddedRemovedRenamed);

    dialog.close();
  });

}

export function setWarningMessage(projectName) {
  let warningMessage = document.querySelector('.delete-project-dialog .warning-message');
  warningMessage.textContent = 
  `This will permanently delete "${projectName}" and all of its tasks and can\'t be undone.`;
}

export function showDialog() {
  let dialog = document.querySelector('.delete-project-dialog');
  dialog.showModal();
}

export default createDeleteProjectDialog;