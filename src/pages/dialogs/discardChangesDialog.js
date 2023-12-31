import { hideDialogWithAnimation } from "../../utils";
import { clearAddTaskForm } from "./addTaskDialog";
import sharedElements from "./sharedElements";

function createDiscardChangesDialog() {
  let content = document.querySelector('#content');
  
  let dialog = document.createElement('dialog');
  dialog.classList.add('discard-changes-dialog');

  let label = document.createElement('p');
  label.classList.add('discard-changes-dialog-header');
  label.textContent = 'Discard Changes?';

  let para = document.createElement('p');
  para.classList.add('discard-changes-warning-message');
  para.textContent = 'The changes you\'ve made will not be saved.';

  let cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.classList.add('discard-changes-cancel-button');
  cancelButton.textContent = 'CANCEL'

  let discardButton = document.createElement('button');
  discardButton.type = 'button';
  discardButton.classList.add('discard-changes-discard-button');
  discardButton.textContent = 'DISCARD';

  let buttons = document.createElement('div');
  buttons.classList.add('discard-changes-buttons');

  buttons.append(cancelButton, discardButton);

  dialog.append(label, para, buttons);

  content.appendChild(dialog);

  activateDiscardChangesButtons();
}

function activateDiscardChangesButtons() {
  let cancelButton = document.querySelector('.discard-changes-cancel-button');
  let discardButton = document.querySelector('.discard-changes-discard-button');
  let discardChangesDialog = document.querySelector('.discard-changes-dialog');

  cancelButton.addEventListener('click', () => {
    discardChangesDialog.close();
  });

  discardButton.addEventListener('click', () => {
    hideDialogWithAnimation(sharedElements.addTaskDialog);
    discardChangesDialog.close();
    clearAddTaskForm();
  });

}

export default createDiscardChangesDialog;