export function addMarginTop(headerElement, mainElement) {
  mainElement.style.marginTop = getComputedStyle(headerElement).height;
}

export function addMarginBottom(mainElement) {
  let footerBar = document.querySelector('.footer-bar');
  mainElement.style.marginBottom = getComputedStyle(footerBar).height;
}