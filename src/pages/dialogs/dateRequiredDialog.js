function createDateRequiredDialog() {
  let content = document.querySelector('#content');

  let dateRequiredDialog = document.createElement('dialog');
  dateRequiredDialog.classList.add('date-required-dialog');

  let header = document.createElement('h1');
  header.classList.add('date-required-dialog-header');
  header.textContent = 'Date Required With Time';

  let para = document.createElement('p');
  para.classList.add('date-required-para');
  para.textContent = `A selected time must be accompanied with a selected date.`;

  let okButton = document.createElement('button');
  okButton.type = 'button';
  okButton.classList.add('date-required-dialog-ok-button');
  okButton.textContent = 'OK';

  dateRequiredDialog.append(header, para, okButton);

  content.appendChild(dateRequiredDialog);

  activateDateRequiredDialogOkButton();
}

function activateDateRequiredDialogOkButton() {
  let okButton = document.querySelector('.date-required-dialog-ok-button');
  let dateRequiredDialog = document.querySelector('.date-required-dialog');

  okButton.addEventListener('click', () => {
    dateRequiredDialog.close();
  })
}

export default createDateRequiredDialog;