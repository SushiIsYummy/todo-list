const sharedDialogElements = {
  initializeElements() {
    this.dueDatePara = document.querySelector('.task-due-date-para');
    this.dateTimeDialog = document.querySelector('.task-date-time-dialog');
    this.addTaskDialog = document.querySelector('.footer-add-task-dialog');
    this.sidebarDialog = document.querySelector('.sidebar-dialog');
  }
}

export default sharedDialogElements;