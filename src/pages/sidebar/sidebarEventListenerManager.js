import createProjectPage from "../project";
import sidebarUtils from "./sidebarUtilitiesManager";
import * as utils from '/src/utils';

const sidebarEventListenerManager = {
  closeSidebarOnItemClick() {
    let sidebar = document.querySelector('.sidebar-dialog');
    let sidebarList = document.querySelector('.sidebar-list');

    sidebarList.addEventListener('click', (e) => {
      let clickedElement = e.target;
      // console.log(clickedElement);
      if (clickedElement.tagName === 'LI' && clickedElement.classList.contains('close-sidebar')) {
        utils.hideDialogWithAnimation(sidebar);
      } else if (clickedElement.tagName === 'A' || clickedElement.tagName === 'P') {
        // console.log(clickedElement);
        let liElement = clickedElement.closest('li');
        if (liElement.classList.contains('close-sidebar')) {
          utils.hideDialogWithAnimation(sidebar);
        }
      }
    });
  },

  goToProjectPageOnProjectItemClick() {
    let projectsList = document.querySelector('.projects-list');
    let projectHeader = document.querySelector('project-header');
    
    projectsList.addEventListener('click', (e) => {
      let clickedElement = e.target;
      if (clickedElement.classList.contains('projects-list-item')) {
        if (projectHeader !== null && projectHeader.dataset.projectName !== e.target.dataset.projectName) {
          // if already on the project page
          // do nothing
          return;
        }
        utils.removeAllElementsExceptFooterSidebarDialogs();
        utils.removeCurrentPage();
        createProjectPage(clickedElement.dataset.projectName);
        const pageChanged = new Event('pageChanged');
        window.dispatchEvent(pageChanged);
      } else if (clickedElement.tagName !== 'LI') {
        let liElement = clickedElement.closest('li');
        if (liElement) {
          if (liElement.classList.contains('projects-list-item')) {
            if (projectHeader !== null && projectHeader.dataset.projectName !== e.target.dataset.projectName) {
              // if already on the project page
              // do nothing
              return;
            }
            utils.removeAllElementsExceptFooterSidebarDialogs();
            utils.removeCurrentPage();
            createProjectPage(liElement.dataset.projectName);
            const pageChanged = new Event('pageChanged');
            window.dispatchEvent(pageChanged);
          }
        } 
      }
    });
  },

  setSidebarSVGColors(sidebarItemSVG) {
    sidebarItemSVG.addEventListener('load', () => {
      const svgIframeWindow = sidebarItemSVG.contentWindow;
      const svgIframeDocument = svgIframeWindow.document;
      const pathElement = svgIframeDocument.querySelector('svg');
  
      if (sidebarItemSVG.classList.contains('inbox-svg')) {
        pathElement.style.fill = 'blue';
      } else if (sidebarItemSVG.classList.contains('today-svg')) {
        pathElement.style.fill = 'green'
      } else if (sidebarItemSVG.classList.contains('upcoming-svg')) {
        pathElement.style.fill = 'purple'
      }
    })
  },

}

export default sidebarEventListenerManager;